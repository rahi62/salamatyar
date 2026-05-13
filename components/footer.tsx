import { Stethoscope } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white rounded-2xl border border-slate-200 text-slate-500 py-8 my-4 text-center text-sm shadow-sm mx-auto w-full max-w-7xl flex-none mt-auto">
      <div className="w-full px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-lg text-slate-900">سلامت‌یار</span>
        </div>
        <p className="max-w-md mx-auto leading-relaxed mb-6 text-xs text-slate-400">
          پلتفرم جامع نوبت‌دهی آنلاین کلینیک‌های پزشکی. ارائه دهنده خدمات سریع،
          مطمئن و در دسترس برای همه هموطنان عزیز.
        </p>
        <div className="flex gap-6 mb-6 text-primary-600 text-xs font-semibold">
          <a href="#" className="hover:text-primary-700 transition-colors">
            قوانین و مقررات
          </a>
          <a href="#" className="hover:text-primary-700 transition-colors">
            تماس با ما
          </a>
          <a href="#" className="hover:text-primary-700 transition-colors">
            درباره کلینیک
          </a>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
