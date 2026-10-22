"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingEvent } from "@/types/content";

export function RsvpForm({
  weddingSlug,
  events,
  rsvpPhone,
  rsvpGoogleSheetUrl,
  hideRsvpForm,
}: {
  weddingSlug: string;
  events: WeddingEvent[];
  rsvpPhone?: string;
  rsvpGoogleSheetUrl?: string;
  hideRsvpForm?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [attending, setAttending] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(1);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      weddingSlug,
      guestName: formData.get("guestName"),
      phoneOrEmail: formData.get("phoneOrEmail"),
      attendingStatus: attending,
      eventIds: selectedEvents,
      guestCount,
      dietaryNotes: formData.get("dietaryNotes"),
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const hasContactInfo = rsvpPhone || rsvpGoogleSheetUrl;

  if (status === "done") {
    return (
      <section className="mx-auto max-w-md px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ backgroundColor: "var(--theme-color, #b8860b)", opacity: 0.15 }}>
            <span style={{ opacity: 1 }}>✓</span>
          </div>
          <p className="font-serif text-3xl" style={{ color: "var(--theme-color, #b8860b)" }}>Thank you!</p>
          <p className="text-sm opacity-70">Your RSVP has been received. We can't wait to celebrate with you.</p>
        </motion.div>
      </section>
    );
  }

  const toggleEvent = (name: string) => {
    setSelectedEvents(prev =>
      prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name]
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-md px-5 py-16"
    >
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.25em] uppercase opacity-60 mb-2">Kindly Reply</p>
        <h2 className="font-serif text-4xl mb-1" style={{ color: "var(--theme-color, #b8860b)" }}>RSVP</h2>
        <div className="mx-auto mt-3 h-px w-16" style={{ backgroundColor: "var(--theme-color, #b8860b)", opacity: 0.4 }} />
      </div>

      {/* Contact RSVP card */}
      {hasContactInfo && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-2xl p-5 border"
          style={{
            background: "rgba(var(--theme-rgb, 184,134,11), 0.07)",
            borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.2)",
          }}
        >
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3">Contact to RSVP</p>
          <div className="flex flex-col gap-3">
            {rsvpPhone && (
              <a
                href={`tel:${rsvpPhone}`}
                className="flex items-center gap-3 group"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: "rgba(var(--theme-rgb, 184,134,11), 0.15)" }}
                >
                  📞
                </span>
                <div>
                  <p className="text-xs opacity-50 mb-0.5">Call or WhatsApp</p>
                  <p className="font-medium text-sm group-hover:underline" style={{ color: "var(--theme-color, #b8860b)" }}>{rsvpPhone}</p>
                </div>
              </a>
            )}
            {rsvpGoogleSheetUrl && (
              <a
                href={rsvpGoogleSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: "rgba(var(--theme-rgb, 184,134,11), 0.15)" }}
                >
                  📋
                </span>
                <div>
                  <p className="text-xs opacity-50 mb-0.5">Fill the RSVP Sheet</p>
                  <p className="font-medium text-sm group-hover:underline" style={{ color: "var(--theme-color, #b8860b)" }}>Click to open Google Sheet →</p>
                </div>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Online form */}
      {!hideRsvpForm && (
        <>
          {hasContactInfo && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(var(--theme-rgb, 184,134,11), 0.2)" }} />
              <span className="text-xs tracking-wider uppercase opacity-40">or fill online</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(var(--theme-rgb, 184,134,11), 0.2)" }} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="relative">
              <input
                name="guestName"
                placeholder="Your full name"
                required
                className="w-full rounded-xl border bg-white/10 dark:bg-black/20 backdrop-blur-sm px-4 pt-5 pb-3 text-sm outline-none transition-all placeholder:text-transparent peer focus:ring-1"
                style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.3)" }}
                id="rsvp-name"
              />
              <label
                htmlFor="rsvp-name"
                className="absolute left-4 top-1.5 text-[10px] tracking-widest uppercase opacity-50 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:opacity-40 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:uppercase"
              >
                Full Name
              </label>
            </div>

            {/* Phone or email */}
            <div className="relative">
              <input
                name="phoneOrEmail"
                placeholder="Phone or email"
                required
                id="rsvp-contact"
                className="w-full rounded-xl border bg-white/10 dark:bg-black/20 backdrop-blur-sm px-4 pt-5 pb-3 text-sm outline-none transition-all placeholder:text-transparent peer focus:ring-1"
                style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.3)" }}
              />
              <label
                htmlFor="rsvp-contact"
                className="absolute left-4 top-1.5 text-[10px] tracking-widest uppercase opacity-50 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:opacity-40 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:uppercase"
              >
                Phone or Email
              </label>
            </div>

            {/* Attending status */}
            <div>
              <p className="text-[10px] tracking-widest uppercase opacity-50 mb-2.5">Will you attend?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "yes", label: "Joyfully Accept", emoji: "🎉" },
                  { value: "no", label: "Regretfully Decline", emoji: "🙏" },
                  { value: "maybe", label: "Tentatively", emoji: "🤔" },
                ].map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAttending(value)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-center transition-all text-xs font-medium"
                    style={{
                      borderColor: attending === value ? "var(--theme-color, #b8860b)" : "rgba(var(--theme-rgb, 184,134,11), 0.2)",
                      background: attending === value ? "rgba(var(--theme-rgb, 184,134,11), 0.12)" : "rgba(255,255,255,0.05)",
                      color: attending === value ? "var(--theme-color, #b8860b)" : undefined,
                    }}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="leading-tight opacity-80">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Events */}
            {events.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase opacity-50 mb-2.5">Which ceremonies?</p>
                <div className="flex flex-col gap-2">
                  {events.map((event) => {
                    const selected = selectedEvents.includes(event.name);
                    return (
                      <button
                        key={event.name}
                        type="button"
                        onClick={() => toggleEvent(event.name)}
                        className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all"
                        style={{
                          borderColor: selected ? "var(--theme-color, #b8860b)" : "rgba(var(--theme-rgb, 184,134,11), 0.2)",
                          background: selected ? "rgba(var(--theme-rgb, 184,134,11), 0.1)" : "rgba(255,255,255,0.04)",
                        }}
                      >
                        <span className="font-medium">{event.name}</span>
                        <span
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{
                            borderColor: selected ? "var(--theme-color, #b8860b)" : "rgba(var(--theme-rgb, 184,134,11), 0.3)",
                            background: selected ? "var(--theme-color, #b8860b)" : "transparent",
                          }}
                        >
                          {selected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Guest count */}
            <div>
              <p className="text-[10px] tracking-widest uppercase opacity-50 mb-2.5">Number of Guests</p>
              <div className="flex items-center gap-4 rounded-xl border px-4 py-3"
                style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.3)", background: "rgba(255,255,255,0.05)" }}>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-light transition-all hover:opacity-70"
                  style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.4)" }}
                >
                  −
                </button>
                <span className="flex-1 text-center font-serif text-2xl">{guestCount}</span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-light transition-all hover:opacity-70"
                  style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.4)" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Dietary notes */}
            <div className="relative">
              <textarea
                name="dietaryNotes"
                placeholder="Dietary notes"
                rows={3}
                id="rsvp-dietary"
                className="w-full rounded-xl border bg-white/10 dark:bg-black/20 backdrop-blur-sm px-4 pt-5 pb-3 text-sm outline-none resize-none transition-all placeholder:text-transparent peer focus:ring-1"
                style={{ borderColor: "rgba(var(--theme-rgb, 184,134,11), 0.3)" }}
              />
              <label
                htmlFor="rsvp-dietary"
                className="absolute left-4 top-1.5 text-[10px] tracking-widest uppercase opacity-50 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-placeholder-shown:opacity-40 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:uppercase"
              >
                Dietary Notes (optional)
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || !attending}
              className="relative overflow-hidden rounded-xl py-4 text-sm font-medium tracking-wider uppercase text-white disabled:opacity-50 transition-all active:scale-[0.98] hover:opacity-90"
              style={{ background: "var(--theme-color, #b8860b)" }}
            >
              <AnimatePresence mode="wait">
                {status === "submitting" ? (
                  <motion.span key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending…
                  </motion.span>
                ) : (
                  <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Send RSVP ✦
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {status === "error" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-red-500">
                Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </>
      )}

      {/* If form is hidden but no contact info exists, show placeholder */}
      {hideRsvpForm && !hasContactInfo && (
        <p className="text-center opacity-40 text-sm italic">RSVP details will be shared separately.</p>
      )}
    </motion.section>
  );
}
