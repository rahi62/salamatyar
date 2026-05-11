'use client';

import React from 'react';
import { Calendar, Search, Users, Shield, Clock, HeartPulse } from 'lucide-react';

// Re-export departments for use in other components
export { departments } from '@/data';

export default function HomeView({ setView }: { setView: (view: string) => void }) {
  return (
    <div className="animate-in fade-in duration-700 flex-1 grid grid-cols-1 md:grid-cols-4 md:grid-rows-[auto_auto] gap-4 h-full">
      {/* Hero Section */}
      <section className="col-span-1 md:col-span-2 md:row-span-2 bg-slate-900 text-white rounded-3xl overflow-hidden shadow-sm relative p-8 flex flex-col justify-center min-h-[400px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col h-full justify-center gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
              نوبت‌دهی آنلاین <br/><span className="text-primary-400">بهترین متخصصان</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium max-w-sm">
              بدون نیاز به مراجعه حضوری، در کمترین زمان از پزشک متخصص خود نوبت بگیرید و وضعیت نوبت خود را پیگیری نمایید.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setView('book')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <Calendar className="w-5 h-5" />
              رزرو نوبت
            </button>
            <button 
              onClick={() => setView('track')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-5 h-5" />
              پیگیری نوبت
            </button>
          </div>
        </div>
        <div className="hidden lg:flex absolute -left-16 -bottom-16 w-80 h-80 bg-white/5 backdrop-blur-xl rounded-[4rem] rotate-12 p-8 border border-white/10 items-center justify-center">
           <HeartPulse className="w-32 h-32 text-primary-500/40" strokeWidth={1} />
        </div>
      </section>

      {/* Feature 1 */}
      <section className="col-span-1 md:col-span-1 md:row-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
           <Clock className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">صرفه جویی زمان</h3>
        <p className="text-slate-500 text-xs leading-relaxed">ثبت نوبت در چند دقیقه بدون معطلی در صفوف و تماس.</p>
      </section>

      {/* Feature 2 */}
      <section className="col-span-1 md:col-span-1 md:row-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
           <Users className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">پزشکان مجرب</h3>
        <p className="text-slate-500 text-xs leading-relaxed">دسترسی به بهترین متخصصان با تجربه در تخصص‌های مختلف.</p>
      </section>

      {/* Feature 3 - Wider card */}
      <section className="col-span-1 md:col-span-2 md:row-span-1 bg-primary-600 p-6 md:p-8 rounded-3xl shadow-lg shadow-primary-200 flex items-center justify-between text-start text-white relative overflow-hidden group border border-primary-500">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 w-full md:w-3/5 pr-2">
          <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4">
             <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold mb-2 text-xl md:text-2xl">امن و مطمئن</h3>
          <p className="text-primary-100 text-xs md:text-sm leading-relaxed">
            حفظ حریم خصوصی و امنیت کامل اطلاعات پزشکی و هویتی شما در پلتفرم یکپارچه سلامت‌یار.
          </p>
        </div>
        <div className="hidden md:flex relative z-10 w-2/5 justify-end items-center opacity-80">
            <Shield className="w-28 h-28 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" strokeWidth={1} />
        </div>
      </section>
    </div>
  );
}