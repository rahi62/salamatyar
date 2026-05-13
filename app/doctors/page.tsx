"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  User,
  CalendarPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  rating: number;
  experience: number;
  fee: number;
  availableDays: string[];
  availableTimeSlots: { [key: string]: string[] };
  image?: string;
  description?: string;
}

const specialties = [
  "قلب و عروق",
  "پوست و مو",
  "چشم",
  "داخلی",
  "اعصاب و روان",
  "ارتوپدی",
  "گوش و حلق",
  "جراحی عمومی",
  "غذا و متابولیسم",
  "کودکان",
];

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "دکتر محمد احمدی",
    specialty: "قلب و عروق",
    subSpecialty: "الکتروفیزیولوژی",
    rating: 4.8,
    experience: 15,
    fee: 350000,
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه"],
    availableTimeSlots: {
      شنبه: ["09:00", "10:00", "11:00", "16:00", "17:00"],
      دوشنبه: ["09:00", "10:00", "14:00", "15:00"],
      چهارشنبه: ["10:00", "11:00", "16:00"],
    },
    description: "متخصص قلب و عروق، عضو انجمن قلب ایران",
  },
  {
    id: "2",
    name: "دکتر فاطمه محمدی",
    specialty: "پوست و مو",
    subSpecialty: "لیزر و زیبایی",
    rating: 4.9,
    experience: 12,
    fee: 300000,
    availableDays: ["یکشنبه", "سه‌شنبه", "پنجشنبه"],
    availableTimeSlots: {
      یکشنبه: ["10:00", "11:00", "12:00", "16:00", "17:00"],
      سه‌شنبه: ["09:00", "10:00", "11:00", "15:00", "16:00"],
      پنجشنبه: ["10:00", "14:00", "15:00"],
    },
    description: "متخصص پوست، مو و زیبایی، فلوشیپ لیزر",
  },
  {
    id: "3",
    name: "دکتر علی رضایی",
    specialty: "چشم",
    subSpecialty: "جراحی لازک",
    rating: 4.7,
    experience: 20,
    fee: 400000,
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه", "پنجشنبه"],
    availableTimeSlots: {
      شنبه: ["08:00", "09:00", "10:00"],
      دوشنبه: ["10:00", "11:00", "12:00"],
      چهارشنبه: ["09:00", "10:00", "11:00"],
      پنجشنبه: ["08:00", "09:00"],
    },
    description: "متخصص چشم، جراح لازک و آب مروارید",
  },
  {
    id: "4",
    name: "دکتر سارا کریمی",
    specialty: "داخلی",
    subSpecialty: "اندوکرین",
    rating: 4.6,
    experience: 10,
    fee: 280000,
    availableDays: ["شنبه", "سه‌شنبه", "پنجشنبه"],
    availableTimeSlots: {
      شنبه: ["09:00", "10:00", "11:00", "14:00"],
      سه‌شنبه: ["10:00", "11:00", "12:00", "16:00"],
      پنجشنبه: ["09:00", "10:00", "11:00"],
    },
    description: "متخصص داخلی، فوق تخصص اندوکرین و دیابت",
  },
  {
    id: "5",
    name: "دکتر حسین نوری",
    specialty: "اعصاب و روان",
    subSpecialty: "روان‌درمانی",
    rating: 4.9,
    experience: 18,
    fee: 500000,
    availableDays: ["یکشنبه", "دوشنبه", "چهارشنبه", "جمعه"],
    availableTimeSlots: {
      یکشنبه: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      دوشنبه: ["09:00", "10:00", "11:00", "16:00"],
      چهارشنبه: ["10:00", "11:00", "14:00", "15:00"],
      جمعه: ["10:00", "11:00", "12:00"],
    },
    description: "متخصص اعصاب و روان، روان‌درمانگر شناختی رفتاری",
  },
  {
    id: "6",
    name: "دکتر مریم حسینی",
    specialty: "ارتوپدی",
    subSpecialty: "جراحی ستون فقرات",
    rating: 4.5,
    experience: 14,
    fee: 380000,
    availableDays: ["شنبه", "سه‌شنبه", "پنجشنبه"],
    availableTimeSlots: {
      شنبه: ["08:00", "09:00", "10:00", "11:00"],
      سه‌شنبه: ["10:00", "11:00", "14:00", "15:00"],
      پنجشنبه: ["09:00", "10:00", "11:00"],
    },
    description: "متخصص ارتوپدی، جراح ستون فقرات و گردن",
  },
  {
    id: "7",
    name: "دکتر علی زاده",
    specialty: "گوش و حلق",
    subSpecialty: "شنوایی‌شناسی",
    rating: 4.4,
    experience: 11,
    fee: 250000,
    availableDays: ["یکشنبه", "دوشنبه", "سه‌شنبه"],
    availableTimeSlots: {
      یکشنبه: ["09:00", "10:00", "11:00", "15:00", "16:00"],
      دوشنبه: ["10:00", "11:00", "12:00", "16:00"],
      سه‌شنبه: ["08:00", "09:00", "10:00", "11:00"],
    },
    description: "متخصص گوش، حلق و بینی، شنوایی‌شناسی",
  },
  {
    id: "8",
    name: "دکتر رضا محمدی‌نسب",
    specialty: "جراحی عمومی",
    subSpecialty: "لاباراسکوپی",
    rating: 4.7,
    experience: 16,
    fee: 420000,
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه"],
    availableTimeSlots: {
      شنبه: ["08:00", "09:00", "10:00", "11:00"],
      دوشنبه: ["10:00", "11:00", "12:00", "16:00"],
      چهارشنبه: ["09:00", "10:00", "11:00"],
    },
    description: "جراح عمومی، متخصص جراحی لاباراسکوپی",
  },
  {
    id: "9",
    name: "دکتر زهرا عباسی",
    specialty: "غذا و متابولیسم",
    subSpecialty: "تغذیه بالینی",
    rating: 4.6,
    experience: 9,
    fee: 260000,
    availableDays: ["یکشنبه", "سه‌شنبه", "پنجشنبه"],
    availableTimeSlots: {
      یکشنبه: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      سه‌شنبه: ["10:00", "11:00", "12:00", "16:00"],
      پنجشنبه: ["09:00", "10:00", "11:00"],
    },
    description: "متخصص تغذیه، فوق تخصص متابولیسم",
  },
  {
    id: "10",
    name: "دکتر امیر حسنی",
    specialty: "کودکان",
    subSpecialty: "نوزادان",
    rating: 4.8,
    experience: 13,
    fee: 320000,
    availableDays: ["شنبه", "دوشنبه", "چهارشنبه", "پنجشنبه"],
    availableTimeSlots: {
      شنبه: ["08:00", "09:00", "10:00", "11:00", "14:00"],
      دوشنبه: ["09:00", "10:00", "11:00", "12:00", "16:00"],
      چهارشنبه: ["10:00", "11:00", "14:00", "15:00"],
      پنجشنبه: ["09:00", "10:00", "11:00"],
    },
    description: "متخصص کودکان، فوق تخصص نوزادان",
  },
];

