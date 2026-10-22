import { notFound } from "next/navigation";
import { getWeddingBySlug } from "@/lib/dummy-content";
import { getWeddingBySlugFromDb } from "@/lib/get-wedding";
import { PhotoEnvelopeHero } from "@/components/envelope/PhotoEnvelopeHero";
import { StorySection } from "@/components/sections/StorySection";
import { EventTimeline } from "@/components/sections/EventTimeline";
import { VenueCard } from "@/components/sections/VenueCard";
import { Countdown } from "@/components/sections/Countdown";
import { RsvpForm } from "@/components/sections/RsvpForm";
import { Gallery } from "@/components/sections/Gallery";
import { GuestUploadWidget } from "@/components/sections/GuestUploadWidget";
import { FaqFooter } from "@/components/sections/FaqFooter";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { PALETTES } from "@/types/wizard";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const subdomainSlug = slug[0];
  const wedding = getWeddingBySlug(subdomainSlug) ?? (await getWeddingBySlugFromDb(subdomainSlug));
  
  if (!wedding) {
    return { title: "Wedding Not Found" };
  }

  const partnerA = wedding.coupleNames?.partnerA || "Our";
  const partnerB = wedding.coupleNames?.partnerB || "Wedding";
  const title = `${partnerA} & ${partnerB}`;
  const description = `Join us in celebrating the wedding of ${partnerA} and ${partnerB}.`;
  
  // Choose the best image for the social preview (WhatsApp, Facebook, Twitter)
  const imageUrl = (wedding.themeConfig as any)?.ogImageUrl || wedding.heroPhotoUrl || wedding.themeConfig?.backgroundImageUrl || "/default-wedding-og.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${partnerA} and ${partnerB} Wedding Invitation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function WeddingSitePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const subdomainSlug = slug[0];
  const variantSlug = slug[1];

  const wedding = getWeddingBySlug(subdomainSlug) ?? (await getWeddingBySlugFromDb(subdomainSlug));

  if (!wedding) notFound();

  const theme = wedding.themeConfig as any;
  
  let filteredEvents = wedding.events;
  if (variantSlug && theme.variants) {
    const variant = theme.variants.find((v: any) => v.slugSuffix === variantSlug);
    if (variant) {
      filteredEvents = wedding.events.filter((e) => variant.visibleEventIds.includes(e.id));
    } else {
      notFound();
    }
  }

  let sectionOrder = theme?.sectionOrder?.length ? theme.sectionOrder : [
    "hero", "story", "events", "closing"
  ];

  // Force 'hero' to always be at the very top and remove 'rsvp', 'venue', and 'guestUpload'.
  sectionOrder = ["hero", ...sectionOrder.filter((id: string) => id !== "hero" && id !== "venue" && id !== "rsvp" && id !== "guestUpload")];

  // Ensure story (Invitation) is placed before events
  if (sectionOrder.includes("story") && sectionOrder.includes("events")) {
    const others = sectionOrder.filter((id: string) => id !== "hero" && id !== "story" && id !== "events");
    sectionOrder = ["hero", "story", "events", ...others];
  }

  // Ensure closing (Ending page) is included after events
  if (!sectionOrder.includes("closing")) {
    sectionOrder = [...sectionOrder, "closing"];
  }

  // Force 'events' to be before 'story' if they both exist and haven't been manually swapped by user intent,
  // but actually let's just make sure hero is at the top.
  const bgImage = theme?.backgroundImageUrl;

  const renderSection = (id: string, nextName?: string) => {
    switch (id) {
      case "hero":
        return (
          <PhotoEnvelopeHero
            key="hero"
            partnerA={wedding.coupleNames.partnerA}
            partnerB={wedding.coupleNames.partnerB}
            weddingDate={wedding.weddingDate}
            musicUrl={(wedding as any).musicUrl}
            monogram={`${wedding.coupleNames.partnerA?.[0] || ""}${wedding.coupleNames.partnerB?.[0] || ""}`}
            revealOverlayText={wedding.revealOverlay?.text}
            heroCustomFields={wedding.heroCustomFields}
            heroImageOverlay={wedding.heroImageOverlay}
            heroLayout={theme?.heroLayout}
            introVideoUrl={theme?.introVideoUrl}
            openingVideoUrl={theme?.openingVideoUrl}
            nextSectionName={nextName}
          />
        );
      case "story":
        return <StorySection key="story" title={wedding.story?.title || ""} body={wedding.story?.body || ""} blocks={(wedding.story as any)?.blocks} />;
      case "countdown":
        return <Countdown key="countdown" weddingDate={wedding.weddingDate} partnerA={wedding.coupleNames.partnerA} partnerB={wedding.coupleNames.partnerB} />;
      case "rsvp":
        return <RsvpForm key="rsvp" weddingSlug={wedding.subdomainSlug} events={filteredEvents} />;
      case "gallery":
        return <Gallery key="gallery" photos={wedding.gallery || []} />;
      case "guestUpload":
        return <GuestUploadWidget key="guestUpload" weddingSlug={wedding.subdomainSlug} />;
      case "faq":
        return <FaqFooter key="faq" contact={wedding.contact || []} />;
      case "closing":
        return (
          <ClosingSection
            key="closing"
            partnerA={wedding.coupleNames.partnerA}
            partnerB={wedding.coupleNames.partnerB}
            message={(wedding as any).closingMessage}
          />
        );
      default:
        return null;
    }
  };

  const renderSectionWithBackground = (id: string, nextName?: string) => {
    const sectionBg = theme?.sectionBackgrounds?.[id];
    
    return (
      <div key={id} className="relative z-0 w-full min-h-[100dvh] snap-start snap-always flex items-center justify-center">
        {sectionBg && (
          <div 
            className="absolute inset-0 -z-10" 
            style={{ clipPath: "inset(0)" }}
          >
            <div 
              className="sticky top-0 w-full h-[100dvh]"
              style={{ 
                backgroundImage: `url("${sectionBg}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/70" />
            </div>
          </div>
        )}
        <div className={(sectionBg || bgImage) ? "relative z-10 text-white w-full" : "relative z-10 w-full"}>
          {renderSection(id, nextName)}
        </div>
        
        {id !== "hero" && nextName && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">Scroll Down</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        )}
      </div>
    );
  };

  const renderEventSection = (evt: any, i: number, nextName?: string) => {
    const sectionBg = theme?.sectionBackgrounds?.[`event-${evt.id || i}`];
    
    let mapLink = "";
    if (evt.venueAddress) {
      if (evt.venueAddress.startsWith("http://") || evt.venueAddress.startsWith("https://")) {
        mapLink = evt.venueAddress;
      } else {
        mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.venueAddress)}`;
      }
    }

    return (
      <div key={evt.id} className="relative z-0 w-full min-h-[100dvh] snap-start snap-always flex flex-col items-center justify-center p-6 text-center">
        {sectionBg && (
          <div className="absolute inset-0 -z-10" style={{ clipPath: "inset(0)" }}>
            <div className="sticky top-0 w-full h-[100dvh]" style={{ backgroundImage: `url("${sectionBg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/70" />
            </div>
          </div>
        )}
        <div className={`relative z-10 w-full max-w-md space-y-6 ${(sectionBg || bgImage) ? "text-white" : "text-black"}`}>
          <h2 className="font-serif text-4xl">{evt.name}</h2>
          <div className="space-y-1 text-lg">
            <p suppressHydrationWarning>{new Date(evt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
            <p>{evt.time}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">{evt.venueName}</p>
            <p className="text-sm opacity-80 break-words">{evt.venueAddress}</p>
          </div>
          {evt.dressCode && (
            <div className="pt-4 border-t border-current/20">
              <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Dress Code</p>
              <p className="font-medium">{evt.dressCode}</p>
            </div>
          )}
          {evt.outfitImageUrl && (
            <img src={evt.outfitImageUrl} alt="Outfit Inspiration" className="w-full max-h-48 object-contain rounded-xl shadow-lg mt-4" />
          )}
          {mapLink && (
            <a 
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full bg-current text-[#faf6ee] font-medium transition-transform hover:scale-105 active:scale-95 shadow-md mt-6"
              style={{ color: sectionBg ? 'black' : paletteColor, backgroundColor: sectionBg ? 'white' : 'currentColor' }}
            >
              <span style={{ color: sectionBg ? 'black' : '#fff' }}>Get Directions</span>
            </a>
          )}
        </div>

        {nextName && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 animate-bounce z-20">
            <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-medium">Scroll Down</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        )}
      </div>
    );
  };

  const renderAllSections = () => {
    // 1. Flatten the list so we can peek at the next item
    const displayNames: Record<string, string> = {
      story: "Invitation",
      countdown: "Countdown",
      gallery: "Gallery",
      guestUpload: "Collect Photos",
      faq: "Contact",
      hero: "Welcome",
      closing: "With Love",
    };

    const sectionsToRender = sectionOrder.flatMap((id: string) => {
      if (id === "events") {
        return filteredEvents.map((evt, index) => ({
          type: "event",
          id: `event-${evt.id || index}`,
          evt,
          index,
          displayName: evt.name,
        }));
      }
      
      // Skip empty or removed ones
      if (id === "rsvp" || id === "guestUpload") return [];
      if (id === "gallery" && (!wedding.gallery || wedding.gallery.length === 0)) return [];
      if (id === "faq" && (!wedding.contact || wedding.contact.length === 0)) return [];

      return [{
        type: "standard",
        id,
        displayName: displayNames[id] || id,
      }];
    });

    // 2. Render each section passing the next section's name
    return sectionsToRender.map((section: any, idx: number) => {
      const nextSection = sectionsToRender[idx + 1];
      const nextName = nextSection?.displayName;

      if (section.type === "event") {
        return renderEventSection(section.evt, section.index, nextName);
      }
      return renderSectionWithBackground(section.id, nextName);
    });
  };

  const paletteColor = PALETTES.find(p => p.id === theme?.palette)?.swatch || "#b8860b";

  return (
    <main className="min-h-screen bg-[#faf6ee] flex justify-center">
      <div 
        className="w-full max-w-[430px] min-h-screen relative shadow-2xl bg-white overflow-hidden"
        style={{
          '--theme-color': paletteColor,
        } as React.CSSProperties}
      >
        {bgImage && (
          <div 
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url("${bgImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}
        <div className="h-[100dvh] overflow-y-auto snap-y snap-mandatory relative z-10 scroll-smooth">
          {renderAllSections()}
        </div>
      </div>
    </main>
  );
}
