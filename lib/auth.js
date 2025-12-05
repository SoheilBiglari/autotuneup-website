// lib/auth.js
import jwt from "jsonwebtoken";

const SECRET = process.env.ADMIN_SECRET;

if (!SECRET) {
  // برای اینکه موقع توسعه حواست باشه
  console.warn("⚠ ADMIN_SECRET is not set in environment variables.");
}

export function signToken(payload) {
  if (!SECRET) throw new Error("ADMIN_SECRET is missing");
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  if (!SECRET) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setAuthCookie(token) {
  const week = 60 * 60 * 24 * 7; // 7 days
  return `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${week}`;
}

export function removeAuthCookie() {
  return "admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
