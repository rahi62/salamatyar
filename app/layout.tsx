import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

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
      <body className={`${myFont.className} antialiased`}>{children}</body>
    </html>
  );
}