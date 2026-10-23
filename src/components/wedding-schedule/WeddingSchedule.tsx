"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface WeddingDay {
  id: string;
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  title: string;
  urduTitle?: string;
  subtitle?: string;
  venue?: string;
  venueAddress?: string;
  mapsUrl?: string;
  time?: string;
  ladiesAttire?: string;
  gentsAttire?: string;
  outfit?: string;
  outfitColors?: { name: string; hex: string }[];
  hairstyle?: string;
  jewellery?: string;
  dinnerNote?: string;
  highlightNote?: string;
  description?: string;
  bgImage: string;
  nextDayTitle?: string;
}

const SCHEDULE_DAYS: WeddingDay[] = [
  {
    id: "day-1",
    dayNumber: 1,
    date: "25th October 2026",
    dayOfWeek: "Sunday",
    title: "Rajjaga",
    urduTitle: "شبِ رت جگا",
    subtitle: "A Night of Awakening & Blessings",
    venue: "At Home",
    venueAddress: "Tahera Manzil, Silk Mill Colony, Aurangabad",
    mapsUrl: "https://goo.gl/maps/BXPYEf6Kq2m2VnJE7?g_st=aw",
    description: "Inaugurating the wedding festivities with an intimate family night of traditional wedding songs, prayers, and celebratory laughter.",
    bgImage: "/wedding-schedule/bg-1.jpg",
    nextDayTitle: "Day 2: Sufi Night",
  },
  {
    id: "day-2",
    dayNumber: 2,
    date: "26th October 2026",
    dayOfWeek: "Monday",
    title: "Sufi Night",
    urduTitle: "محفلِ قوالی",
    subtitle: "An evening of qawwali",
    venue: "Jai Hind Farm House",
    venueAddress: "Aurangabad",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Jai+Hind+Farm+House+Aurangabad",
    time: "7:00 PM to 11:00 PM",
    description: "An enchanting musical evening filled with soulful Sufiana qawwalis, divine poetry, and celebration under the shimmering chandeliers.",
    bgImage: "/wedding-schedule/bg-2.jpg",
    nextDayTitle: "Day 3: Haldi Ceremony",
  },
  {
    id: "day-3",
    dayNumber: 3,
    date: "27th October 2026",
    dayOfWeek: "Tuesday",
    title: "Haldi Ceremony",
    urduTitle: "رنگِ ہلدی",
    subtitle: "Range haldi",
    venue: "Unnati Lawns",
    venueAddress: "Kranti Chowk, beside DFC Gym, Aurangabad",
    mapsUrl: "https://maps.app.goo.gl/KMU3rtJpqoASuoa38",
    time: "4:00 PM",
    ladiesAttire: "Orange and Hot Pink",
    outfitColors: [
      { name: "Orange", hex: "#f97316" },
      { name: "Hot Pink", hex: "#ec4899" },
    ],
    gentsAttire: "White Kurta with Shawl",
    hairstyle: "Paranda (Not compulsory)",
    description: "Bathed in auspicious turmeric, vibrant marigolds, and exuberant joy as colors of celebration fill the air.",
    bgImage: "/wedding-schedule/bg-3.jpg",
    nextDayTitle: "Day 4: Sachak ki Shaam",
  },
  {
    id: "day-4",
    dayNumber: 4,
    date: "28th October 2026",
    dayOfWeek: "Wednesday",
    title: "Sachak",
    urduTitle: "ساچق کی شام",
    subtitle: "Sachak ki shaam",
    venue: "Unnati Lawns",
    venueAddress: "Kranti Chowk, beside DFC Gym, Aurangabad",
    mapsUrl: "https://maps.app.goo.gl/KMU3rtJpqoASuoa38",
    time: "5:00 PM",
    ladiesAttire: "Any shade of Green",
    outfitColors: [
      { name: "Emerald Green", hex: "#047857" },
      { name: "Olive Green", hex: "#65a30d" },
      { name: "Mint Sage", hex: "#10b981" },
    ],
    jewellery: "Earring supporters (Not compulsory)",
    description: "A cherished pre-wedding evening honouring timeless traditions and graceful blessings wrapped in emerald elegance.",
    bgImage: "/wedding-schedule/bg-4.jpg",
    nextDayTitle: "Day 5: Nikkah Ceremony",
  },
  {
    id: "day-5",
    dayNumber: 5,
    date: "29th October 2026",
    dayOfWeek: "Thursday",
    title: "Nikkah Ceremony",
    urduTitle: "عقدِ نکاح",
    subtitle: "A beautiful beginning written by Allah",
    venue: "Ellora Lawns",
    venueAddress: "Aurangabad",
    mapsUrl: "https://maps.app.goo.gl/7kvLoxuC5CGF1Hpr5",
    ladiesAttire: "White dress for the hijab-qubool moment",
    dinnerNote: "For the evening dinner, you can wear any outfit of your choice.",
    description: "Two souls united in a divine bond of love and faith. May Allah bless this sacred union with lifelong peace and bliss.",
    bgImage: "/wedding-schedule/bg-1.jpg",
    nextDayTitle: "Day 6: Walima",
  },
  {
    id: "day-6",
    dayNumber: 6,
    date: "30th October 2026",
    dayOfWeek: "Friday",
    title: "Walima",
    urduTitle: "دعوتِ ولیمہ",
    subtitle: "A Grand Feast of Gratitude",
    venue: "Ikon Celebration",
    venueAddress: "Aurangabad",
    mapsUrl: "https://maps.app.goo.gl/SFFiNM251KumjkUEA",
    time: "Reaching Time: 8:00 PM",
    description: "A joyous Sunnah banquet celebrating together with cherished family and friends in gratitude and warmth.",
    bgImage: "/wedding-schedule/bg-2.jpg",
    nextDayTitle: "Day 7: Gap Day",
  },
  {
    id: "day-7",
    dayNumber: 7,
    date: "31st October 2026",
    dayOfWeek: "Saturday",
    title: "Gap Day",
    urduTitle: "روزِ آرام و راحت",
    subtitle: "A Day of Leisure & Rest",
    description: "A peaceful day reserved for rest, relaxation, and rejuvenation before tomorrow's Grand Reception.",
    highlightNote: "Rest your dancing feet & prepare your finest ensembles!",
    bgImage: "/wedding-schedule/bg-3.jpg",
    nextDayTitle: "Day 8: Grand Reception",
  },
  {
    id: "day-8",
    dayNumber: 8,
    date: "1st November 2026",
    dayOfWeek: "Sunday",
    title: "Reception",
    urduTitle: "شاندار استقبالیہ",
    subtitle: "The Grand Finale Celebration",
    venue: "Ikon Celebration",
    venueAddress: "Aurangabad",
    mapsUrl: "https://maps.app.goo.gl/SFFiNM251KumjkUEA",
    time: "Reaching Time: 8:00 PM",
    ladiesAttire: "Pastel-coloured saree with a dupatta.",
    highlightNote: "✨ Ladies: Everyone has to drape dupatta ✨",
    description: "The magnificent grand finale celebrating our new beginning with elegance, joy, and unforgettable memories.",
    bgImage: "/wedding-schedule/bg-4.jpg",
    nextDayTitle: "Ending Note ✦",
  },
];

