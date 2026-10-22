"use client";

import { motion } from "framer-motion";

function ElegantDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2 opacity-70">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-current to-transparent" />
      <span className="text-xs tracking-widest text-[var(--theme-color,#b8860b)]">✧ ✦ ✧</span>
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-current to-transparent" />
    </div>
  );
}

export function ClosingSection({
  partnerA,
  partnerB,
  message,
}: {
  partnerA: string;
  partnerB: string;
  message?: string;
}) {
  const nameA = partnerA || "Adiba";
  const nameB = partnerB || "Haseeb";

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full rounded-3xl bg-[#fbf7f0]/95 dark:bg-[#161412]/95 backdrop-blur-md p-8 sm:p-10 border border-[#e8dac7]/80 dark:border-neutral-800 shadow-2xl flex flex-col items-center gap-6 text-[#4a3828] dark:text-[#f0e6d6]">
        {/* Pill Tag */}
        <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase bg-[#f3e8d6] dark:bg-neutral-800/80 text-[var(--theme-color,#b8860b)] border border-[#e2d0b8] dark:border-neutral-700">
          • With Love &amp; Gratitude •
        </span>

        <ElegantDivider />

        {/* Main message */}
        <p className="whitespace-pre-line font-fancy text-4xl sm:text-5xl leading-tight text-[var(--theme-color,#b8860b)] drop-shadow-sm">
          {message?.trim() || "We eagerly look forward\nto celebrating with you!"}
        </p>

        {/* Couple names */}
        <div className="space-y-1">
          <p className="font-serif text-2xl sm:text-3xl tracking-wide font-medium text-black dark:text-white">
            {nameA} &amp; {nameB}
          </p>
          <p className="text-xs uppercase tracking-[0.25em] opacity-60">Forever &amp; Always</p>
        </div>

        <ElegantDivider />

        <p className="text-sm opacity-75 italic max-w-xs font-serif leading-relaxed">
          Thank you for showering your blessings, warmth, and love on our special day.
        </p>
      </div>
    </motion.section>
  );
}
