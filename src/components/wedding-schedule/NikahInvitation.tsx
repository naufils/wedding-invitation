"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type EnvelopeStage = "envelope" | "opening" | "opened";

export function NikahInvitation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const revealVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [stage, setStage] = useState<EnvelopeStage>("envelope");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Reflect the dedicated Nikkah invitation slug in the URL bar when visiting alias slugs
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.pathname === "/haseeb-adeeba-nikah-invitation" ||
        window.location.pathname === "/haseeb_adeeba_nikah_invitation" ||
        window.location.pathname === "/haseeb%26adeeba_nikah_invitation" ||
        window.location.pathname === "/haseeb&adeeba_nikkah_invitation" ||
        window.location.pathname === "/haseeb%26adeeba_nikkah_invitation")
    ) {
      window.history.replaceState(null, "", "/haseeb&adeeba_nikah_invitation");
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

  const scrollToPage = (index: number) => {
    if (!containerRef.current) return;
    const pageHeight = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * pageHeight,
      behavior: "smooth",
    });
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
      {/* STAGE 2: REVEALED INVITATION & NIKKAH CEREMONY           */}
      {/* ======================================================== */}

      {/* Top Floating Luxury Header Bar (Clean - No Overview/Navigation) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-3 bg-gradient-to-b from-[#0e0804]/90 via-[#0e0804]/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.24em] text-[#fbf1db] drop-shadow-md">
            HASEEB &amp; ADEEBA
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
        </div>
      </header>

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
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARD 1: THE GRAND NIKKAH CEREMONY (Full-Page Royal Card) */}
        {/* ======================================================== */}
        <section
          id="nikah-ceremony"
          className="snap-section relative w-full h-[100dvh] flex flex-col justify-center items-center px-3 sm:px-6 overflow-hidden"
        >
          {/* Royal Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/wedding-schedule/bg-1.jpg"
              alt="Nikkah Ceremony background"
              fill
              priority
              className="object-cover object-center scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#18110b]/55 via-[#18110b]/35 to-[#120a06]/75 pointer-events-none" />
          </div>

          {/* Exact Matching Royal Outer Frame with Gold Corner Accents */}
          <div className="pointer-events-none absolute inset-3 sm:inset-6 md:inset-8 border border-[#d4af37]/35 rounded-2xl z-20">
            <div className="absolute inset-[3px] border border-[#d4af37]/15 rounded-[13px]" />
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl" />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr" />
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br" />
          </div>

          {/* Full-Page Royal Grand Content Plaque */}
          <div className="relative z-10 w-full max-w-[94%] sm:max-w-xl md:max-w-2xl mx-auto min-h-[78dvh] sm:min-h-[82dvh] max-h-[88dvh] flex flex-col justify-between items-center text-center py-6 px-5 sm:py-9 sm:px-10 md:py-10 md:px-12 rounded-[36px] sm:rounded-[44px] bg-[#faf6ee]/95 sm:bg-[#faf6ee]/97 border-2 border-[#d4af37]/75 shadow-[0_25px_70px_rgba(0,0,0,0.55),inset_0_0_35px_rgba(212,175,55,0.12)] backdrop-blur-md overflow-y-auto no-scrollbar">
            {/* Inner Filigree Border */}
            <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 border border-[#d4af37]/30 rounded-[28px] sm:rounded-[34px]" />

            {/* Top Header Section */}
            <div className="w-full flex flex-col items-center">
              {/* Top Royal Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#f3e7ce] via-[#faf2e1] to-[#f3e7ce] border border-[#cba657] mb-2 sm:mb-3 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                <span className="font-cinzel text-[11px] sm:text-[13px] font-bold tracking-[0.25em] text-[#5e3d16] uppercase">
                  THE SACRED UNION
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
              </div>

              {/* Urdu Script Accent */}
              <div
                dir="rtl"
                className="font-arabic text-[24px] sm:text-[30px] md:text-[34px] text-[#946922] leading-tight drop-shadow-xs"
              >
                عقدِ نکاح
              </div>

              {/* Event Main Title */}
              <h2 className="font-cinzel text-[26px] sm:text-[34px] md:text-[40px] font-bold tracking-[0.16em] text-[#2c170a] uppercase mt-0.5">
                NIKKAH CEREMONY
              </h2>

              {/* Script Subtitle */}
              <div className="font-script text-[30px] sm:text-[38px] md:text-[44px] text-[#9c6f21] leading-tight mt-0.5">
                A beautiful beginning written by Allah
              </div>

              {/* Poetic Blessing Description */}
              <p className="font-cormorant italic text-[15px] sm:text-[18px] text-[#5c3e20] max-w-md sm:max-w-lg leading-relaxed mt-1 sm:mt-2 font-medium">
                “Two souls united in a divine bond of love, faith, and eternal companionship. We cordially invite you to witness and bless our sacred covenant of marriage.”
              </p>

              {/* Royal Divider Line */}
              <div className="flex items-center gap-3 my-2.5 sm:my-4 w-4/5 max-w-md">
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#bfa15f] to-[#bfa15f]" />
                <span className="text-[#a67c29] text-xs sm:text-sm">✤ ⚜ ✤</span>
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#bfa15f] to-[#bfa15f]" />
              </div>

              {/* Grand Date, Day & Time Highlight Banner */}
              <div className="w-full max-w-lg py-2.5 px-4 sm:py-3.5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#f3e7cf]/90 via-[#faf3e3] to-[#f3e7cf]/90 border border-[#d6b676] shadow-xs flex flex-col items-center justify-center gap-1">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#8c5d1d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-cinzel text-[16px] sm:text-[19px] font-bold tracking-[0.16em] text-[#3a210c]">
                      29TH OCTOBER 2026
                    </span>
                  </div>
                  <span className="hidden sm:inline text-[#bfa15f]">•</span>
                  <span className="font-cormorant italic text-[16px] sm:text-[19px] text-[#835820] tracking-wider font-bold">
                    Thursday
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-1 mt-0.5 border-t border-[#d6b676]/50 w-4/5 sm:w-2/3">
                  <svg className="w-3.5 h-3.5 text-[#8c5d1d] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-cinzel text-[13px] sm:text-[15px] font-bold tracking-[0.14em] text-[#5e3d16] uppercase">
                    7:00 PM Onwards
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Information Sections Grid */}
            <div className="w-full max-w-lg flex flex-col gap-2.5 sm:gap-3.5 my-2.5 sm:my-4 text-left">
              {/* Venue Box */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#f4ebda]/95 border border-[#dfca9f] shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ecd5a9] border border-[#cda252] flex items-center justify-center shrink-0 mt-0.5 text-[#7c5017] shadow-2xs">
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="font-cinzel text-[11px] sm:text-[12px] tracking-[0.18em] text-[#825b29] uppercase font-bold block">
                      Royal Venue
                    </span>
                    <p className="font-cormorant font-bold text-[18px] sm:text-[22px] text-[#2e1808] leading-tight mt-0.5">
                      Ellora Lawns
                    </p>
                    <p className="font-cormorant text-[15px] sm:text-[17px] text-[#6e5033] leading-tight mt-0.5 font-medium">
                      Aurangabad
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#dfca9f]/60">
                  <a
                    href="https://maps.app.goo.gl/7kvLoxuC5CGF1Hpr5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 sm:py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e5cf9f] via-[#f2e2be] to-[#e5cf9f] hover:from-[#dcc088] hover:to-[#e6cfa0] border border-[#c59a45] text-[#45270b] font-cinzel text-[12px] sm:text-[13px] font-bold tracking-[0.14em] shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#8a5b1c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>VIEW ON GOOGLE MAPS</span>
                    <svg className="w-3.5 h-3.5 text-[#8a5b1c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Two-Column / Stacked Attire & Evening Dinner Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {/* Dress Code Box */}
                <div className="p-3 sm:p-4 rounded-2xl bg-[#f6eee2]/95 border border-[#dfca9f] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[#84571c]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </span>
                      <span className="font-cinzel text-[11px] sm:text-[12px] tracking-[0.16em] text-[#825b29] uppercase font-bold">
                        Dress Code
                      </span>
                    </div>
                    <p className="font-cinzel text-[10.5px] sm:text-[11px] uppercase tracking-wider text-[#916229] font-bold mt-1.5">
                      Ladies Attire:
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#fdfbf7] border border-[#b89d68] shadow-2xs shrink-0" />
                      <span className="font-cormorant italic font-bold text-[16px] sm:text-[18px] text-[#341d0c] leading-snug">
                        Ivory &amp; Pearl White Elegance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evening Dinner Box */}
                <div className="p-3 sm:p-4 rounded-2xl bg-[#f2e7d3]/95 border border-[#d5bb82] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[#84571c] text-xs">✦</span>
                      <span className="font-cinzel text-[11px] sm:text-[12px] text-[#784e1b] font-bold tracking-[0.16em] uppercase">
                        Evening Dinner
                      </span>
                    </div>
                    <p className="font-cormorant italic font-semibold text-[15px] sm:text-[17px] text-[#392211] leading-snug mt-1">
                      For the evening dinner, you can wear any outfit of your choice.
                    </p>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-[#d5bb82]/50">
                    <span className="font-cormorant text-[13px] sm:text-[14px] text-[#6e5033] font-medium">
                      Followed by Royal Feast &amp; Celebrations
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Delicate Ornamental Footer (No Links/Buttons) */}
            <div className="w-full flex flex-col items-center pt-1">
              <p className="font-cormorant italic text-[14px] sm:text-[16px] text-[#785427] font-semibold tracking-wide">
                Insha’Allah, we look forward to welcoming you with warmth and joy
              </p>
              <div className="flex items-center gap-2 mt-1 opacity-75">
                <span className="w-8 h-[1px] bg-[#bfa15f]" />
                <span className="text-[#9c6f21] text-[10px]">✦</span>
                <span className="w-8 h-[1px] bg-[#bfa15f]" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARD 2: ENDING PAGE / WITH LOVE & GRATITUDE              */}
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
              <span className="font-cinzel text-[14px] sm:text-[15px] font-bold tracking-[0.2em] text-[#63431d] uppercase">
                WITH LOVE &amp; GRATITUDE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c08e28]" />
            </div>

            {/* Arabic Dua */}
            <div
              dir="rtl"
              className="font-arabic text-[24px] sm:text-[28px] text-[#946922] leading-relaxed my-1 drop-shadow-xs"
            >
              بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </div>

            {/* Translation */}
            <p className="font-cormorant italic text-[15px] sm:text-[16px] text-[#8c672e] tracking-wider font-semibold max-w-xs mb-1">
              “May Allah bless you, shower His blessings upon you, and unite you both in goodness.”
            </p>

            {/* Royal Divider Line */}
            <div className="flex items-center gap-2 my-1.5 w-3/4">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#bfa15f] to-[#bfa15f]" />
              <span className="text-[#a67c29] text-[13px]">✤ ⚜ ✤</span>
              <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#bfa15f] to-[#bfa15f]" />
            </div>

            {/* Main Title */}
            <h2 className="font-cinzel text-[24px] sm:text-[28px] font-bold tracking-[0.14em] text-[#2c170a] uppercase my-0.5">
              THANK YOU
            </h2>

            {/* Script Subtitle */}
            <div className="font-script text-[28px] sm:text-[34px] text-[#9c6f21] mb-1 leading-tight">
              We Eagerly Look Forward To Celebrating With You
            </div>

            {/* Couple Names */}
            <div className="my-2 p-2.5 rounded-2xl bg-[#f4ebda]/85 border border-[#dfca9f]/60 w-full">
              <p className="font-cinzel text-[20px] sm:text-[22px] font-bold tracking-[0.18em] text-[#3d230f]">
                HASEEB &amp; ADEEBA
              </p>
              <p className="font-cormorant italic text-[16px] sm:text-[18px] text-[#775225] font-semibold mt-0.5">
                Along with the entire family
              </p>
            </div>

            {/* Warm closing note */}
            <p className="font-cormorant text-[16px] sm:text-[18px] text-[#614529] max-w-xs leading-relaxed my-1 italic font-medium">
              Your prayers, presence, and blessings mean the world to us as we begin this sacred chapter together.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
