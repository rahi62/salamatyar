'use client';

import TrackingView from '@/components/TrackingView';

export default function TrackPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <TrackingView onBack={() => window.location.href = '/'} />
    </div>
  );
}