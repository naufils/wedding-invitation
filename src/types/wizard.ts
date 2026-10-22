export type WizardEvent = {
  id?: string;
  name: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  outfitImageUrl?: string;
};

export type RevealOverlay = {
  text: string;
  imageUrl: string;
};

export type CustomHeroField = {
  id: string;
  type: 'text' | 'textarea';
  value: string;
  fontSize: number;
};

export type HeroImageOverlay = {
  imageUrl: string;
  width: number;
};

export type WeddingVariant = {
  id: string;
  name: string;
  slugSuffix: string;
  visibleEventIds: string[];
};

export type InvitationBlock = {
  id: string;
  type: 'heading' | 'text' | 'image';
  value: string;     // text content or image URL
  fontSize?: number; // only for heading/text
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
};

export type WizardState = {
  partnerA: string;
  partnerB: string;
  weddingDate: string;
  subdomainSlug: string;
  heroLayout: string[];
  heroCustomFields: CustomHeroField[];
  heroImageOverlay?: HeroImageOverlay;
  events: WizardEvent[];
  story: { title: string; body: string; blocks?: InvitationBlock[] };
  themeConfig: { 
    palette: string; 
    fontPairing: string;
    backgroundImageUrl?: string;
    sectionOrder?: string[];
    sectionBackgrounds?: Record<string, string>;
    introVideoUrl?: string;
    openingVideoUrl?: string;
    ogImageUrl?: string;
    variants?: WeddingVariant[];
    rsvpPhone?: string;
    rsvpGoogleSheetUrl?: string;
    hideRsvpForm?: boolean;
  };
  musicUrl: string;
  musicType?: 'youtube' | 'upload' | 'link';
  revealOverlay: RevealOverlay;
};

export const PALETTES: { id: string; label: string; swatch: string }[] = [
  { id: "royal-gold", label: "Royal Gold", swatch: "#b8860b" },
  { id: "blush-rose", label: "Blush Rose", swatch: "#c98a94" },
  { id: "emerald-ivory", label: "Emerald & Ivory", swatch: "#2f6f5e" },
  { id: "terracotta", label: "Terracotta", swatch: "#c1652f" },
];

export const DEFAULT_SECTION_ORDER = [
  "hero",
  "story",
  "events",
  "closing",
];

export const EMPTY_WIZARD_STATE: WizardState = {
  partnerA: "",
  partnerB: "",
  weddingDate: "",
  subdomainSlug: "",
  heroLayout: ["image", "revealText", "names", "date"],
  heroCustomFields: [],
  events: [
    {
      id: "event-1",
      name: "Nikkah",
      date: "2027-08-10",
      time: "10:00",
      venueName: "The Grand Mosque",
      venueAddress: "123 Heritage Road, City Center",
      dressCode: "Traditional Elegant",
    },
    {
      id: "event-2",
      name: "Valima",
      date: "2027-08-11",
      time: "19:00",
      venueName: "Crystal Banquet Hall",
      venueAddress: "456 Skyline Avenue, West District",
      dressCode: "Formal Evening Wear",
    },
    {
      id: "event-3",
      name: "Haldi",
      date: "2027-08-08",
      time: "11:00",
      venueName: "Sunny Side Gardens",
      venueAddress: "789 Blossom Lane, Riverside",
      dressCode: "Yellow/Vibrant Casual",
    },
    {
      id: "event-4",
      name: "Mehendi",
      date: "2027-08-09",
      time: "18:00",
      venueName: "Starry Night Courtyard",
      venueAddress: "101 Crescent Street, Old Town",
      dressCode: "Festive Green/Colorful",
    },
  ],
  story: { title: "Our Story", body: "" },
  themeConfig: { 
    palette: "royal-gold", 
    fontPairing: "playfair-inter",
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionBackgrounds: {},
    introVideoUrl: "/envelope/intro.mp4",
    openingVideoUrl: "/envelope/reveal.mp4",
  },
  musicUrl: "",
  musicType: "link",
  revealOverlay: { text: "You are Invited", imageUrl: "" },
};
