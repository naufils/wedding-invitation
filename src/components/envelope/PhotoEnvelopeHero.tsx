"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomHeroField, HeroImageOverlay } from "@/types/wizard";

const EASE_OUT_EXPO = [0.23, 1, 0.32, 1] as const;

type Stage = "idle" | "playing" | "opened";

export function PhotoEnvelopeHero({
  partnerA,
  partnerB,
  weddingDate,
  musicUrl,
  revealOverlayText,
  heroCustomFields,
  heroImageOverlay,
  heroLayout,
  isPreview,
  introVideoUrl,
  openingVideoUrl,
  nextSectionName,
  forceOpen,
}: {
  partnerA: string;
  partnerB: string;
  weddingDate: string;
  musicUrl?: string;
  monogram: string;
  revealOverlayText?: string;
  heroCustomFields?: CustomHeroField[];
  heroImageOverlay?: HeroImageOverlay;
  heroLayout?: string[];
  isPreview?: boolean;
  introVideoUrl?: string;
  openingVideoUrl?: string;
  nextSectionName?: string;
  forceOpen?: boolean;
}) {
  const [stage, setStage] = useState<Stage>(forceOpen ? "opened" : "idle");
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formattedDate = new Date(weddingDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handleOpen() {
    if (stage !== "idle" || !videoRef.current) return;
    setStage("playing");
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().catch(() => {});
    }
    videoRef.current.muted = true;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  }

  function toggleMute() {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next) {
          audioRef.current.play().catch(() => {});
        }
      }
      if (videoRef.current) videoRef.current.muted = true;
      return next;
    });
  }

  useEffect(() => {
    if (forceOpen) {
      setStage("opened");
    } else {
      setStage("idle");
    }
  }, [forceOpen]);

  // Prevent scrolling past the envelope until it's opened
  useEffect(() => {
    if (isPreview) return;

    const previewContainer = document.getElementById("preview-scroll-container");
    const container = previewContainer || document.body;
    
    if (stage !== "opened") {
      container.style.overflow = "hidden";
    } else {
      container.style.overflow = "auto";
    }

    return () => {
      container.style.overflow = "auto";
    };
  }, [stage]);

  return (
    <div 
      className="relative w-full overflow-hidden bg-transparent"
      style={{ minHeight: 'var(--hero-height, 100dvh)' }}
    >
      <audio
        ref={audioRef}
        src={musicUrl || "/bg-music.mp3"}
        loop
        preload="auto"
      />
      <AnimatePresence mode="wait">
        {stage !== "opened" ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
            className="relative flex flex-col items-start justify-start w-full"
            style={{ minHeight: 'var(--hero-height, 100dvh)' }}
          >
            <button
              type="button"
              onClick={handleOpen}
              disabled={stage === "playing"}
              className="relative block w-full"
              aria-label="Open invitation"
              style={{ minHeight: 'var(--hero-height, 100dvh)' }}
            >
              <video
                ref={videoRef}
                src={introVideoUrl || "/envelope/intro.mp4"}
                poster="/envelope/intro-poster.jpg"
                playsInline
                preload="auto"
                muted
                onEnded={() => setStage("opened")}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>

            {stage === "idle" && (
              <MuteButton isMuted={isMuted} onToggle={toggleMute} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="relative w-full overflow-hidden"
            style={{ minHeight: 'var(--hero-height, 100dvh)' }}
          >
            <video
              src={openingVideoUrl || "/envelope/reveal.mp4"}
              poster="/envelope/reveal-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* 70% black overlay for consistent royal dark cinematic ambiance */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Soft radial golden palace ambiance */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(184, 134, 11, 0.08) 0%, rgba(0, 0, 0, 0.45) 100%)",
              }}
            />

            {/* Delicate royal ornate frame border */}
            <div className="pointer-events-none absolute inset-4 sm:inset-7 border border-[#d4af37]/35 rounded-2xl z-10">
              <div className="absolute inset-[3px] border border-[#d4af37]/15 rounded-[13px]" />
              {/* Corner Accents */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br" />
            </div>

            <MuteButton isMuted={isMuted} onToggle={toggleMute} />

            {/* Main Royal Islamic Invitation Card Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 sm:px-12 text-center overflow-y-auto py-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                className="w-full max-w-lg flex flex-col items-center my-auto"
              >
                {/* Optional logo/image if uploaded */}
                {heroImageOverlay?.imageUrl && (
                  <img
                    src={heroImageOverlay.imageUrl}
                    alt=""
                    style={{ width: heroImageOverlay.width }}
                    className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-3"
                  />
                )}

                {/* Arabic Bismillah Calligraphy */}
                <p 
                  dir="rtl"
                  className="font-arabic text-3xl sm:text-4xl text-[#eddcb2] tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] mb-1"
                >
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>

                {/* English Translation */}
                <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.28em] text-[#d4af37] font-medium uppercase leading-relaxed max-w-xs sm:max-w-md">
                  In the name of Allah,
                  <br />
                  the Most Gracious, the Most Merciful
                </p>

                {/* Gold Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 w-36 sm:w-48 my-3 opacity-80">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]" />
                  <svg className="w-3.5 h-3.5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]" />
                </div>

                {/* Invitation Preamble */}
                <p className="font-cinzel text-[10.5px] sm:text-[12px] tracking-[0.24em] text-white/90 uppercase leading-relaxed max-w-xs sm:max-w-md font-normal">
                  Together with their families
                  <br />
                  it is our pleasure to invite you to
                  <br />
                  the wedding celebration of
                </p>

                {/* Couple Names in Exquisite Royal Calligraphy Script */}
                <div className="my-3 sm:my-4 flex flex-col items-center">
                  <h1 className="font-script text-6xl sm:text-8xl text-[#fdfbf7] drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] tracking-wide leading-[1.05]">
                    {partnerA || "Adiba"}
                  </h1>
                  <div className="flex items-center justify-center gap-3 my-1.5 opacity-90">
                    <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                    <span className="font-cormorant italic text-lg sm:text-xl text-[#eddcb2]">and</span>
                    <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
                  </div>
                  <h1 className="font-script text-6xl sm:text-8xl text-[#fdfbf7] drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] tracking-wide leading-[1.05]">
                    {partnerB || "Haseeb"}
                  </h1>
                </div>

                {/* Gold Ornamental Divider */}
                <div className="flex items-center justify-center gap-2.5 w-36 sm:w-48 my-3 opacity-80">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]" />
                  <svg className="w-3.5 h-3.5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4af37] to-[#d4af37]" />
                </div>

                {/* Quranic Verse in Arabic */}
                <p 
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl text-[#eddcb2] tracking-wider leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] mt-1"
                >
                  وَخَلَقْنَاكُمْ أَزْوَاجًا
                </p>

                {/* English Translation & Quran Reference */}
                <p className="font-cormorant italic text-sm sm:text-base text-white/95 tracking-wide mt-1">
                  “And We created you in pairs.”
                </p>
                <p className="font-cinzel text-[10px] sm:text-xs text-[#d4af37] tracking-[0.25em] uppercase mt-0.5 font-medium">
                  Quran 78:8
                </p>
              </motion.div>
            </div>

            {nextSectionName && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 animate-bounce cursor-pointer z-30">
                <span className="text-[10px] uppercase tracking-[0.25em] mb-1 font-medium font-cinzel text-[#d4af37]">Scroll Down</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d4af37]"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MuteButton({ isMuted, onToggle }: { isMuted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isMuted ? "Unmute" : "Mute"}
      className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#8b2e2e] shadow-md"
    >
      {isMuted ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="m17 9 6 6M23 9l-6 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
        </svg>
      )}
    </button>
  );
}
