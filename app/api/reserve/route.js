// app/api/reserve/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

/* =====================================================
   CONFIG
===================================================== */

const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "garageautotuneup@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPA_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/reservations`;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* Booking limit */
const MAX_BOOKING_YEAR = 2026;
const MAX_BOOKING_MONTH = 11; // 0-based => 11 == December
const MAX_BOOKING_DAY = 31;

/* Opening Hours */
const openingHoursConfig = {
  0: null, // Sunday closed
  1: ["08:00", "19:00"],
  2: ["08:00", "19:00"],
  3: ["08:00", "19:00"],
  4: ["08:00", "19:00"],
  5: ["09:00", "19:00"],
  6: ["09:00", "12:00"],
};

function generateHours(start, end) {
  const hours = [];
  let [h, m] = start.split(":").map(Number);
  while (true) {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}`;
    hours.push(formatted);
    if (formatted === end) break;
    h += 1;
    m = 0;
  }
  return hours;
}

/* =====================================================
   VALIDATION
===================================================== */

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
}
function isValidPhone(phone) {
  return /^(\+?\d{8,16})$/.test((phone || "").replace(/[\s-]/g, ""));
}
function isValidBelgianPhone(p) {
  if (!p) return false;
  const cleaned = p.replace(/[\s-]/g, "");
  return /^\+32\d{8,9}$/.test(cleaned) || /^0\d{8,9}$/.test(cleaned);
}
function isValidBelgianPlate(plate) {
  if (!plate) return true; // پلاک اختیاریه

  const cleaned = plate.trim().toUpperCase().replace(/[\s-]/g, "");

  // فرمت جدید: 1-ABC-123  => 1ABC123
  const newFormat = /^[1-9][A-Z]{3}\d{3}$/;

  // فرمت‌های قدیمی: ABC-123 یا 123-ABC  => ABC123 یا 123ABC
  const oldFormat = /^([A-Z]{3}\d{3}|\d{3}[A-Z]{3})$/;

  return newFormat.test(cleaned) || oldFormat.test(cleaned);
}

function isValidDateStr(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date || "");
}
function isValidTimeStr(time) {
  return /^\d{2}:\d{2}$/.test(time || "");
}

/* =====================================================
   GET — PUBLIC SAFE VERSION (only date + time)
===================================================== */

export async function GET() {
  try {
    const res = await fetch(`${SUPA_URL}?select=date,time`, {
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error loading reservations" },
        { status: 500 }
      );
    }

    const rows = await res.json();

    return NextResponse.json({
      reservations: rows.map((r) => ({
        date: r.date,
        time: r.time,
      })),
    });
  } catch (err) {
    console.error("GET /reserve error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* =====================================================
   POST — CREATE RESERVATION + EMAILS
===================================================== */

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      license_plate,
      service_type,
      date,
      time,
      message,
    } = body;

    /* Required fields */
    if (!full_name || !email || !phone || !service_type || !date || !time) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    /* Validation */
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone) || !isValidBelgianPhone(phone)) {
      return NextResponse.json(
        { error: "Numéro de téléphone belge invalide." },
        { status: 400 }
      );
    }

    if (!isValidBelgianPlate(license_plate)) {
      return NextResponse.json(
        { error: "Plaque belge invalide." },
        { status: 400 }
      );
    }

    if (!isValidDateStr(date)) {
      return NextResponse.json(
        { error: "Format de date invalide." },
        { status: 400 }
      );
    }

    if (!isValidTimeStr(time)) {
      return NextResponse.json(
        { error: "Format de l'heure invalide." },
        { status: 400 }
      );
    }

    /* Date rules */
    const today = new Date();
    const bookingDate = new Date(`${date}T00:00:00`);
    const maxDate = new Date(MAX_BOOKING_YEAR, MAX_BOOKING_MONTH, MAX_BOOKING_DAY);

    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (bookingDate < todayMidnight) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas réserver dans le passé." },
        { status: 400 }
      );
    }

    if (bookingDate > maxDate) {
      return NextResponse.json(
        { error: "Les réservations au-delà de 2026 ne sont pas encore ouvertes." },
        { status: 400 }
      );
    }

    /* Working hours */
    const weekday = bookingDate.getDay();
    const hoursRange = openingHoursConfig[weekday];

    if (!hoursRange) {
      return NextResponse.json(
        { error: "Ce jour-là, le garage est fermé." },
        { status: 400 }
      );
    }

    const allowedHours = generateHours(hoursRange[0], hoursRange[1]);

    if (!allowedHours.includes(time)) {
      return NextResponse.json(
        { error: "Cet horaire ne correspond pas aux heures d'ouverture." },
        { status: 400 }
      );
    }

    /* Double booking check */
    const checkRes = await fetch(
      `${SUPA_URL}?select=id&date=eq.${date}&time=eq.${time}&limit=1`,
      {
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!checkRes.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la vérification du créneau." },
        { status: 500 }
      );
    }

    const existing = await checkRes.json();
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ce créneau est déjà réservé." },
        { status: 400 }
      );
    }

    /* INSERT reservation */
    const saveRes = await fetch(SUPA_URL, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        full_name,
        email,
        phone,
        license_plate,
        service_type,
        date,
        time,
        message,
      }),
    });

    if (!saveRes.ok) {
      console.error("Supabase insert error:", await saveRes.text());
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement de la réservation." },
        { status: 500 }
      );
    }

    /* =====================================================
       EMAIL — ADMIN (Black/Gold Supercar Layout)
    ====================================================== */
    const adminHTML = `
      <div style="background:#0d0d0d;padding:28px;border-radius:14px;color:#fff;font-family:Arial, sans-serif;">
        <h2 style="color:#FFD36A;text-align:center;margin-bottom:12px;">Nouvelle réservation</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td><b style="color:#FFD36A">Nom:</b></td><td>${full_name}</td></tr>
          <tr><td><b style="color:#FFD36A">Email:</b></td><td>${email}</td></tr>
          <tr><td><b style="color:#FFD36A">Téléphone:</b></td><td>${phone}</td></tr>
          <tr><td><b style="color:#FFD36A">Plaque:</b></td><td>${license_plate || "-"}</td></tr>
          <tr><td><b style="color:#FFD36A">Service:</b></td><td>${service_type}</td></tr>
          <tr><td><b style="color:#FFD36A">Date:</b></td><td>${date}</td></tr>
          <tr><td><b style="color:#FFD36A">Heure:</b></td><td>${time}</td></tr>
        </table>
        <p style="margin-top:18px;"><b style="color:#FFD36A">Message:</b><br>${message || "-"}</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "Garage Auto TuneUp <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: "Nouvelle réservation reçue",
        html: adminHTML,
      });
    } catch (e) {
      console.error("Admin email send error:", e);
      // continue; don't block user
    }

    /* =====================================================
       EMAIL — CUSTOMER (Premium Confirmation)
    ====================================================== */
    const customerHTML = `
      <div style="background:#0c0c0c;padding:26px;border-radius:14px;color:#fff;font-family:Arial,sans-serif;">
        <h2 style="text-align:center;color:#FFD36A;">Confirmation de réservation</h2>
        <p>Bonjour <b>${full_name}</b>,</p>
        <p>Nous avons bien reçu votre réservation. Nous vous contacterons rapidement pour confirmer les détails.</p>

        <div style="margin-top:20px;padding:16px;border-radius:12px;background:#1a1a1a;border:1px solid #333;">
          <p><b style="color:#FFD36A">Date:</b> ${date}</p>
          <p><b style="color:#FFD36A">Heure:</b> ${time}</p>
          <p><b style="color:#FFD36A">Service:</b> ${service_type}</p>
        </div>

        <p style="margin-top:22px;">Merci pour votre confiance,<br><b>Garage Auto TuneUp</b></p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "Garage Auto TuneUp <onboarding@resend.dev>",
        to: email,
        subject: "Confirmation de réservation",
        html: customerHTML,
      });
    } catch (e) {
      console.error("Customer email send error:", e);
      // don't fail booking for mail error
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /reserve error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
