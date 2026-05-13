// middleware.ts - Authentication middleware
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// صفحات عمومی (بدون نیاز به لاگین)
const publicPaths = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
];

// صفحاتی که نیاز به لاگین دارند
const protectedPaths = ["/book", "/profile", "/doctors", "/track"];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // بررسی اینکه آیا مسیر در لیست صفحات محافظت شده است
  const isProtectedPath = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (isProtectedPath) {
    // بررسی توکن از localStorage (cookie جایگزین)
    const token = request.cookies.get("auth_token");

    if (!token) {
      // ریدایرکت به صفحه لاگین با یادآوری مسیر قبلی
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // اجازه دسترسی
  return NextResponse.next();
}

// مشخص کردن مسیرهایی که middleware روی آنها اجرا شود
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts).*)",
  ],
};
