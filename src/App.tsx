import React, { useState } from 'react';
import { Stethoscope, CalendarPlus, Search, Menu, X } from 'lucide-react';
import HomeView from './components/HomeView';
import BookingForm from './components/BookingForm';
import TrackingView from './components/TrackingView';

export default function App() {
  const [view, setView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (newView: string) => {
    setView(newView);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 p-4 md:p-6 gap-4">
      {/* Navbar */}
      <header className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-50 flex-none mx-auto w-full max-w-7xl">
        <div className="w-full">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigateTo('home')}
            >
              <div className="bg-primary-600 text-white p-2.5 rounded-xl group-hover:bg-primary-700 transition-colors shadow-sm">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">سلامت‌<span className="text-primary-600">یار</span></span>
                <span className="block text-xs font-semibold text-slate-500 -mt-1 tracking-wider">کلینیک تخصصی آنلاین</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 font-medium text-slate-500">
              <button 
                onClick={() => navigateTo('home')}
                className={`transition-colors text-sm ${view === 'home' ? 'text-primary-600 border-b-2 border-primary-600 px-1 py-1' : 'hover:text-primary-600 px-1 py-1'}`}
              >
                خانه
              </button>
              <button 
                onClick={() => navigateTo('track')}
                className={`flex items-center gap-1 transition-colors text-sm ${view === 'track' ? 'text-primary-600 border-b-2 border-primary-600 px-1 py-1' : 'hover:text-primary-600 px-1 py-1'}`}
              >
                <Search className="w-4 h-4" />
                پیگیری نوبت
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button 
                onClick={() => navigateTo('book')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                <CalendarPlus className="w-5 h-5" />
                رزرو نوبت
              </button>
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
              <button 
                onClick={() => navigateTo('home')}
                className={`w-full text-start px-4 py-3 rounded-xl font-bold ${view === 'home' ? 'bg-slate-100 text-primary-700' : 'text-slate-600'}`}
              >
                خانه
              </button>
              <button 
                onClick={() => navigateTo('track')}
                className={`w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${view === 'track' ? 'bg-primary-50 text-primary-700' : 'text-slate-600'}`}
              >
                <Search className="w-5 h-5" />
                پیگیری نوبت
              </button>
              <button 
                onClick={() => navigateTo('book')}
                className="w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-primary-600 text-white"
              >
                <CalendarPlus className="w-5 h-5" />
                رزرو نوبت
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        {view === 'home' && <HomeView setView={navigateTo} />}
        {view === 'book' && <BookingForm onBack={() => navigateTo('home')} />}
        {view === 'track' && <TrackingView onBack={() => navigateTo('home')} />}
      </main>

      {/* Footer */}
      <footer className="bg-white rounded-2xl border border-slate-200 text-slate-500 py-8 text-center text-sm shadow-sm mx-auto w-full max-w-7xl flex-none mt-auto">
        <div className="w-full px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
             <Stethoscope className="w-5 h-5 text-primary-600" />
             <span className="font-bold text-lg text-slate-900">سلامت‌یار</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed mb-6 text-xs text-slate-400">
            پلتفرم جامع نوبت‌دهی آنلاین کلینیک‌های پزشکی. ارائه دهنده خدمات سریع، مطمئن و در دسترس برای همه هموطنان عزیز.
          </p>
          <div className="flex gap-6 mb-6 text-primary-600 text-xs font-semibold">
            <a href="#" className="hover:text-primary-700 transition-colors">قوانین و مقررات</a>
            <a href="#" className="hover:text-primary-700 transition-colors">تماس با ما</a>
            <a href="#" className="hover:text-primary-700 transition-colors">درباره کلینیک</a>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
