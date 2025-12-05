// app/api/admin-login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    console.error("❌ ADMIN_PASSWORD is missing in .env");
    return NextResponse.json({ success: false, error: "Server config error." });
  }

  if (password !== adminPass) {
    return NextResponse.json({ success: false, error: "Mot de passe incorrect." });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin_auth", "ok", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
