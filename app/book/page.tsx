'use client';

import BookingForm from '@/components/BookingForm';

export default function BookPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <BookingForm onBack={() => window.location.href = '/'} />
    </div>
  );
}