"use client";

import { motion } from "framer-motion";

export function HeroReveal({
  partnerA,
  partnerB,
  weddingDate,
}: {
  partnerA: string;
  partnerB: string;
  weddingDate: string;
}) {
  const formattedDate = new Date(weddingDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-4 bg-[#faf6ee] text-center text-[#3a2c1a]">
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-serif text-4xl sm:text-6xl"
      >
        {partnerA} &amp; {partnerB}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-lg tracking-wide"
      >
        {formattedDate}
      </motion.p>
    </section>
  );
}
