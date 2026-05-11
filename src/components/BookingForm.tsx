import React, { useState } from 'react';
import { Calendar, User, Search, Stethoscope, ArrowLeft, CheckCircle2, Hospital } from 'lucide-react';
import { departments, doctors, getNextDays, timeSlots, saveAppointment } from '../data';

export default function BookingForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState('');
  
  const [formData, setFormData] = useState({
    patientName: '',
    nationalId: '',
    phone: ''
  });
  
  const [bookingResult, setBookingResult] = useState<any>(null);

  const availableDoctors = doctors.filter(d => d.departmentId === selectedDept);
  const availableDays = getNextDays();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleBook = () => {
    if (!formData.patientName || !formData.nationalId || !formData.phone) return;
    
    const result = saveAppointment({
      patientName: formData.patientName,
      nationalId: formData.nationalId,
      phone: formData.phone,
      departmentId: selectedDept,
      doctorId: selectedDoctor,
      date: selectedDate.value,
      dateLabel: selectedDate.label,
      time: selectedTime
    });
    
    setBookingResult(result);
    setStep(6);
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Progress Bar */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={step === 1 ? onBack : handlePrev} className="text-slate-500 hover:text-slate-700 flex items-center p-2">
            <ArrowLeft className="w-5 h-5 rotate-180 me-1" />
            <span className="text-sm font-medium">بازگشت</span>
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <span className="font-semibold text-primary-700">
            {step === 1 && 'انتخاب تخصص'}
            {step === 2 && 'انتخاب پزشک'}
            {step === 3 && 'انتخاب زمان'}
            {step === 4 && 'اطلاعات بیمار'}
            {step === 5 && 'تایید نهایی'}
            {step === 6 && 'رسید نوبت'}
          </span>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
             <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-primary-500' : 'w-4 bg-slate-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 min-h-[400px]">
        {/* Step 1: Department */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-slate-800">بخش درمانی مورد نظر را انتخاب کنید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map(dept => {
                const Icon = dept.icon;
                const isSelected = selectedDept === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => { setSelectedDept(dept.id); handleNext(); }}
                    className={`flex items-start p-4 rounded-xl border-2 text-start transition-all cursor-pointer w-full
                      ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className={`p-3 rounded-lg me-4 ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{dept.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{dept.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Doctor */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-slate-800">پزشک معالج خود را انتخاب کنید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDoctors.length > 0 ? availableDoctors.map(doctor => {
                const isSelected = selectedDoctor === doctor.id;
                return (
                  <button
                    key={doctor.id}
                    onClick={() => { setSelectedDoctor(doctor.id); handleNext(); }}
                    className={`flex items-center p-4 rounded-xl border-2 text-start transition-all cursor-pointer w-full
                      ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center me-4 overflow-hidden">
                       <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{doctor.experience}</p>
                    </div>
                  </button>
                )
              }) : (
                <div className="col-span-2 text-center py-10 text-slate-500 bg-slate-50 rounded-xl">
                  پزشکی در این بخش یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-slate-800">زمان مراجعه را مشخص کنید</h2>
            
            <h3 className="text-sm font-semibold text-slate-500 mb-3">روز مراجعه:</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
              {availableDays.map(day => {
                const isSelected = selectedDate?.id === day.id;
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDate(day)}
                    className={`whitespace-nowrap px-5 py-3 rounded-xl border-2 font-medium transition-all
                      ${isSelected ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>

            {selectedDate && (
               <div className="mt-8 animate-in fade-in duration-300">
                 <h3 className="text-sm font-semibold text-slate-500 mb-3">ساعت مراجعه:</h3>
                 <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                   {timeSlots.map(time => {
                     const isSelected = selectedTime === time;
                     return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-lg border text-sm font-medium focus:outline-none transition-all
                            ${isSelected ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                        >
                          {time}
                        </button>
                     )
                   })}
                 </div>
               </div>
            )}

            <div className="mt-8 flex justify-end">
               <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleNext} 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  تایید زمان و ادامه
               </button>
            </div>
          </div>
        )}

        {/* Step 4: Patient Info */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">مشخصات بیمار</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نام و نام خانوادگی</label>
                <input 
                  type="text" 
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium" 
                  placeholder="محمد محمدی" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">کد ملی</label>
                <input 
                  type="text" 
                  maxLength={10}
                  value={formData.nationalId}
                  onChange={e => setFormData({...formData, nationalId: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium font-mono text-end" 
                  placeholder="۱۲۳۴۵۶۷۸۹۰" 
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">شماره تماس (موبایل)</label>
                <input 
                  type="tel" 
                  maxLength={11}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium font-mono text-end" 
                  placeholder="09123456789" 
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
               <button onClick={handlePrev} className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-semibold transition-colors">مرحله قبل</button>
               <button 
                 disabled={!formData.patientName || formData.nationalId.length < 10 || formData.phone.length < 11}
                 onClick={handleNext} 
                 className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors"
               >
                 ادامه
               </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-6 text-slate-800 text-center">تایید اطلاعات نوبت</h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">پزشک معالج:</span>
                <span className="font-bold text-slate-900">{doctors.find(d => d.id === selectedDoctor)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">بخش:</span>
                <span className="font-bold text-slate-900">{departments.find(d => d.id === selectedDept)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">زمان نوبت:</span>
                <span className="font-bold text-slate-900">{selectedDate?.label} - ساعت {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">نام بیمار:</span>
                <span className="font-bold text-slate-900">{formData.patientName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">کد ملی:</span>
                <span className="font-bold text-slate-900 font-mono">{formData.nationalId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">شماره تماس:</span>
                <span className="font-bold text-slate-900 font-mono" dir="ltr">{formData.phone}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
               <button onClick={handlePrev} className="flex-1 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-semibold transition-colors">اصلاح اطلاعات</button>
               <button 
                 onClick={handleBook} 
                 className=" flex-[2] bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 px-4 flex justify-center items-center gap-2 transition-all"
               >
                 <CheckCircle2 className="w-5 h-5" />
                 تایید نهایی و دریافت نوبت
               </button>
            </div>
          </div>
        )}

        {/* Step 6: Result / Success */}
        {step === 6 && bookingResult && (
          <div className="animate-in zoom-in-95 duration-500 max-w-md mx-auto text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">نوبت شما با موفقیت ثبت شد</h2>
            <p className="text-slate-500 mb-8">لطفا کد پیگیری زیر را برای مراجعات بعدی یادداشت نمایید.</p>
            
            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 mb-8">
               <div className="text-sm font-medium text-slate-500 mb-2">کد پیگیری شما:</div>
               <div className="text-4xl font-black text-primary-700 tracking-widest font-mono select-all">
                 {bookingResult.trackingCode}
               </div>
            </div>

            <button 
              onClick={onBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
