import { NextResponse } from "next/server";
import { Resend } from "resend";
export const runtime = "nodejs"; // برای اجازه استفاده از crypto


const CONTACT_EMAIL =
  process.env.CONTACT_NOTIFICATION_EMAIL || "garageautotuneup@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================
   📌 Simple Rate-Limit (30s)
============================ */
const RATE_LIMIT = 30 * 1000; // 30 ثانیه
let lastAccess = {};

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message, honey } = body;

    // 🐝 1) HONEYPOT → اسپم
    if (honey && honey.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // 🌐 2) RATE LIMIT
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();

    if (lastAccess[ip] && now - lastAccess[ip] < RATE_LIMIT) {
      return NextResponse.json(
        { error: "Trop de messages. Réessayez dans quelques secondes." },
        { status: 429 }
      );
    }

    lastAccess[ip] = now;

    // 🔒 3) Validation ساده
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    /* ================================
       ✉ 4) SEND EMAIL via RESEND
    ================================= */
    await resend.emails.send({
      from: "Garage Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      subject: "📩 Nouveau message via formulaire contact",
      html: `
        <h2>Nouveau message reçu</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || "-"}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    });

    /* ================================
       🗄 5) SAVE TO SUPABASE (OPTIONAL)
    ================================= */
    const SUPA_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/contact_messages`;
    const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await fetch(SUPA_URL, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        created_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
