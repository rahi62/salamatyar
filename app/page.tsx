"use client";

import { useState } from "react";
import HomeView from "@/components/HomeView";
import BookingForm from "@/components/BookingForm";
import TrackingView from "@/components/TrackingView";

export default function Home() {
  const [view, setView] = useState("home");

  const navigateTo = (newView: string) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 p-4 md:p-6 gap-4">
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        {view === "home" && <HomeView setView={navigateTo} />}
        {view === "book" && <BookingForm onBack={() => navigateTo("home")} />}
        {view === "track" && <TrackingView onBack={() => navigateTo("home")} />}
      </main>
    </div>
  );
}
