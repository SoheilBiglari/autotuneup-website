// middleware.js
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // صفحه لاگین آزاد است
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // فقط مسیرهای /admin را چک می‌کنیم
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("admin_auth")?.value;

  // اگر کوکی موجود نباشد → بفرست به صفحه لاگین
  if (cookie !== "ok") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}
  