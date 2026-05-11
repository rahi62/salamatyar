import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, User, Search, Stethoscope, ArrowLeft, CheckCircle2, Hospital, Star, X, GraduationCap, MessageSquare, Clock, Bell } from 'lucide-react';
import { departments, doctors, getMonthDays, timeSlots, saveAppointment, Doctor, getAppointmentsByDoctorAndDate } from '../data';

export default function BookingForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorViewMode, setDoctorViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  
  const [reminderSet, setReminderSet] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    nationalId: '',
    phone: ''
  });
  
  const [bookingResult, setBookingResult] = useState<any>(null);

  const availableDoctors = doctors.filter(d => {
    if (d.departmentId !== selectedDept) return false;
    if (doctorSearchQuery && !d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) && !(d.bio && d.bio.toLowerCase().includes(doctorSearchQuery.toLowerCase()))) return false;
    if (minRatingFilter > 0 && (!d.rating || d.rating < minRatingFilter)) return false;
    return true;
  });
  
  const calendarData = useMemo(() => getMonthDays(), []);
  const { days: monthDays, monthName, startPadding } = calendarData;

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const appointments = getAppointmentsByDoctorAndDate(selectedDoctor, selectedDate.value);
      const booked = appointments.map(a => a.time);
      setBookedTimes(booked);
      
      // If the currently selected time is booked, deselect it
      if (selectedTime && booked.includes(selectedTime)) {
        setSelectedTime('');
      }
    } else {
      setBookedTimes([]);
    }
  }, [selectedDoctor, selectedDate]);

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-slate-800">پزشک معالج خود را انتخاب کنید</h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setDoctorViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${doctorViewMode === 'list' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  نمایش لیست
                </button>
                <button 
                  onClick={() => setDoctorViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${doctorViewMode === 'calendar' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  نمایش تقویم
                </button>
              </div>
            </div>
            
            {doctorViewMode === 'list' ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="جستجوی نام پزشک یا تخصص..." 
                      value={doctorSearchQuery}
                      onChange={e => setDoctorSearchQuery(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-slate-50"
                    />
                  </div>
                  <div className="w-full sm:w-48 relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Star className="w-4 h-4 text-slate-400 fill-slate-400" />
                    </div>
                    <select 
                      value={minRatingFilter}
                      onChange={e => setMinRatingFilter(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl py-3 pr-9 pl-4 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm text-slate-700 bg-slate-50 appearance-none"
                    >
                      <option value={0}>همه امتیازها</option>
                      <option value={4.5}>بالای ۴.۵ ستاره</option>
                      <option value={4}>بالای ۴ ستاره</option>
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDoctors.length > 0 ? availableDoctors.map(doctor => {
                    const isSelected = selectedDoctor === doctor.id;
                    return (
                      <button
                        key={doctor.id}
                        onClick={() => { setSelectedDoctor(doctor.id); handleNext(); }}
                        className={`flex items-start p-4 rounded-2xl border-2 text-start transition-all cursor-pointer w-full relative group
                          ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className="w-14 h-14 shrink-0 bg-slate-200 rounded-full flex items-center justify-center me-4 overflow-hidden shadow-sm">
                          {doctor.avatarUrl ? (
                             <img src={doctor.avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
                          ) : (
                             <User className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{doctor.name}</h3>
                          {doctor.bio && <p className="text-sm text-primary-600 font-medium mt-0.5 line-clamp-1">{doctor.bio}</p>}
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              {doctor.experience}
                            </p>
                            <div 
                              onClick={(e) => { e.stopPropagation(); setSelectedDoctorForModal(doctor); }}
                              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                            >
                              مشاهده پروفایل
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  }) : (
                    <div className="col-span-2 text-center py-10 text-slate-500 bg-slate-50 rounded-xl">
                      پزشکی در این بخش یافت نشد.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 w-full shadow-sm animate-in zoom-in-95 duration-300">
                <h3 className="text-lg font-black text-slate-800 text-center mb-6">{monthName}</h3>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 text-center text-xs font-bold text-slate-400">
                  <div>ش</div>
                  <div>ی</div>
                  <div>د</div>
                  <div>س</div>
                  <div>چ</div>
                  <div>پ</div>
                  <div>ج</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {Array.from({length: startPadding}).map((_, i) => (
                      <div key={`pad-${i}`} className="min-h-[80px] sm:min-h-[120px] bg-transparent"></div>
                  ))}
                  
                  {monthDays.map(day => {
                    const disabled = day.isDayOff || day.isPast;
                    return (
                      <div key={day.id} className={`min-h-[80px] sm:min-h-[120px] rounded-xl border-2 p-1 sm:p-2 flex flex-col transition-all 
                        ${disabled ? 'border-transparent bg-slate-100/50 text-slate-400 opacity-60' : 'border-slate-100 bg-white hover:border-primary-200 hover:shadow-md'}`}>
                        <span className="text-xs sm:text-sm font-bold text-slate-700 mb-1 sm:mb-2 text-center">{day.dayNum}</span>
                        {!disabled && availableDoctors.length > 0 && (
                          <div className="flex flex-col gap-1 overflow-y-auto max-h-[50px] sm:max-h-[85px] hide-scrollbar">
                            {availableDoctors.map(doctor => (
                              <button 
                                key={doctor.id}
                                onClick={() => { setSelectedDoctor(doctor.id); setSelectedDate(day); handleNext(); }}
                                className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg sm:rounded-xl text-right transition-colors w-full group overflow-hidden border border-transparent hover:border-primary-100"
                                title={doctor.name}
                              >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 bg-white border border-slate-200 group-hover:border-primary-300">
                                  {doctor.avatarUrl ? <img src={doctor.avatarUrl} className="w-full h-full object-cover" /> : <User className="w-3 h-3 sm:w-4 sm:h-4 mx-auto my-0.5 text-slate-400" />}
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-600 group-hover:text-primary-700 truncate hidden sm:inline">{doctor.name.replace('دکتر ', '')}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {!disabled && availableDoctors.length === 0 && (
                          <div className="text-[9px] text-slate-400 text-center mt-2">پزشکی یافت نشد</div>
                        )}
                        {disabled && <div className="text-[9px] sm:text-[10px] text-slate-400 text-center mt-1 sm:mt-2">{day.isDayOff ? 'تعطیل' : ''}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-slate-800">زمان مراجعه را مشخص کنید</h2>
            
            <h3 className="text-sm font-semibold text-slate-500 mb-3">روز مراجعه:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 mb-8 max-w-sm mx-auto shadow-sm">
               <h3 className="text-lg font-black text-slate-800 text-center mb-6">{monthName}</h3>
               {/* 7 columns grid for days of week */}
               <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 text-center text-xs font-bold text-slate-400">
                 <div>ش</div>
                 <div>ی</div>
                 <div>د</div>
                 <div>س</div>
                 <div>چ</div>
                 <div>پ</div>
                 <div>ج</div>
               </div>
               
               <div className="grid grid-cols-7 gap-1 sm:gap-2">
                 {/* Padding boxes */}
                 {Array.from({length: startPadding}).map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square"></div>
                 ))}
                 
                 {/* Real days */}
                 {monthDays.map(day => {
                   const isSelected = selectedDate?.id === day.id;
                   const isOff = day.isDayOff;
                   const isPast = day.isPast;
                   const disabled = isOff || isPast;

                   return (
                     <button
                       key={day.id}
                       disabled={disabled}
                       onClick={() => setSelectedDate(day)}
                       className={`aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all p-1 
                         ${disabled ? 'border-transparent bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' : 
                           isSelected ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/30' : 
                          'border-transparent hover:border-slate-300 bg-white shadow-sm text-slate-700 hover:shadow-md'}`}
                     >
                       <span className="text-sm sm:text-base font-bold">{day.dayNum}</span>
                     </button>
                   );
                 })}
               </div>
               <div className="flex items-center justify-center gap-4 mt-6 text-[10px] sm:text-xs font-medium border-t border-slate-200 pt-4">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded flex-shrink-0 bg-white border border-slate-300"></div><span className="text-slate-500">آزاد</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded flex-shrink-0 bg-primary-500 shadow-sm"></div><span className="text-slate-700">انتخاب شما</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded flex-shrink-0 bg-slate-100 border border-slate-200"></div><span className="text-slate-400">غیرقابل رزرو</span></div>
               </div>
            </div>

            {selectedDate && (
               <div className="mt-10 animate-in fade-in duration-300">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-4">
                   <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-slate-400" />
                     ساعات حضور پزشک آنلاین
                   </h3>
                   <div className="flex items-center gap-4 text-xs font-medium">
                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-white border border-slate-300"></div><span className="text-slate-500">نوبت آزاد</span></div>
                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200"></div><span className="text-slate-500">رزرو شده</span></div>
                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-primary-500 shadow-sm shadow-primary-500/30"></div><span className="text-slate-700">انتخاب شما</span></div>
                   </div>
                 </div>
                 
                 <div className="space-y-6">
                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                     <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                       شیفت صبح <span className="text-slate-400 font-normal ml-1">(۰۹:۰۰ الی ۱۲:۰۰)</span>
                     </h4>
                     <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                       {timeSlots.filter(t => parseInt(t.split(':')[0]) < 13).map(time => {
                         const isSelected = selectedTime === time;
                         const isBooked = bookedTimes.includes(time);
                         return (
                            <button
                              key={time}
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 rounded-xl border text-sm font-bold focus:outline-none transition-all duration-200
                                ${isSelected ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/20 transform scale-[1.02]' : 
                                  isBooked ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70' : 
                                  'border-slate-200 bg-white hover:border-primary-300 text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm'}`}
                            >
                              {time}
                            </button>
                         )
                       })}
                     </div>
                   </div>

                   <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                     <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                       شیفت عصر <span className="text-slate-400 font-normal ml-1">(۱۴:۰۰ الی ۱۹:۰۰)</span>
                     </h4>
                     <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                       {timeSlots.filter(t => parseInt(t.split(':')[0]) >= 13).map(time => {
                         const isSelected = selectedTime === time;
                         const isBooked = bookedTimes.includes(time);
                         return (
                            <button
                              key={time}
                              disabled={isBooked}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 rounded-xl border text-sm font-bold focus:outline-none transition-all duration-200
                                ${isSelected ? 'border-primary-500 bg-primary-500 text-white shadow-md shadow-primary-500/20 transform scale-[1.02]' : 
                                  isBooked ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70' : 
                                  'border-slate-200 bg-white hover:border-primary-300 text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm'}`}
                            >
                              {time}
                            </button>
                         )
                       })}
                     </div>
                   </div>
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

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setReminderSet(true)}
                disabled={reminderSet}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  reminderSet 
                    ? 'bg-amber-50 text-amber-600 border border-amber-200 cursor-default' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {reminderSet ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    یادآور برای ۲۴ ساعت قبل تنظیم شد
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    تنظیم پیامک یادآور ۲۴ ساعت قبل از نوبت
                  </>
                )}
              </button>
              
              <button 
                onClick={onBack}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDoctorForModal(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="relative p-6 flex flex-col items-center border-b border-slate-100 pb-8 mt-4">
              <button 
                onClick={() => setSelectedDoctorForModal(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden shadow-md ring-4 ring-white mb-4">
                {selectedDoctorForModal.avatarUrl ? (
                   <img src={selectedDoctorForModal.avatarUrl} alt={selectedDoctorForModal.name} className="w-full h-full object-cover" />
                ) : (
                   <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <h3 className="font-black text-xl text-slate-900">{selectedDoctorForModal.name}</h3>
              <p className="text-primary-600 font-bold mt-1 text-sm">{selectedDoctorForModal.bio}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                   {selectedDoctorForModal.experience}
                </div>
                {selectedDoctorForModal.rating && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold border border-orange-100">
                     <Star className="w-4 h-4 fill-orange-500" />
                     {selectedDoctorForModal.rating}
                  </div>
                )}
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Education */}
              {selectedDoctorForModal.education && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <GraduationCap className="w-5 h-5 text-slate-400" />
                    تحصیلات و مدارک
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedDoctorForModal.education}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {selectedDoctorForModal.reviews && selectedDoctorForModal.reviews.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    نظرات بیماران ({selectedDoctorForModal.reviews.length})
                  </h4>
                  <div className="space-y-3 block">
                    {selectedDoctorForModal.reviews.map(review => (
                      <div key={review.id} className="bg-white rounded-2xl p-4 border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-800 text-sm">{review.author}</span>
                          <div className="flex items-center gap-2">
                             <div className="flex items-center">
                               {Array.from({length: 5}).map((_, i) => (
                                 <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'fill-slate-200 text-slate-200'}`} />
                               ))}
                             </div>
                             <span className="text-[10px] text-slate-400">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => {
                  setSelectedDoctor(selectedDoctorForModal.id);
                  handleNext();
                  setSelectedDoctorForModal(null);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 transition-all flex justify-center items-center gap-2 text-sm"
              >
                انتخاب این پزشک و ادامه
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
