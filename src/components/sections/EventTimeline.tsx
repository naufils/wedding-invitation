"use client";

import { motion } from "framer-motion";
import { WeddingEvent } from "@/types/content";

export function EventTimeline({ events }: { events: WeddingEvent[] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h2 className="mb-8 text-center font-serif text-3xl">Event Timeline</h2>
      <ol className="space-y-6 border-l border-neutral-300 pl-6">
        {events.map((event, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="relative"
          >
            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--theme-color)' }} />
            <h3 className="font-serif text-xl" style={{ color: 'var(--theme-color)' }}>{event.name}</h3>
            <p className="text-sm text-neutral-600">
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}{" "}
              · {event.time}
            </p>
            <p className="text-sm text-neutral-600">
              {event.venueName}, {event.venueAddress}
            </p>
            {event.dressCode && (
              <p className="text-sm italic text-neutral-500">Dress code: {event.dressCode}</p>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
