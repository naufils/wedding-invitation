import { WeddingContent } from "@/types/content";

export const DUMMY_WEDDINGS: Record<string, WeddingContent> = {
  riyaandaarav: {
    subdomainSlug: "riyaandaarav",
    coupleNames: { partnerA: "Riya", partnerB: "Aarav" },
    weddingDate: "2026-12-12T00:00:00.000Z",
    heroPhotoUrl: "/dummy/hero.jpg",
    themeConfig: { palette: "royal-gold", fontPairing: "playfair-inter" },
    story: {
      title: "Our Story",
      body: "We met on a rainy Mumbai monsoon, and six years later, here we are.",
      photoUrl: "/dummy/story.jpg",
    },
    events: [
      {
        id: "haldi",
        name: "Haldi",
        date: "2026-12-10",
        time: "10:00",
        venueName: "Riya's Residence",
        venueAddress: "Bandra West, Mumbai",
        dressCode: "Yellow",
      },
      {
        id: "sangeet",
        name: "Sangeet",
        date: "2026-12-11",
        time: "19:00",
        venueName: "Taj Lands End",
        venueAddress: "Bandra West, Mumbai",
        dressCode: "Festive",
      },
      {
        id: "wedding",
        name: "Wedding Ceremony",
        date: "2026-12-12",
        time: "11:00",
        venueName: "The Grand Hall",
        venueAddress: "Juhu, Mumbai",
        dressCode: "Traditional",
      },
      {
        id: "reception",
        name: "Reception",
        date: "2026-12-12",
        time: "19:30",
        venueName: "The Grand Hall",
        venueAddress: "Juhu, Mumbai",
        dressCode: "Formal",
      },
    ],
    gallery: [
      { id: "g1", url: "/dummy/gallery-1.jpg", caption: "Engagement day" },
      { id: "g2", url: "/dummy/gallery-2.jpg" },
    ],
    faq: [
      {
        question: "Is there parking at the venue?",
        answer: "Yes, valet parking is available at all venues.",
      },
    ],
    contact: [{ name: "Riya", phone: "+91 90000 00000" }],
    musicUrl: "/bg-music.mp3",
    revealOverlay: { text: "You are Invited" },
  },
};

export function getWeddingBySlug(slug: string): WeddingContent | null {
  return DUMMY_WEDDINGS[slug] ?? null;
}