export default function DoctorsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "fee">(
    "rating"
  );

  const filteredDoctors = mockDoctors
    .filter((doctor) => {
      if (
        searchQuery &&
        !doctor.name.includes(searchQuery) &&
        !doctor.specialty.includes(searchQuery) &&
        !doctor.subSpecialty?.includes(searchQuery) &&
        !doctor.description?.includes(searchQuery)
      ) {
        return false;
      }
      if (selectedSpecialty && doctor.specialty !== selectedSpecialty) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experience - a.experience;
      return a.fee - b.fee;
    });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">لیست پزشکان</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="جستجوی پزشک، تخصص..."
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                showFilters
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Filter className="w-5 h-5" />
              فیلتر
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تخصص
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSpecialty("")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      !selectedSpecialty
                        ? "bg-primary-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    همه
                  </button>
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedSpecialty === specialty
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  مرتب‌سازی بر اساس
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "rating", label: "امتیاز" },
                    { value: "experience", label: "سابقه" },
                    { value: "fee", label: "نوبت‌دهی" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSortBy(option.value as typeof sortBy)
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-500">
          {filteredDoctors.length} پزشک یافت شد
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Doctor Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 text-sm font-medium">
                    {doctor.specialty}
                  </p>
                  {doctor.subSpecialty && (
                    <p className="text-slate-500 text-xs mt-1">
                      {doctor.subSpecialty}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {doctor.description && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {doctor.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{doctor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience} سال</span>
                </div>
              </div>

              {/* Fee */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-100">
                <span className="text-slate-500 text-sm">هزینه نوبت:</span>
                <span className="font-bold text-slate-900">
                  {doctor.fee.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              {/* Available Days */}
              <div className="mb-4">
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>ایام حضور:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <Link
                href={`/book?doctorId=${doctor.id}`}
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-5 h-5" />
                رزرو نوبت
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">پزشکی با این مشخصات یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}