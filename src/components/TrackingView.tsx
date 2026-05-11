import React, { useState } from 'react';
import { Search, Info, Calendar, Clock, User, Phone, CheckCircle, AlertCircle, ArrowRight, XCircle } from 'lucide-react';
import { getAppointmentsByNationalId, departments, doctors, Appointment, cancelAppointment } from '../data';

export default function TrackingView({ onBack }: { onBack: () => void }) {
  const [nationalId, setNationalId] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Appointment[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId) return;
    
    const found = getAppointmentsByNationalId(nationalId, trackingCode);
    setResults(found);
    setHasSearched(true);
  };

  const handleCancelConfirm = () => {
    if (cancellingId) {
      cancelAppointment(cancellingId);
      setResults(results.map(r => r.id === cancellingId ? { ...r, status: 'cancelled' } : r));
      setCancellingId(null);
    }
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
            <>
              {(() => {
                const today = new Date();
                today.setHours(0,0,0,0);
                
                const upcoming = results.filter(a => {
                  const d = new Date(a.date);
                  d.setHours(0,0,0,0);
                  return d.getTime() >= today.getTime();
                }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                const past = results.filter(a => {
                  const d = new Date(a.date);
                  d.setHours(0,0,0,0);
                  return d.getTime() < today.getTime();
                }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const renderAppointmentCard = (appointment: Appointment, isPastAppointment: boolean) => {
                  const doc = doctors.find(d => d.id === appointment.doctorId);
                  const dept = departments.find(d => d.id === appointment.departmentId);
                  const isCancelled = appointment.status === 'cancelled';
                  
                  return (
                    <div key={appointment.id} className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col ${isCancelled || isPastAppointment ? 'opacity-70 grayscale-[0.2]' : ''}`}>
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2 text-primary-700 font-mono font-bold bg-primary-50 px-2.5 py-1.5 rounded-lg text-sm border border-primary-100">
                          <span className="text-[11px] text-primary-500 me-1 font-sans">کد پیگیری:</span>
                          {appointment.trackingCode}
                        </div>
                        {isCancelled ? (
                          <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-red-100">
                            <XCircle className="w-3.5 h-3.5" />
                            لغو شده
                          </div>
                        ) : isPastAppointment ? (
                          <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            انجام شده
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" />
                            نهایی
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col gap-4">
                        <div className={`${isCancelled ? 'bg-slate-500 shadow-slate-200' : isPastAppointment ? 'bg-slate-600 shadow-slate-200' : 'bg-primary-600 shadow-primary-200'} text-white rounded-2xl p-4 flex flex-col justify-between shadow-sm`}>
                           <div className={`${isCancelled || isPastAppointment ? 'text-slate-200' : 'text-primary-100'} text-xs mb-1`}>زمان مراجعه</div>
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
                        
                        {!isCancelled && !isPastAppointment && (
                          <button 
                            onClick={() => setCancellingId(appointment.id)}
                            className="w-full bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm transition-colors mt-auto"
                          >
                            <XCircle className="w-4 h-4" />
                            لغو این نوبت
                          </button>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="space-y-12">
                    {upcoming.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary-500" />
                          نوبت‌های پیش رو
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {upcoming.map(a => renderAppointmentCard(a, false))}
                        </div>
                      </div>
                    )}
                    
                    {past.length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 opacity-80">
                          <Clock className="w-5 h-5 text-slate-500" />
                          تاریخچه مراجعات قبلی
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {past.map(a => renderAppointmentCard(a, true))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCancellingId(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm flex flex-col p-6 animate-in zoom-in-95 duration-200 text-center items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">لغو نوبت</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              آیا از لغو این نوبت اطمینان دارید؟ 
              این عملیات غیر قابل بازگشت است و زمان شما برای سایر بیماران آزاد خواهد شد.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setCancellingId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-sm"
              >
                انصراف
              </button>
              <button 
                onClick={handleCancelConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors text-sm shadow-md shadow-red-200"
              >
                تایید و لغو نوبت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
