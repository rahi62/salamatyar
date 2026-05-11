import React, { useState } from 'react';
import { Search, Info, Calendar, Clock, User, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { getAppointmentsByNationalId, departments, doctors, Appointment } from '../data';

export default function TrackingView({ onBack }: { onBack: () => void }) {
  const [nationalId, setNationalId] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Appointment[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId) return;
    
    const found = getAppointmentsByNationalId(nationalId, trackingCode);
    setResults(found);
    setHasSearched(true);
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col shadow-sm w-full">
        <div className="mb-8 flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">پیگیری نوبت</h1>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">کد ملی (الزامی)</label>
            <input 
              type="text"
              value={nationalId}
              onChange={e => setNationalId(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all font-mono text-end placeholder-slate-400"
              placeholder="مثال: 0123456789"
              dir="ltr"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">کد پیگیری (اختیاری)</label>
            <input 
              type="text"
              value={trackingCode}
              onChange={e => setTrackingCode(e.target.value.toUpperCase())}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all font-mono text-end placeholder-slate-400 uppercase"
              placeholder="مثال: AB12C3D"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm h-[52px]"
              disabled={!nationalId}
            >
              <Search className="w-4 h-4" />
              جستجوی نوبت
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">نتایج جستجو ({results.length} نوبت)</h2>
          
          {results.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-3xl p-8 text-center flex flex-col items-center shadow-sm">
              <AlertCircle className="w-10 h-10 mb-3 opacity-60 text-yellow-600" />
              <h3 className="text-lg font-bold">هیچ نوبتی یافت نشد</h3>
              <p className="mt-2 text-yellow-700/80 text-sm">لطفا کد ملی و در صورت نیاز کد پیگیری خود را با دقت بررسی نمایید.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(appointment => {
                const doc = doctors.find(d => d.id === appointment.doctorId);
                const dept = departments.find(d => d.id === appointment.departmentId);
                
                return (
                  <div key={appointment.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-2 text-primary-700 font-mono font-bold bg-primary-50 px-2.5 py-1.5 rounded-lg text-sm border border-primary-100">
                        <span className="text-[11px] text-primary-500 me-1 font-sans">کد پیگیری:</span>
                        {appointment.trackingCode}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" />
                        نهایی
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      <div className="bg-primary-600 text-white rounded-2xl p-4 flex flex-col justify-between shadow-sm shadow-primary-200">
                         <div className="text-primary-100 text-xs mb-1">زمان مراجعه</div>
                         <h3 className="text-lg font-bold">{appointment.dateLabel}</h3>
                         <p className="text-sm mt-1 bg-white/20 px-2 py-1 rounded-md inline-block self-start font-medium leading-none">ساعت {appointment.time}</p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100 flex-1">
                         <div className="flex items-center gap-2">
                           <User className="w-4 h-4 text-slate-400" />
                           <span className="font-bold text-slate-900 text-sm">{appointment.patientName}</span>
                         </div>
                         <div className="flex items-start gap-2">
                           <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-900 text-sm">{doc?.name}</span>
                             <span className="text-xs text-slate-500 mt-0.5">{dept?.name}</span>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
