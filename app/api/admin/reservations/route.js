// app/api/admin/reservations/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/reservations`;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ========================
// امنیت – بررسی لاگین ادمین
// ========================
function requireAdmin() {
  const cookieStore = cookies();
  const auth = cookieStore.get("admin_auth")?.value;

  if (auth !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// ========================
// GET – لیست رزروها
// ========================
export async function GET() {
  const authError = requireAdmin();
  if (authError) return authError;

  try {
    const url = `${SUPA_URL}?select=*`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Supabase error:", errorText);
      return NextResponse.json(
        { error: "Cannot load reservations" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ reservations: data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

// ========================
// DELETE – حذف یک رزرو
// ========================
export async function DELETE(req) {
  const authError = requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing reservation id" },
        { status: 400 }
      );
    }

    const url = `${SUPA_URL}?id=eq.${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        Prefer: "return=minimal",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Supabase delete error:", text);
      return NextResponse.json(
        { error: "Failed to delete reservation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API DELETE error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
