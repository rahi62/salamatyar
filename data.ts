import { Heart, Smile, Eye, Activity, Brain, Bone } from 'lucide-react';
import React from 'react';

export type Department = {
  id: string;
  name: string;
  icon: React.FC<any>;
  description: string;
};

export type Doctor = {
  id: string;
  name: string;
  departmentId: string;
  experience: string;
  bio?: string;
  avatarUrl?: string;
  education?: string;
  rating?: number;
  reviews?: { id: string; author: string; rating: number; comment: string; date: string }[];
};

export type Appointment = {
  id: string;
  trackingCode: string;
  patientName: string;
  nationalId: string;
  phone: string;
  departmentId: string;
  doctorId: string;
  date: string;
  dateLabel: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
};

export const departments: Department[] = [
  { id: 'd1', name: 'قلب و عروق', icon: Heart, description: 'متخصصین قلب و عروق و فشار خون' },
  { id: 'd2', name: 'دندانپزشکی', icon: Smile, description: 'خدمات ترمیمی، زیبایی و ریشه' },
  { id: 'd3', name: 'چشم پزشکی', icon: Eye, description: 'معاینه، بینایی سنجی و لیزیک' },
  { id: 'd4', name: 'مغز و اعصاب', icon: Activity, description: 'بیماری‌های عصبی و سردردها' },
  { id: 'd5', name: 'روانشناسی', icon: Brain, description: 'مشاوره فردی و خانواده' },
  { id: 'd6', name: 'ارتوپدی', icon: Bone, description: 'استخوان، مفاصل و ستون فقرات' },
];

