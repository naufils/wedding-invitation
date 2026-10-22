"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

export function Countdown({ 
  weddingDate,
  partnerA,
  partnerB
}: { 
  weddingDate: string;
  partnerA?: string;
  partnerB?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(weddingDate));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const units: [string, number][] = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ];

  if (!mounted) return null;

  return (
    <section className="flex flex-col items-center gap-6 px-6 py-16">
      <h2 className="font-serif text-3xl">Counting Down</h2>
      <div className="flex gap-6">
        {units.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-serif text-4xl tabular-nums">{value}</span>
            <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
          </div>
        ))}
      </div>
      <a 
        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${partnerA || 'Our'} & ${partnerB || 'Our'} Wedding`)}&dates=${new Date(weddingDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(weddingDate).getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-3 rounded-full bg-current font-medium transition-transform hover:scale-105 active:scale-95 shadow-md mt-6"
        style={{
          color: 'var(--theme-color, currentColor)',
          backgroundColor: 'currentColor'
        }}
      >
        <span style={{ color: '#fff' }}>Add to Calendar</span>
      </a>
    </section>
  );
}