type EnvelopeStage = "envelope" | "opening" | "opened";

export function WeddingSchedule() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const revealVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [stage, setStage] = useState<EnvelopeStage>("envelope");
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const totalPages = SCHEDULE_DAYS.length + 2; // Card 0 (First Card) + 8 Schedule Days (1 to 8) + Ending Card

  // Reflect the dedicated invitation slug in the URL bar when visiting root or old slug
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.pathname === "/" ||
        window.location.pathname === "/haseeb&adeeba_events" ||
        window.location.pathname === "/haseeb%26adeeba_events")
    ) {
      window.history.replaceState(null, "", "/haseeb&adeeba_wedding_events");
    }
  }, []);

  // Handle opening the envelope
  const handleOpenEnvelope = () => {
    if (stage === "opening") return;
    setStage("opening");

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }

    const intro = introVideoRef.current;
    if (intro) {
      intro.muted = true;
      intro.currentTime = 0;
      intro.play().catch(() => {
        // Fallback if video play was blocked
        setStage("opened");
      });
    } else {
      setStage("opened");
    }
  };

  const handleIntroEnded = () => {
    setStage("opened");
    if (revealVideoRef.current) {
      revealVideoRef.current.currentTime = 0;
      revealVideoRef.current.play().catch(() => {});
    }
  };

  // Replay envelope animation
  const handleReplayEnvelope = () => {
    setStage("envelope");
    setMenuOpen(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  // Track active page on scroll (only when opened)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || stage !== "opened") return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      const pageHeight = container.clientHeight;
      if (pageHeight > 0) {
        const currentIndex = Math.round(scrollPos / pageHeight);
        setActivePageIndex(currentIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [stage]);

  const scrollToPage = (index: number) => {
    if (!containerRef.current) return;
    const pageHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * pageHeight,
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  const handleNext = () => {
    if (activePageIndex < totalPages - 1) {
      scrollToPage(activePageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activePageIndex > 0) {
      scrollToPage(activePageIndex - 1);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next) {
          audioRef.current.play().catch(() => {});
        }
      }
      if (introVideoRef.current) introVideoRef.current.muted = true;
      if (revealVideoRef.current) revealVideoRef.current.muted = true;
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage !== "opened") return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#120b07] select-none text-[#2d1e12]">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        preload="auto"
        loop
      />
      
      {/* ======================================================== */}
      {/* STAGE 1: ENVELOPE OPENING SCENE ("You Are Invited")      */}
      {/* ======================================================== */}
      {stage !== "opened" && (
        <div 
          onClick={handleOpenEnvelope}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer overflow-hidden transition-opacity duration-700"
        >
          {/* Intro Video (Pink envelope opening) */}
          <video
            ref={introVideoRef}
            src="/envelope/intro.mp4"
            poster="/envelope/intro-poster.jpg"
            playsInline
            preload="auto"
            muted
            onEnded={handleIntroEnded}
            className="absolute inset-0 h-full w-full object-cover scale-[1.01]"
          />

          {/* Top audio button during envelope screen */}
          <div className="absolute top-4 right-4 z-20 pointer-events-auto">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-[#d4af37]/60 text-[#fbf1db] shadow-md backdrop-blur-md active:scale-95 transition-all"
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                  <path d="m17 9 6 6M23 9l-6 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
                </svg>
              )}
            </button>
          </div>

          {/* Interactive Tap Prompt (visible while idle) */}
          {stage === "envelope" && (
            <div className="relative z-10 flex flex-col items-center gap-3 px-6 pointer-events-none mt-auto mb-16 sm:mb-20 animate-fade-in">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c120c]/80 border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.45)] backdrop-blur-md animate-pulse">
                <span className="text-[#d4af37] text-sm">✉️</span>
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.25em] text-[#fbf1db] uppercase">
                  Tap to Open Invitation
                </span>
                <span className="text-[#d4af37] text-sm">✦</span>
              </div>
              <p className="font-cormorant italic text-xs sm:text-sm text-white/80 drop-shadow-md">
                Click anywhere to reveal the invitation
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: REVEALED INVITATION & 8-DAY FUNCTIONS SCHEDULE  */}
      {/* ======================================================== */}

      {/* Top Floating Luxury Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3 bg-gradient-to-b from-[#0e0804]/90 via-[#0e0804]/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.24em] text-[#fbf1db] drop-shadow-md">
            HASEEB & ADEEBA
          </span>
        </div>

        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#241911]/85 border border-[#d4af37]/45 text-[#fbf1db] shadow-md backdrop-blur-md active:scale-95 transition-all"
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="m17 9 6 6M23 9l-6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
              </svg>
            )}
          </button>

          {/* Quick Jump Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241911]/85 hover:bg-[#342418] border border-[#d4af37]/45 shadow-lg backdrop-blur-md text-[#f5ecd8] text-[11px] font-cinzel tracking-wider transition-all"
          >
            <span>OVERVIEW</span>
            <svg className={`w-3 h-3 text-[#d4af37] transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Quick Jump Drawer Modal */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-[32px] bg-[#faf6ee] border-2 border-[#d4af37] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e5d4b4] mb-3">
              <span className="font-cinzel text-xs font-bold tracking-[0.2em] text-[#54361a] uppercase">
                Jump to Function
              </span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-[#eee0c5] flex items-center justify-center text-[#54361a] hover:bg-[#dfcdab]"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
              <button
                onClick={() => scrollToPage(0)}
                className={`flex items-center justify-between p-2.5 rounded-xl font-cinzel text-xs tracking-wider transition-all ${
                  activePageIndex === 0
                    ? "bg-[#ecd7aa] text-[#42260e] font-bold border border-[#cda252]"
                    : "hover:bg-[#f3e7d1] text-[#5b3c20]"
                }`}
              >
                <span>❖ The Royal Invitation</span>
                <span className="text-[10px] opacity-75">Opening Card</span>
              </button>
              {SCHEDULE_DAYS.map((day, idx) => {
                const pageIdx = idx + 1;
                const isCurrent = activePageIndex === pageIdx;
                return (
                  <button
                    key={day.id}
                    onClick={() => scrollToPage(pageIdx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl font-cinzel text-xs tracking-wider transition-all ${
                      isCurrent
                        ? "bg-[#ecd7aa] text-[#42260e] font-bold border border-[#cda252]"
                        : "hover:bg-[#f3e7d1] text-[#5b3c20]"
                    }`}
                  >
                    <span>Day {day.dayNumber}: {day.title}</span>
                    <span className="font-cormorant text-[11px] font-semibold text-[#8a5f22]">
                      {day.date.split(" ")[0]} {day.date.split(" ")[1].slice(0, 3)}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => scrollToPage(totalPages - 1)}
                className={`flex items-center justify-between p-2.5 rounded-xl font-cinzel text-xs tracking-wider transition-all ${
                  activePageIndex === totalPages - 1
                    ? "bg-[#ecd7aa] text-[#42260e] font-bold border border-[#cda252]"
                    : "hover:bg-[#f3e7d1] text-[#5b3c20]"
                }`}
              >
                <span>❖ Ending Note &amp; Dua</span>
                <span className="text-[10px] opacity-75">Thank You</span>
              </button>
              
              <div className="pt-2 border-t border-[#e5d4b4]/60 mt-1">
                <button
                  onClick={handleReplayEnvelope}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-[#eee0c5]/70 hover:bg-[#e4d3b5] text-[#54361a] font-cinzel text-[11px] font-semibold tracking-wider transition-all"
                >
                  <span>✉️ Replay Envelope Opening</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Side Navigation Tracker (Clickable dots) */}
      <nav 
        aria-label="Pages Navigation"
        className="fixed right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 py-3 px-1.5 rounded-full bg-[#18110b]/75 border border-[#d4af37]/35 backdrop-blur-md shadow-xl"
      >
        {Array.from({ length: totalPages }).map((_, idx) => {
          const isActive = activePageIndex === idx;
          const label = idx === 0 ? "Invitation" : idx === totalPages - 1 ? "Thank You" : `Day ${idx}`;
          return (
            <button
              key={idx}
              onClick={() => scrollToPage(idx)}
              title={label}
              className={`group relative flex items-center justify-center transition-all duration-300 ${
                isActive ? "scale-125" : "hover:scale-110 opacity-60 hover:opacity-100"
              }`}
            >
              <span
                className={`block transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-2.5 h-4.5 bg-gradient-to-b from-[#fde68a] to-[#d97706] shadow-[0_0_8px_#f59e0b]"
                    : "w-2 h-2 bg-[#ecd9b8]/80 group-hover:bg-[#fde68a]"
                }`}
              />
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 px-2 py-0.5 rounded text-[10px] font-cinzel font-medium tracking-wider bg-[#1d140e] text-[#fbeec8] border border-[#d4af37]/40 shadow whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Snap Scroll Viewport Container */}
      <main
        ref={containerRef}
        className="w-full h-[100dvh] overflow-y-scroll snap-container no-scrollbar scroll-smooth touch-pan-y overscroll-y-none"
      >
        {/* ======================================================== */}
        {/* CARD 0: THE FIRST HERO CARD (Video Playing & Overlay)    */}
        {/* ======================================================== */}
        <section
          id="card-0"
          className="snap-section relative w-full h-[100dvh] flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden"
        >
          {/* Background Video */}
          <video
            ref={revealVideoRef}
            src="/envelope/reveal.mp4"
            poster="/envelope/reveal-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
          />

          {/* 70% Black Cinematic Overlay */}
          <div className="absolute inset-0 bg-black/70 pointer-events-none" />

          {/* Golden Palace Radial Glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(184, 134, 11, 0.12) 0%, rgba(0, 0, 0, 0.55) 100%)",
            }}
          />

          {/* Delicate Royal Ornate Frame Border with Corner Accents */}
          <div className="pointer-events-none absolute inset-3 sm:inset-6 md:inset-8 border border-[#d4af37]/35 rounded-2xl z-20">
            <div className="absolute inset-[3px] border border-[#d4af37]/15 rounded-[13px]" />
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr" />
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br" />
          </div>

          {/* Card 0 Content: Centered Royal Islamic Announcement */}
          <div className="relative z-20 w-full max-w-lg flex flex-col items-center justify-center text-center px-4 py-8">
            
            {/* Arabic Bismillah Calligraphy */}
            <p 
              dir="rtl"
              className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-[#eddcb2] tracking-wide leading-relaxed drop-shadow-[0_2px_14px_rgba(212,175,55,0.45)] mb-1"
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>

            {/* English Translation */}
            <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.28em] text-[#d4af37] font-medium uppercase leading-relaxed max-w-xs sm:max-w-md">
              IN THE NAME OF ALLAH,
              <br />
              THE MOST GRACIOUS, THE MOST MERCIFUL
            </p>

            {/* Gold Ornamental Divider */}
            <div className="flex items-center justify-center gap-2.5 w-36 sm:w-48 my-2 sm:my-3 opacity-80">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]" />
              <svg className="w-3.5 h-3.5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]" />
            </div>

            {/* Invitation Preamble */}
            <p className="font-cinzel text-[10.5px] sm:text-[12px] tracking-[0.24em] text-white/90 uppercase leading-relaxed max-w-xs sm:max-w-md font-normal">
              TOGETHER WITH THEIR FAMILIES
              <br />
              IT IS OUR PLEASURE TO INVITE YOU TO
              <br />
              THE WEDDING CELEBRATION OF
            </p>

            {/* Couple Names (Shaikh Haseeb and Adeeba Afreen) */}
            <div className="my-2 sm:my-3 flex flex-col items-center">
              <h1 className="font-script text-[44px] sm:text-6xl lg:text-7xl text-[#fdfbf7] drop-shadow-[0_4px_22px_rgba(212,175,55,0.45)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] tracking-wide leading-[1.08]">
                Shaikh Haseeb
              </h1>
              <p className="font-cormorant text-[13px] sm:text-base tracking-[0.06em] text-[#eddcb2] mt-0.5 sm:mt-1 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                S/o. Shaikh Habib S/o. Shaikh Pasha (Late)
              </p>
              <div className="flex items-center justify-center gap-3 my-1.5 sm:my-2 opacity-90">
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                <span className="font-cormorant italic text-base sm:text-xl text-[#eddcb2]">With</span>
                <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
              </div>
              <h1 className="font-script text-[44px] sm:text-6xl lg:text-7xl text-[#fdfbf7] drop-shadow-[0_4px_22px_rgba(212,175,55,0.45)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] tracking-wide leading-[1.08]">
                Adeeba Afreen
              </h1>
              <p className="font-cormorant text-[13px] sm:text-base tracking-[0.06em] text-[#eddcb2] mt-0.5 sm:mt-1 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                D/o. Mohammad Meraj Salik S/o. Mohammad Hamed (Late)
              </p>
            </div>

            {/* Gold Ornamental Divider */}
            <div className="flex items-center justify-center gap-2.5 w-36 sm:w-48 my-2 sm:my-3 opacity-80">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]" />
              <svg className="w-3.5 h-3.5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]" />
            </div>

            {/* Quranic Verse in Arabic */}
            <p 
              dir="rtl"
              className="font-arabic text-2xl sm:text-3xl text-[#eddcb2] tracking-wider leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
            >
              وَخَلَقْنَاكُمْ أَزْوَاجًا
            </p>

            {/* Translation & Quran Reference */}
            <p className="font-cormorant italic text-sm sm:text-base text-white/95 tracking-wide mt-0.5">
              “And We created you in pairs.”
            </p>
            <p className="font-cinzel text-[10px] sm:text-xs text-[#d4af37] tracking-[0.25em] uppercase mt-0.5 font-medium">
              QURAN 78:8
            </p>

            {/* Scroll Down Action Prompt */}
            <button
              onClick={() => scrollToPage(1)}
              className="group flex flex-col items-center mt-5 sm:mt-7 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] mb-1 font-semibold font-cinzel text-[#d4af37] group-hover:scale-105 transition-transform">
                SCROLL DOWN
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center animate-bounce bg-black/30 backdrop-blur-xs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4af37]">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARDS 1 TO 8: 8 DAYS SCHEDULE (Snap-locked, Continuity) */}
        {/* ======================================================== */}
        {SCHEDULE_DAYS.map((event, index) => {
          const pageIndex = index + 1;

          return (
            <section
              key={event.id}
              id={event.id}
              className="snap-section relative w-full h-[100dvh] flex flex-col justify-center items-center px-3 sm:px-6 overflow-hidden"
            >
              {/* Randomized/Alternating Royal Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={event.bgImage}
                  alt={`${event.title} background`}
                  fill
                  priority={index < 2}
                  className="object-cover object-center scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#18110b]/50 via-[#18110b]/30 to-[#120a06]/70 pointer-events-none" />
              </div>

              {/* Exact Matching Royal Outer Frame with Gold Corner Accents */}
              <div className="pointer-events-none absolute inset-3 sm:inset-6 md:inset-8 border border-[#d4af37]/35 rounded-2xl z-20">
                <div className="absolute inset-[3px] border border-[#d4af37]/15 rounded-[13px]" />
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl" />
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr" />
                <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl" />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br" />
              </div>

              {/* Royal Content Plaque (Mobile Responsive Centered Card) */}
              <div className="relative z-10 w-full max-w-[92%] sm:max-w-md lg:max-w-lg mx-auto flex flex-col items-center text-center py-4 px-4 sm:py-6 sm:px-7 rounded-[32px] sm:rounded-[36px] bg-[#faf6ee]/94 sm:bg-[#faf6ee]/96 border-2 border-[#d4af37]/65 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md">
                
                {/* Top Badge: Day Number */}
                <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#f1e5cd] border border-[#cba657] mb-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08e28]" />
                  <span className="font-cinzel text-[12px] sm:text-[13px] font-bold tracking-[0.2em] text-[#63431d] uppercase">
                    DAY {event.dayNumber} OF 8
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c08e28]" />
                </div>

                {/* Date Display */}
                <div className="mb-0.5">
                  <h3 className="font-cinzel text-[14px] sm:text-[16px] font-semibold tracking-[0.14em] text-[#4b2f15]">
                    {event.date}
                  </h3>
                  <p className="font-cormorant italic text-[13px] sm:text-[14px] text-[#8c672e] tracking-wider font-semibold">
                    {event.dayOfWeek}
                  </p>
                </div>

                {/* Urdu Script Accent */}
                {event.urduTitle && (
                  <div className="font-arabic text-[18px] sm:text-[20px] text-[#946922] leading-tight">
                    {event.urduTitle}
                  </div>
                )}

                {/* Event Main Title */}
                <h2 className="font-cinzel text-[22px] sm:text-[26px] font-bold tracking-[0.12em] text-[#2c170a] uppercase my-0.5">
                  {event.title}
                </h2>

                {/* Script Subtitle */}
                {event.subtitle && (
                  <div className="font-script text-[26px] sm:text-[32px] text-[#9c6f21] mb-1 leading-tight">
                    {event.subtitle}
                  </div>
                )}

                {/* Royal Divider Line */}
                <div className="flex items-center gap-2 my-1 w-3/4">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#bfa15f] to-[#bfa15f]" />
                  <span className="text-[#a67c29] text-[11px]">✤ ⚜ ✤</span>
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#bfa15f] to-[#bfa15f]" />
                </div>

                {/* Information Sections Grid */}
                <div className="w-full flex flex-col gap-1.5 sm:gap-2 my-1 text-left">
                  
                  {/* Venue Box */}
                  {event.venue && (
                    <div className="p-2 sm:p-2.5 rounded-xl bg-[#f4ebda]/90 border border-[#dfca9f]/75 shadow-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#ecd5a9] border border-[#cda252] flex items-center justify-center shrink-0 mt-0.5 text-[#7c5017]">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <span className="font-cinzel text-[11px] tracking-widest text-[#825b29] uppercase font-bold block">
                            Venue
                          </span>
                          <p className="font-cormorant font-semibold text-[14px] sm:text-[16px] text-[#341d0c] leading-tight">
                            {event.venue}
                          </p>
                          {event.venueAddress && (
                            <p className="font-cormorant text-[13px] sm:text-[14px] text-[#6e5033] leading-tight mt-0.5">
                              {event.venueAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      {event.mapsUrl && (
                        <div className="mt-2 pt-1.5 border-t border-[#dfca9f]/50">
                          <a
                            href={event.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#e8d5ad] via-[#f1dfb8] to-[#e8d5ad] hover:from-[#dfc896] hover:to-[#e3cc9d] border border-[#c99f4e] text-[#4f2f0f] font-cinzel text-[12px] sm:text-[13px] font-bold tracking-wider shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 text-[#8a5b1c]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span>VIEW ON GOOGLE MAPS</span>
                            <svg className="w-3 h-3 text-[#8a5b1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Time Box */}
                  {event.time && (
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f4ebda]/85 border border-[#dfca9f]/60">
                      <div className="w-6 h-6 rounded-full bg-[#ecd5a9] border border-[#cda252] flex items-center justify-center shrink-0 text-[#7c5017]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-cinzel text-[11px] tracking-widest text-[#825b29] uppercase font-bold block">
                          Timing
                        </span>
                        <p className="font-cormorant font-bold text-[14px] sm:text-[16px] text-[#341d0c]">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Outfit / Dress Code Box */}
                  {(event.ladiesAttire || event.gentsAttire || event.outfit) && (
                    <div className="p-2 sm:p-2.5 rounded-xl bg-[#f6eee2]/90 border border-[#dfca9f]/75 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#84571c]">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </span>
                        <span className="font-cinzel text-[11px] tracking-widest text-[#825b29] uppercase font-bold">
                          Dress Code
                        </span>
                      </div>

                      {/* Ladies Attire */}
                      {(event.ladiesAttire || event.outfit) && (
                        <div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-cinzel text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#916229] font-bold">
                              Ladies Attire:
                            </span>
                            <span className="font-cormorant font-bold text-[14px] sm:text-[16px] text-[#341d0c]">
                              {event.ladiesAttire || event.outfit}
                            </span>
                          </div>

                          {/* Color Palette Swatches */}
                          {event.outfitColors && (
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {event.outfitColors.map((color, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 border border-stone-300 shadow-xs"
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span className="font-cinzel text-[11px] font-semibold text-[#523820]">
                                    {color.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Gents Attire */}
                      {event.gentsAttire && (
                        <div className="pt-1.5 border-t border-[#dfca9f]/40 flex items-center gap-1 flex-wrap">
                          <span className="font-cinzel text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#916229] font-bold">
                            Gents Attire:
                          </span>
                          <span className="font-cormorant font-bold text-[14px] sm:text-[16px] text-[#341d0c]">
                            {event.gentsAttire}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hairstyle / Jewellery Notes */}
                  {(event.hairstyle || event.jewellery) && (
                    <div className="flex gap-2 text-[14px]">
                      {event.hairstyle && (
                        <div className="flex-1 p-1.5 rounded-lg bg-[#ede3cf]/70 border border-[#d3be94]">
                          <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#7e5621] font-bold block">
                            Hairstyle
                          </span>
                          <span className="font-cormorant font-semibold text-[13px] sm:text-[14px] text-[#3a2311]">
                            {event.hairstyle}
                          </span>
                        </div>
                      )}
                      {event.jewellery && (
                        <div className="flex-1 p-1.5 rounded-lg bg-[#ede3cf]/70 border border-[#d3be94]">
                          <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#7e5621] font-bold block">
                            Jewellery
                          </span>
                          <span className="font-cormorant font-semibold text-[13px] sm:text-[14px] text-[#3a2311]">
                            {event.jewellery}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dinner Note (e.g. Nikkah evening dinner) */}
                  {event.dinnerNote && (
                    <div className="p-2 rounded-xl bg-[#f2e7d3]/90 border border-[#d5bb82] text-[14px]">
                      <span className="font-cinzel text-[11px] text-[#784e1b] font-bold tracking-wider uppercase block mb-0.5">
                        🔹 Evening Dinner
                      </span>
                      <p className="font-cormorant italic font-semibold text-[13px] sm:text-[14px] text-[#392211]">
                        {event.dinnerNote}
                      </p>
                    </div>
                  )}

                  {/* Highlight Callout */}
                  {event.highlightNote && (
                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#edd9b1] via-[#f7ebcf] to-[#edd9b1] border border-[#b98e3b] shadow-xs text-center">
                      <p className="font-cinzel font-bold text-[13px] sm:text-[14px] text-[#523311] tracking-wider uppercase">
                        {event.highlightNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Prompt */}
                <div className="mt-1.5 text-center">
                  <button
                    onClick={() => scrollToPage(pageIndex < 8 ? pageIndex + 1 : totalPages - 1)}
                    className="group inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#f0e4cc] hover:bg-[#e6d6b6] border border-[#caa455] text-[#6d4617] transition-all cursor-pointer"
                  >
                    <span className="font-cinzel text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase">
                      {event.nextDayTitle || (pageIndex === 8 ? "Ending & Dua ✦" : "Next Day")}
                    </span>
                    <svg className="w-3 h-3 text-[#885c21] group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

              </div>
            </section>
          );
        })}

        {/* ======================================================== */}
        {/* CARD 9: ENDING PAGE / WITH LOVE & GRATITUDE              */}
        {/* ======================================================== */}
        <section
          id="ending-page"
          className="snap-section relative w-full h-[100dvh] flex flex-col justify-center items-center px-3 sm:px-6 overflow-hidden"
        >
          {/* Royal Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/wedding-schedule/bg-1.jpg"
              alt="Ending background"
              fill
              className="object-cover object-center scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#18110b]/60 via-[#18110b]/40 to-[#120a06]/75 pointer-events-none" />
          </div>

          {/* Exact Matching Royal Outer Frame with Gold Corner Accents */}
          <div className="pointer-events-none absolute inset-3 sm:inset-6 md:inset-8 border border-[#d4af37]/35 rounded-2xl z-20">
            <div className="absolute inset-[3px] border border-[#d4af37]/15 rounded-[13px]" />
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr" />
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br" />
          </div>

          {/* Royal Content Plaque (Mobile Responsive Centered Card) */}
          <div className="relative z-10 w-full max-w-[92%] sm:max-w-md lg:max-w-lg mx-auto flex flex-col items-center text-center py-5 px-5 sm:py-7 sm:px-8 rounded-[32px] sm:rounded-[36px] bg-[#faf6ee]/94 sm:bg-[#faf6ee]/96 border-2 border-[#d4af37]/65 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#f1e5cd] border border-[#cba657] mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c08e28]" />
              <span className="font-cinzel text-[12px] sm:text-[13px] font-bold tracking-[0.2em] text-[#63431d] uppercase">
                WITH LOVE &amp; GRATITUDE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c08e28]" />
            </div>

            {/* Arabic Dua */}
            <div 
              dir="rtl"
              className="font-arabic text-[22px] sm:text-[26px] text-[#946922] leading-relaxed my-1 drop-shadow-xs"
            >
              بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </div>

            {/* Translation */}
            <p className="font-cormorant italic text-[13px] sm:text-[14px] text-[#8c672e] tracking-wider font-semibold max-w-xs mb-1">
              “May Allah bless you, shower His blessings upon you, and unite you both in goodness.”
            </p>

            {/* Royal Divider Line */}
            <div className="flex items-center gap-2 my-1.5 w-3/4">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#bfa15f] to-[#bfa15f]" />
              <span className="text-[#a67c29] text-[11px]">✤ ⚜ ✤</span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#bfa15f] to-[#bfa15f]" />
            </div>

            {/* Main Title */}
            <h2 className="font-cinzel text-[22px] sm:text-[26px] font-bold tracking-[0.14em] text-[#2c170a] uppercase my-0.5">
              THANK YOU
            </h2>

            {/* Script Subtitle */}
            <div className="font-script text-[26px] sm:text-[32px] text-[#9c6f21] mb-1 leading-tight">
              We Eagerly Look Forward To Celebrating With You
            </div>

            {/* Couple Names */}
            <div className="my-2 p-2.5 rounded-2xl bg-[#f4ebda]/85 border border-[#dfca9f]/60 w-full">
              <p className="font-cinzel text-[18px] sm:text-[20px] font-bold tracking-[0.18em] text-[#3d230f]">
                HASEEB &amp; ADEEBA
              </p>
              <p className="font-cormorant italic text-[14px] sm:text-[16px] text-[#775225] font-semibold mt-0.5">
                Along with the entire family
              </p>
            </div>

            {/* Warm closing note */}
            <p className="font-cormorant text-[14px] sm:text-[16px] text-[#614529] max-w-xs leading-relaxed my-1 italic font-medium">
              Your prayers, presence, and blessings mean the world to us as we begin this sacred chapter together.
            </p>

            {/* Back to top prompt */}
            <div className="mt-2.5">
              <button
                onClick={() => scrollToPage(0)}
                className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f0e4cc] hover:bg-[#e6d6b6] border border-[#caa455] text-[#6d4617] font-cinzel text-[12px] font-semibold tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>❖ BACK TO BEGINNING</span>
                <svg className="w-3 h-3 text-[#885c21] group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

          </div>
        </section>
      </main>

      {/* Floating Bottom Nav Indicators (Prev & Next Mobile Buttons) */}
      <div className="fixed bottom-3 left-0 right-0 z-40 flex items-center justify-between px-5 pointer-events-none">
        {activePageIndex > 0 ? (
          <button
            onClick={handlePrev}
            className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#241911]/85 border border-[#d4af37]/50 text-[#f5ecd8] text-[12px] sm:text-[13px] font-cinzel font-medium backdrop-blur-md shadow-lg active:scale-95 transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>PREV</span>
          </button>
        ) : <div />}

        {activePageIndex < totalPages - 1 && (
          <button
            onClick={handleNext}
            className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#241911]/85 border border-[#d4af37]/50 text-[#f5ecd8] text-[12px] sm:text-[13px] font-cinzel font-medium backdrop-blur-md shadow-lg active:scale-95 transition-all"
          >
            <span>NEXT</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
