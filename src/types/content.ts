export type WeddingEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  lat?: number;
  lng?: number;
  dressCode?: string;
  outfitImageUrl?: string;
};

export type GalleryPhoto = {
  id: string;
  url: string;
  caption?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type WeddingContent = {
  subdomainSlug: string;
  coupleNames: { partnerA: string; partnerB: string };
  weddingDate: string;
  heroPhotoUrl: string;
  themeConfig: {
    palette: "royal-gold" | "blush-rose" | "emerald-ivory" | "terracotta";
    fontPairing: string;
    backgroundImageUrl?: string;
    sectionBackgrounds?: Record<string, string>;
    sectionOrder?: string[];
    introVideoUrl?: string;
    openingVideoUrl?: string;
    variants?: { id: string; name: string; slugSuffix: string; visibleEventIds: string[] }[];
  };
  story: { title: string; body: string; photoUrl?: string };
  events: WeddingEvent[];
  gallery: GalleryPhoto[];
  faq: FaqItem[];
  contact: { name: string; phone: string }[];
  musicUrl?: string;
  revealOverlay?: { text: string; imageUrl?: string };
  heroCustomFields?: { id: string; type: 'text' | 'textarea'; label: string; value: string; fontSize: number }[];
  heroImageOverlay?: { imageUrl: string; width: number; height: number };
  heroLayout?: string[];
};
