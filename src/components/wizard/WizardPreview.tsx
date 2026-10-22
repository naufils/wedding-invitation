"use client";

import React, { useEffect } from "react";
import { WizardState } from "@/types/wizard";
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

import { DEFAULT_SECTION_ORDER, PALETTES } from "@/types/wizard";

interface WizardPreviewProps {
  state: WizardState;
  updateState?: <K extends keyof WizardState>(key: K, value: WizardState[K]) => void;
  activeStep?: number;
}

export function WizardPreview({ state, updateState, activeStep = 0 }: WizardPreviewProps) {
  const bgImage = state.themeConfig.backgroundImageUrl;
  let sectionOrder = state.themeConfig.sectionOrder && state.themeConfig.sectionOrder.length > 0
    ? state.themeConfig.sectionOrder
    : ["hero", "story", "events", "closing"];

  // Force 'hero' to always be at the very top, and filter out 'venue', 'rsvp', and 'guestUpload'.
  sectionOrder = ["hero", ...sectionOrder.filter((id: string) => id !== "hero" && id !== "venue" && id !== "rsvp" && id !== "guestUpload")];

  // Ensure story is placed before events
  if (sectionOrder.includes("story") && sectionOrder.includes("events")) {
    const others = sectionOrder.filter((id: string) => id !== "hero" && id !== "story" && id !== "events");
    sectionOrder = ["hero", "story", "events", ...others];
  }

  // Ensure closing (Ending page) is included after events
  if (!sectionOrder.includes("closing")) {
    sectionOrder = [...sectionOrder, "closing"];
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    if (!updateState) return;
    const newOrder = [...sectionOrder];
    if (index + direction < 0 || index + direction >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + direction];
    newOrder[index + direction] = temp;
    updateState("themeConfig", { ...state.themeConfig, sectionOrder: newOrder });
  };

  const renderSection = (id: string, nextName?: string) => {
    let content = null;
    switch (id) {
      case "hero":
        content = (
          <PhotoEnvelopeHero
            partnerA={state.partnerA}
            partnerB={state.partnerB}
            weddingDate={state.weddingDate || new Date().toISOString()}
            musicUrl={state.musicUrl}
            monogram={`${state.partnerA?.[0] || ""}${state.partnerB?.[0] || ""}`}
            revealOverlayText={state.revealOverlay?.text}
            heroCustomFields={state.heroCustomFields}
            heroImageOverlay={state.heroImageOverlay}
            heroLayout={state.heroLayout}
            introVideoUrl={state.themeConfig.introVideoUrl}
            openingVideoUrl={state.themeConfig.openingVideoUrl}
            isPreview
            nextSectionName={nextName}
            forceOpen={(activeStep ?? 0) > 0}
          />
        );
        break;
      case "story":
        content = <StorySection title={state.story.title} body={state.story.body} blocks={(state.story as any).blocks} />;
        break;
      case "events":
        content = null; // Handled separately
        break;
      case "countdown":
        content = <Countdown weddingDate={state.weddingDate || new Date().toISOString()} partnerA={state.partnerA} partnerB={state.partnerB} />;
        break;
      case "rsvp":
        content = <RsvpForm weddingSlug={state.subdomainSlug || "preview"} events={state.events as any} />;
        break;
      case "gallery":
        content = <Gallery photos={[]} />;
        break;
      case "guestUpload":
        content = <GuestUploadWidget weddingSlug={state.subdomainSlug || "preview"} />;
        break;
      case "faq":
        content = <FaqFooter contact={(state as any).contact || []} />;
        break;
      case "closing":
        content = (
          <ClosingSection
            partnerA={state.partnerA}
            partnerB={state.partnerB}
            message={(state as any).closingMessage}
          />
        );
        break;
      default:
        return null;
    }

    return content;
  };

  const renderSectionWithBackground = (id: string, nextName?: string) => {
    const sectionBg = state.themeConfig.sectionBackgrounds?.[id];
    
    return (
      <div key={id} id={`preview-section-${id}`} className="relative z-0 w-full min-h-[932px] snap-start snap-always flex items-center justify-center">
        {sectionBg && (
          <div className="absolute inset-0 -z-10" style={{ clipPath: "inset(0)" }}>
            <div className="sticky top-0 w-full h-[932px]" style={{ backgroundImage: `url("${sectionBg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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

  const renderEventSection = (evt: any, i: number, index: number, nextName?: string) => {
    const sectionBg = state.themeConfig.sectionBackgrounds?.[`event-${evt.id || i}`];
    
    let mapLink = "";
    if (evt.venueAddress) {
      if (evt.venueAddress.startsWith("http://") || evt.venueAddress.startsWith("https://")) {
        mapLink = evt.venueAddress;
      } else {
        mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.venueAddress)}`;
      }
    }

    return (
      <div key={`event-${evt.id || i}`} className="relative group snap-start snap-always min-h-[932px] flex flex-col items-center justify-center p-6 text-center">
        {sectionBg && (
          <div className="absolute inset-0 -z-10" style={{ clipPath: "inset(0)" }}>
            <div className="sticky top-0 w-full h-[932px]" style={{ backgroundImage: `url("${sectionBg}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/70" />
            </div>
          </div>
        )}
        <div className={`relative z-10 w-full max-w-md space-y-6 ${(sectionBg || bgImage) ? "text-white" : "text-black"}`}>
          <h2 className="font-fancy" style={{ fontSize: (state.themeConfig as any).eventsTitleFontSize ? `${(state.themeConfig as any).eventsTitleFontSize}px` : '48px' }}>{evt.name}</h2>
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
              className="inline-block px-8 py-3 rounded-full bg-current text-[#faf6ee] font-medium transition-transform shadow-md mt-6 pointer-events-auto"
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
    const displayNames: Record<string, string> = {
      story: "Invitation",
      countdown: "Countdown",
      gallery: "Gallery",
      guestUpload: "Collect Photos",
      faq: "Contact",
      hero: "Welcome",
      closing: "With Love",
    };

    const sectionsToRender = sectionOrder.flatMap((id: string, index: number): any[] => {
      if (id === "rsvp" || id === "guestUpload") return [];
      if (id === "events") {
        return (state.events as any[]).map((evt, i) => ({
          type: "event",
          id: `event-${evt.id || i}`,
          evt,
          i,
          index,
          displayName: evt.name,
        }));
      }

      return [{
        type: "standard",
        id,
        index,
        displayName: displayNames[id] || id,
      }];
    });

    return sectionsToRender.map((section, idx) => {
      const nextSection = sectionsToRender[idx + 1];
      const nextName = nextSection?.displayName;

      if (section.type === "event") {
        return (
          <div key={`section-event-${section.i}`} id={section.i === 0 ? "preview-section-events" : `preview-section-event-${section.i}`}>
            {renderEventSection(section.evt, section.i, section.index, nextName)}
          </div>
        );
      }
      return (
        <div key={`section-${section.id}`} id={`preview-section-${section.id}`}>
          {renderSectionWithBackground(section.id, nextName)}
        </div>
      );
    });
  };

  const paletteColor = PALETTES.find(p => p.id === state.themeConfig.palette)?.swatch || "#b8860b";

  React.useEffect(() => {
    const container = document.getElementById("preview-scroll-container");
    if (!container) return;

    let targetId = "preview-section-hero";
    if (activeStep === 0) targetId = "preview-section-hero";
    else if (activeStep === 1) targetId = "preview-section-hero";
    else if (activeStep === 2) targetId = "preview-section-story";
    else if (activeStep === 3) targetId = "preview-section-events";
    
    if (activeStep >= 4) {
      container.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      container.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  }, [activeStep]);

  return (
    <div className="sticky top-6 flex flex-col items-center lg:items-end">
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Live Preview (iPhone 16 Pro Max)</p>
      
      {/* Wrapper with exact scaled dimensions so the browser doesn't add empty space */}
      <div style={{ width: 280, height: 606 }}>
        <div 
          className="origin-top-left rounded-[3rem] border-[12px] border-neutral-900 dark:border-neutral-800 shadow-2xl relative overflow-hidden"
          style={{
            transform: 'scale(0.65)',
            width: 430,
            height: 932,
            backgroundColor: 'white',
            '--theme-color': paletteColor,
          } as React.CSSProperties}
        >
          {/* Global Background Layer with Opacity Overlay */}
          {bgImage && (
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("${bgImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/70" />
            </div>
          )}

          <div 
            id="preview-scroll-container"
            className="absolute inset-0 z-10 overflow-y-auto hide-scrollbar snap-y snap-mandatory scroll-smooth"
            style={{ '--hero-height': '932px' } as React.CSSProperties}
          >
            <div className="min-h-full">
              {renderAllSections()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
