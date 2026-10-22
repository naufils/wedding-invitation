"use client";

import { motion } from "framer-motion";
import { WeddingEvent } from "@/types/content";

export function VenueCard({ events }: { events: WeddingEvent[] }) {
  const uniqueVenues = Array.from(
    new Map(events.map((e) => [e.venueAddress, e])).values(),
  );

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h2 className="mb-8 text-center font-serif text-3xl">Venue</h2>
      <div className="space-y-4">
        {uniqueVenues.map((event, i) => {
          const mapsQuery = encodeURIComponent(event.venueAddress);
          return (
            <motion.div
              key={event.venueAddress}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="rounded-lg border border-neutral-200 p-5"
            >
              <h3 className="font-serif text-lg">{event.venueName}</h3>
              <p className="text-sm text-neutral-600">{event.venueAddress}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium underline"
                style={{ color: 'var(--theme-color)' }}
              >
                Get Directions
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
