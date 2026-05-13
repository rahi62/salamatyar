"use client";

import { useState } from "react";
import {
  Stethoscope,
  CalendarPlus,
  Search,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  UserPlus,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, token, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-50 flex-none mx-auto w-full max-w-7xl my-4">
      <div className="w-full">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="bg-primary-600 text-white p-2.5 rounded-xl group-hover:bg-primary-700 transition-colors shadow-sm">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                سلامت‌<span className="text-primary-600">یار</span>
              </span>
              <span className="block text-xs font-semibold text-slate-500 -mt-1 tracking-wider">
                کلینیک تخصصی آنلاین
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-slate-500">
            <Link
              href="/"
              className="transition-colors text-sm hover:text-primary-600 px-1 py-1"
            >
              خانه
            </Link>
            <Link
              href="/doctors"
              className="transition-colors text-sm hover:text-primary-600 px-1 py-1"
            >
              پزشکان
            </Link>
            <Link
              href="/track"
              className="flex items-center gap-1 transition-colors text-sm hover:text-primary-600 px-1 py-1"
            >
              <Search className="w-4 h-4" />
              پیگیری نوبت
            </Link>
            <Link
              href="/book"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <CalendarPlus className="w-5 h-5" />
              رزرو نوبت
            </Link>

            {/* Auth Section */}
            <div className="w-px h-6 bg-slate-200"></div>

            {isLoading ? (
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
            ) : token && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-2 rounded-xl transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.fullName || user.phone}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">
                        {user.fullName || "کاربر"}
                      </p>
                      <p className="text-xs text-slate-500 font-mono" dir="ltr">
                        {user.phone}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors text-sm"
                    >
                      <User className="w-4 h-4" />
                      پروفایل
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-bold transition-all text-sm shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 border-2 border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-600 px-5 py-2 rounded-xl font-bold transition-all text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  ثبت‌نام
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-in slide-in-from-top-2">
              <div className="px-4 py-6 space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-start px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  خانه
                </Link>
                <Link
                  href="/doctors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-start px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  پزشکان
                </Link>
                <Link
                  href="/track"
                  className="block w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  <Search className="w-5 h-5" />
                  پیگیری نوبت
                </Link>
            <Link
              href="/book"
              className="block w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-primary-600 text-white"
            >
              <CalendarPlus className="w-5 h-5" />
              رزرو نوبت
            </Link>

            <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
              {isLoading ? (
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse mx-auto"></div>
              ) : token && user ? (
                <>
                  <div className="px-4 py-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-900 text-sm">
                      {user.fullName || "کاربر"}
                    </p>
                    <p className="text-xs text-slate-500 font-mono" dir="ltr">
                      {user.phone}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <UserCircle className="w-5 h-5" />
                    پروفایل
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    خروج
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold transition-all text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    ورود
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-600 px-5 py-3 rounded-xl font-bold transition-all text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}