export const doctors: Doctor[] = [
  { id: 'dr1', name: 'دکتر محمد احمدی', departmentId: 'd1', experience: '۱۵ سال تجربه', bio: 'فلوشیپ فوق تخصصی اینترونشنال کاردیولوژی', avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop', education: 'فارغ التحصیل دانشگاه علوم پزشکی تهران', rating: 4.8, reviews: [{id: 'r1', author: 'علی', rating: 5, comment: 'بسیار دکتر با حوصله و دقیقی هستند.', date: '۱۴۰۲/۰۵/۱۲'}, {id: 'r2', author: 'مریم', rating: 4.5, comment: 'تشخیص عالی بود.', date: '۱۴۰۲/۰۷/۰۱'}] },
  { id: 'dr2', name: 'دکتر سارا رضایی', departmentId: 'd1', experience: '۸ سال تجربه', bio: 'متخصص بیماری‌های قلب و عروق، بورد تخصصی', avatarUrl: 'https://images.unsplash.com/photo-1594824436998-d5e8697621fc?q=80&w=200&auto=format&fit=crop', education: 'دانشگاه علوم پزشکی شهید بهشتی', rating: 4.5, reviews: [{id: 'r3', author: 'رضا', rating: 4, comment: 'رفتار بسیار محترمانه.', date: '۱۴۰۲/۰۸/۱۵'}] },
  { id: 'dr3', name: 'دکتر علی کریمی', departmentId: 'd2', experience: '۱۲ سال تجربه', bio: 'متخصص درمان ریشه (اندودانتیکس)', avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop', education: 'دانشگاه علوم پزشکی شیراز', rating: 4.9, reviews: [{id: 'r4', author: 'حسین', rating: 5, comment: 'کارشون حرف نداره، بدون هیچ دردی کارم انجام شد.', date: '۱۴۰۲/۰۹/۱۰'}] },
  { id: 'dr4', name: 'دکتر مریم حسینی', departmentId: 'd2', experience: '۵ سال تجربه', bio: 'دندانپزشک زیبایی و ترمیمی', avatarUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=200&auto=format&fit=crop', education: 'آکادمی دندانپزشکی زیبایی', rating: 4.7, reviews: [] },
  { id: 'dr5', name: 'دکتر امیر نجفی', departmentId: 'd3', experience: '۲۰ سال تجربه', bio: 'فوق تخصص قرنیه، لیزیک و آب مروارید', avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop', education: 'فلوشیپ قرنیه از دانشگاه شهید بهشتی', rating: 4.9, reviews: [{id: 'r5', author: 'سمیرا', rating: 5, comment: 'عمل لیزیک من با موفقیت انجام شد. سپاسگزارم', date: '۱۴۰۲/۱۰/۰۵'}] },
  { id: 'dr6', name: 'دکتر لیلا طاهری', departmentId: 'd4', experience: '۱۰ سال تجربه', bio: 'متخصص بیماری‌های مغز و اعصاب، فلوشیپ صرع', avatarUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=200&auto=format&fit=crop', education: 'دانشگاه علوم پزشکی تبریز', rating: 4.6, reviews: [] },
  { id: 'dr7', name: 'دکتر رضا مرادی', departmentId: 'd5', experience: '۱۴ سال تجربه', bio: 'روانشناس بالینی، دکترای تخصصی', avatarUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=200&auto=format&fit=crop', education: 'دکترای روانشناسی بالینی دانشگاه تهران', rating: 4.8, reviews: [{id: 'r6', author: 'امید', rating: 5, comment: 'مشاوره‌های ایشان بسیار به من کمک کرد و تاثیرگذار بود.', date: '۱۴۰۲/۱۱/۲۰'}] },
  { id: 'dr8', name: 'دکتر نسترن هاشمی', departmentId: 'd6', experience: '۹ سال تجربه', bio: 'جراح و متخصص ارتوپدی، آرتروسکوپی مفاصل', avatarUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=200&auto=format&fit=crop', education: 'دانشگاه علوم پزشکی مشهد', rating: 4.4, reviews: [] },
];

export const getMonthDays = () => {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const df = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });
  const getParts = (d: Date) => {
    const parts = df.formatToParts(d);
    return {
      year: parseInt(parts.find(p => p.type === 'year')?.value || '1400', 10),
      month: parseInt(parts.find(p => p.type === 'month')?.value || '1', 10),
      day: parseInt(parts.find(p => p.type === 'day')?.value || '1', 10),
    };
  };

  const todayParts = getParts(today);

  let firstDayOfMonth = new Date(today);
  while (getParts(firstDayOfMonth).day > 1) {
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);
  }

  const formatterLong = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' });
  const formatterDayNum = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
  const formatterMonthName = new Intl.DateTimeFormat('fa-IR', { month: 'long' });

  const monthName = formatterMonthName.format(firstDayOfMonth);
  const startPadding = (firstDayOfMonth.getDay() + 1) % 7;

  const days = [];
  let current = new Date(firstDayOfMonth);
  while (getParts(current).month === todayParts.month) {
    days.push({
      id: `date-${current.getTime()}`,
      label: formatterLong.format(current),
      dayNum: formatterDayNum.format(current),
      value: current.toISOString().split('T')[0],
      isDayOff: current.getDay() === 5,
      isPast: current.getTime() < today.getTime(),
    });
    current.setDate(current.getDate() + 1);
  }

  return { days, monthName, startPadding };
};

export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
];

export const saveAppointment = (appointment: Omit<Appointment, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => {
  const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  const id = crypto.randomUUID ? crypto.randomUUID() : trackingCode;
  
  const newAppointment: Appointment = {
    ...appointment,
    id,
    trackingCode,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  const existingStr = localStorage.getItem('appointments');
  const existing = existingStr ? JSON.parse(existingStr) : [];
  localStorage.setItem('appointments', JSON.stringify([...existing, newAppointment]));
  
  return newAppointment;
};

export const cancelAppointment = (id: string) => {
  const existingStr = localStorage.getItem('appointments');
  const existing: Appointment[] = existingStr ? JSON.parse(existingStr) : [];
  
  const updated = existing.map(a => 
    a.id === id ? { ...a, status: 'cancelled' as const } : a
  );
  
  localStorage.setItem('appointments', JSON.stringify(updated));
  return updated.find(a => a.id === id);
};

export const getAppointmentsByNationalId = (nationalId: string, trackingCode?: string) => {
  const existingStr = localStorage.getItem('appointments');
  const existing: Appointment[] = existingStr ? JSON.parse(existingStr) : [];
  
  if (trackingCode) {
    return existing.filter(a => a.nationalId === nationalId && a.trackingCode === trackingCode);
  }
  return existing.filter(a => a.nationalId === nationalId);
};

export const getAppointmentsByDoctorAndDate = (doctorId: string, date: string) => {
  const existingStr = localStorage.getItem('appointments');
  const existing: Appointment[] = existingStr ? JSON.parse(existingStr) : [];
  
  return existing.filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'cancelled');
};