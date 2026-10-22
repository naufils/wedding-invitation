import { prisma } from "@/lib/prisma";
import { WeddingContent } from "@/types/content";

export async function getWeddingBySlugFromDb(slug: string): Promise<WeddingContent | null> {
  const wedding = await prisma.wedding.findUnique({
    where: { subdomainSlug: slug },
    include: { events: { orderBy: { orderIndex: "asc" } }, galleryPhotos: { orderBy: { orderIndex: "asc" } } },
  });

  if (!wedding) return null;

  const coupleNames = wedding.coupleNames as { partnerA: string; partnerB: string };
  const theme = wedding.themeConfig as {
    palette?: string;
    fontPairing?: string;
    story?: { title: string; body: string };
    musicUrl?: string;
    revealOverlay?: { text: string; imageUrl?: string };
    heroCustomFields?: { id: string; type: 'text' | 'textarea'; label: string; value: string; fontSize: number }[];
    heroImageOverlay?: { imageUrl: string; width: number; height: number };
    heroLayout?: string[];
    introVideoUrl?: string;
    openingVideoUrl?: string;
    variants?: { id: string; name: string; slugSuffix: string; visibleEventIds: string[] }[];
  };

  return {
    subdomainSlug: wedding.subdomainSlug,
    coupleNames,
    weddingDate: wedding.weddingDate.toISOString(),
    heroPhotoUrl: "",
    themeConfig: {
      palette: (theme.palette as WeddingContent["themeConfig"]["palette"]) ?? "royal-gold",
      fontPairing: theme.fontPairing ?? "playfair-inter",
      backgroundImageUrl: (theme as any).backgroundImageUrl,
      sectionBackgrounds: (theme as any).sectionBackgrounds,
      sectionOrder: (theme as any).sectionOrder,
      introVideoUrl: theme.introVideoUrl,
      openingVideoUrl: theme.openingVideoUrl,
      variants: theme.variants,
    },
    story: theme.story ?? { title: "Our Story", body: "" },
    events: wedding.events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date.toISOString(),
      time: event.time,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      lat: event.lat ?? undefined,
      lng: event.lng ?? undefined,
      dressCode: event.dressCode ?? undefined,
      outfitImageUrl: event.outfitImageUrl ?? undefined,
    })),
    gallery: wedding.galleryPhotos.map((photo) => ({
      id: photo.id,
      url: photo.storageKey,
      caption: photo.caption ?? undefined,
    })),
    faq: [],
    contact: [],
    musicUrl: theme.musicUrl,
    revealOverlay: theme.revealOverlay,
    heroCustomFields: theme.heroCustomFields,
    heroImageOverlay: theme.heroImageOverlay,
    heroLayout: theme.heroLayout,
  };
}
