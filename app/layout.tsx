import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth/context";
import Header from "@/components/Header";
import Footer from "@/components/footer";

const myFont = localFont({
  src: "../public/fonts/Vazirmatn-Regular.woff2",
});

export const metadata: Metadata = {
  title: "سلامت‌یار - کلینیک تخصصی آنلاین",
  description: "پلتفرم جامع نوبت‌دهی آنلاین کلینیک‌های پزشکی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${myFont.className} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
