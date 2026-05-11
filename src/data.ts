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
  avatarUrl?: string;
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
  { id: 'dr1', name: 'دکتر محمد احمدی', departmentId: 'd1', experience: '۱۵ سال تجربه' },
  { id: 'dr2', name: 'دکتر سارا رضایی', departmentId: 'd1', experience: '۸ سال تجربه' },
  { id: 'dr3', name: 'دکتر علی کریمی', departmentId: 'd2', experience: '۱۲ سال تجربه' },
  { id: 'dr4', name: 'دکتر مریم حسینی', departmentId: 'd2', experience: '۵ سال تجربه' },
  { id: 'dr5', name: 'دکتر امیر نجفی', departmentId: 'd3', experience: '۲۰ سال تجربه' },
  { id: 'dr6', name: 'دکتر لیلا طاهری', departmentId: 'd4', experience: '۱۰ سال تجربه' },
  { id: 'dr7', name: 'دکتر رضا مرادی', departmentId: 'd5', experience: '۱۴ سال تجربه' },
  { id: 'dr8', name: 'دکتر نسترن هاشمی', departmentId: 'd6', experience: '۹ سال تجربه' },
];

// Generate next 7 days dynamically
export const getNextDays = () => {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' });
    days.push({ 
      id: `date-${i}`, 
      label: formatter.format(date), 
      value: date.toISOString().split('T')[0] 
    });
  }
  return days;
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

export const getAppointmentsByNationalId = (nationalId: string, trackingCode?: string) => {
  const existingStr = localStorage.getItem('appointments');
  const existing: Appointment[] = existingStr ? JSON.parse(existingStr) : [];
  
  if (trackingCode) {
    return existing.filter(a => a.nationalId === nationalId && a.trackingCode === trackingCode);
  }
  return existing.filter(a => a.nationalId === nationalId);
};
