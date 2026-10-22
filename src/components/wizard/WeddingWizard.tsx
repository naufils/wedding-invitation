"use client";

import { useState, useEffect } from "react";
import { WizardState, WizardEvent, EMPTY_WIZARD_STATE, PALETTES, CustomHeroField, WeddingVariant, InvitationBlock } from "@/types/wizard";
import { WizardPreview } from "@/components/wizard/WizardPreview";
import html2canvas from "html2canvas";

const STEPS = [
  "Intro & Welcome",
  "Names, Date & Layout",
  "Invitation",
  "Events",
  "Theme",
  "Music",
  "Review & Publish",
] as const;

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function WeddingWizard({ 
  initialState, 
  isEdit = false, 
  weddingId 
}: { 
  initialState?: WizardState; 
  isEdit?: boolean; 
  weddingId?: string;
}) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(() => {
    // If the initialState from DB has no events, prepopulate with our 4 defaults
    const baseState = initialState || EMPTY_WIZARD_STATE;
    if (!baseState.events || baseState.events.length === 0) {
      return { ...baseState, events: EMPTY_WIZARD_STATE.events };
    }
    return baseState;
  });
  const [currentWeddingId, setCurrentWeddingId] = useState<string | null>(weddingId || null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [hardSaving, setHardSaving] = useState(false);
  const [hardSaveSuccess, setHardSaveSuccess] = useState(false);
  
  const [uploadingOverlayImage, setUploadingOverlayImage] = useState(false);
  const [overlayUploadError, setOverlayUploadError] = useState<string | null>(null);
  
  const [uploadingBgImage, setUploadingBgImage] = useState<string | null>(null);
  const [bgUploadError, setBgUploadError] = useState<string | null>(null);

  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [musicUploadError, setMusicUploadError] = useState<string | null>(null);

  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [heroImageUploadError, setHeroImageUploadError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [generatingOgImage, setGeneratingOgImage] = useState(false);

  // Load from local storage on mount if it exists, prioritizing unsaved changes.
  // In edit mode we always start from the server DB state — skip cache.
  useEffect(() => {
    if (isEdit) return; // always use fresh DB state in edit mode
    const cached = localStorage.getItem(`evermint_wizard_${currentWeddingId || 'new'}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!parsed.events || parsed.events.length === 0) {
          parsed.events = EMPTY_WIZARD_STATE.events;
        }
        if (!parsed.heroLayout) {
          parsed.heroLayout = ["image", "revealText", "names", "date", ...(parsed.heroCustomFields?.map((f: any) => f.id) || [])];
        }
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse cached wizard state", e);
      }
    }
  }, [currentWeddingId]);

  // Auto-save to local storage on every change
  useEffect(() => {
    localStorage.setItem(`evermint_wizard_${currentWeddingId || 'new'}`, JSON.stringify(state));
  }, [state, currentWeddingId]);

  async function handleOverlayImageSelect(file: File | undefined) {
    if (!file) return;
    setUploadingOverlayImage(true);
    setOverlayUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      updateState("revealOverlay", { ...state.revealOverlay, imageUrl: publicUrl });
    } catch (err) {
      setOverlayUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingOverlayImage(false);
    }
  }

  async function handleSectionBgSelect(sectionId: string, file: File | undefined) {
    if (!file) return;
    setUploadingBgImage(sectionId);
    setBgUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      if (sectionId === "global") {
        updateState("themeConfig", { 
          ...state.themeConfig, 
          backgroundImageUrl: publicUrl
        });
      } else {
        updateState("themeConfig", { 
          ...state.themeConfig, 
          sectionBackgrounds: {
            ...(state.themeConfig.sectionBackgrounds || {}),
            [sectionId]: publicUrl
          } 
        });
      }
    } catch (err) {
      setBgUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingBgImage(null);
    }
  }

  async function handleVideoUpload(type: "intro" | "opening", file: File | undefined) {
    if (!file) return;
    setUploadingBgImage(type);
    setBgUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare video upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Video upload failed");

      if (type === "intro") {
        updateState("themeConfig", { ...state.themeConfig, introVideoUrl: publicUrl });
      } else {
        updateState("themeConfig", { ...state.themeConfig, openingVideoUrl: publicUrl });
      }
    } catch (err) {
      setBgUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingBgImage(null);
    }
  }

  async function handleOutfitUpload(eventIndex: number, file: File | undefined) {
    if (!file) return;
    setUploadingBgImage(`outfit-${eventIndex}`);
    setBgUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare image upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Image upload failed");

      updateEvent(eventIndex, { outfitImageUrl: publicUrl });
    } catch (err) {
      setBgUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingBgImage(null);
    }
  }

  async function handleMusicSelect(file: File | undefined) {
    if (!file) return;
    setUploadingMusic(true);
    setMusicUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      updateState("musicUrl", publicUrl);
      updateState("musicType", "upload");
    } catch (err) {
      setMusicUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingMusic(false);
    }
  }

  async function handleHeroImageSelect(file: File | undefined) {
    if (!file) return;
    setUploadingHeroImage(true);
    setHeroImageUploadError(null);
    try {
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      updateState("heroImageOverlay", { imageUrl: publicUrl, width: 150 });
    } catch (err) {
      setHeroImageUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingHeroImage(false);
    }
  }

  async function generateMetaImageFromStory() {
    setGeneratingOgImage(true);
    try {
      const element = document.getElementById("preview-section-story");
      if (!element) throw new Error("Could not find the story section in preview.");
      
      const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
      
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if (!blob) throw new Error("Could not generate image.");
      
      const file = new File([blob], `meta-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const presignRes = await fetch("/api/uploads/reveal-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Could not prepare upload");
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      updateState("themeConfig", { ...state.themeConfig, ogImageUrl: publicUrl });
    } catch (err) {
      console.error(err);
      alert("Failed to generate meta image: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGeneratingOgImage(false);
    }
  }

  function updateState<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function addHeroCustomField(type: 'text' | 'textarea') {
    const newField: CustomHeroField = {
      id: crypto.randomUUID(),
      type,
      value: "",
      fontSize: 16
    };
    updateState("heroCustomFields", [...(state.heroCustomFields || []), newField]);
    updateState("heroLayout", [...(state.heroLayout || ["image", "revealText", "names", "date"]), newField.id]);
  }

  function updateHeroCustomField(id: string, patch: Partial<CustomHeroField>) {
    const fields = state.heroCustomFields || [];
    updateState("heroCustomFields", fields.map(f => f.id === id ? { ...f, ...patch } : f));
  }

  function removeHeroCustomField(id: string) {
    const fields = state.heroCustomFields || [];
    updateState("heroCustomFields", fields.filter(f => f.id !== id));
    updateState("heroLayout", (state.heroLayout || []).filter(lId => lId !== id));
  }

  function moveHeroLayoutItem(index: number, direction: 'up' | 'down') {
    const newLayout = [...(state.heroLayout || ["image", "revealText", "names", "date"])];
    if (direction === 'up' && index > 0) {
      [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
    } else if (direction === 'down' && index < newLayout.length - 1) {
      [newLayout[index], newLayout[index + 1]] = [newLayout[index + 1], newLayout[index]];
    }
    updateState('heroLayout', newLayout);
  }

  function addEvent() {
    updateState("events", [
      ...state.events,
      {
        id: `event-${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        date: state.weddingDate || "",
        time: "",
        venueName: "",
        venueAddress: "",
        dressCode: "",
      },
    ]);
  }

  function addVariant() {
    updateState("themeConfig", {
      ...state.themeConfig,
      variants: [
        ...(state.themeConfig.variants || []),
        { id: `variant-${Math.random().toString(36).substr(2, 9)}`, name: "", slugSuffix: "", visibleEventIds: [] }
      ]
    });
  }

  function updateVariant(index: number, patch: Partial<WeddingVariant>) {
    const variants = [...(state.themeConfig.variants || [])];
    variants[index] = { ...variants[index], ...patch };
    updateState("themeConfig", { ...state.themeConfig, variants });
  }

  function removeVariant(index: number) {
    const variants = [...(state.themeConfig.variants || [])];
    variants.splice(index, 1);
    updateState("themeConfig", { ...state.themeConfig, variants });
  }

  function updateEvent(index: number, patch: Partial<WizardEvent>) {
    const next = state.events.map((e, i) => (i === index ? { ...e, ...patch } : e));
    updateState("events", next);
  }

  function removeEvent(index: number) {
    updateState(
      "events",
      state.events.filter((_, i) => i !== index),
    );
  }

  async function handleHardSave() {
    setHardSaving(true);
    try {
      const endpoint = currentWeddingId ? `/api/weddings/${currentWeddingId}` : "/api/weddings";
      const method = currentWeddingId ? "PUT" : "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save wedding");
      }
      const data = await res.json();
      setCurrentWeddingId(data.id);
      updateState("subdomainSlug", data.subdomainSlug);
      localStorage.removeItem(`evermint_wizard_${currentWeddingId || 'new'}`);
      setHardSaveSuccess(true);
      setTimeout(() => setHardSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setHardSaving(false);
    }
  }

  async function handleCreateOrUpdate() {
    setCreating(true);
    setCreateError(null);
    try {
      const endpoint = currentWeddingId ? `/api/weddings/${currentWeddingId}` : "/api/weddings";
      const method = currentWeddingId ? "PUT" : "POST";
      
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save wedding");
      }
      const data = await res.json();
      setCurrentWeddingId(data.id);
      updateState("subdomainSlug", data.subdomainSlug);
      localStorage.removeItem(`evermint_wizard_${currentWeddingId || 'new'}`);
      setPublished(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setCreateError(msg);
      console.error("[handleCreateOrUpdate]", err);
    } finally {
      setCreating(false);
    }
  }

  const liveUrl = typeof window !== 'undefined' && state.subdomainSlug ? `${window.location.origin}/sites/${state.subdomainSlug}` : '';

  const copyLiveLink = () => {
    if (liveUrl) {
      navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (published && currentWeddingId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-3xl">{isEdit ? "Changes Saved!" : "You're live!"}</h1>
        <p className="text-neutral-600">
          Your invitation is published at{" "}
          <a
            className="font-medium text-black dark:text-white underline"
            href={`/sites/${state.subdomainSlug}`}
          >
            {liveUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>
        <div className="mt-8 flex gap-4">
          <button 
            onClick={copyLiveLink}
            className="rounded-full bg-white px-6 py-2.5 text-sm text-black shadow-lg hover:scale-105 transition-transform border border-neutral-200"
          >
            {copiedLink ? "Copied!" : "Copy Link"}
          </button>
          {isEdit && (
            <button 
              onClick={() => setPublished(false)}
              className="rounded-full border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Continue Editing
            </button>
          )}
        </div>
      </main>
    );
  }

  const sectionOrder = state.themeConfig.sectionOrder || [];

  return (
    <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[200px_minmax(400px,1fr)_400px] lg:grid-cols-[250px_minmax(450px,1fr)_450px]">
      {/* 1. Left Sidebar: Vertical Navigation */}
      <div className="hidden md:flex flex-col gap-2 relative">
        <div className="sticky top-6 flex flex-col gap-2">
          <h1 className="text-2xl font-serif font-bold text-black dark:text-white mb-6">
            {isEdit ? "Edit Invitation" : "Create Invitation"}
          </h1>
          {STEPS.map((label, i) => {
            const stepLabel = isEdit && label === "Review & Publish" ? "Review & Save" : label;
            return (
              <button
                key={label}
                onClick={() => setStep(i)}
                className={`text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  i === step 
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-md" 
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#111]"
                }`}
              >
                {i + 1}. {stepLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Middle Column: Content Area */}
      <div className="flex flex-col min-w-0 pb-20">
        <div className="flex items-center justify-between mb-8 md:hidden">
          <h1 className="text-3xl font-serif font-bold text-black dark:text-white">
            {isEdit ? "Edit Invitation" : "Create Invitation"}
          </h1>
        </div>
        
        {state.subdomainSlug && (
          <div className="flex justify-end gap-2 mb-8">
            <button
              onClick={handleHardSave}
              disabled={hardSaving}
              className="text-sm font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-2"
            >
              {hardSaving ? "Saving..." : hardSaveSuccess ? "Saved!" : "Save Data"}
            </button>
            <button
              onClick={copyLiveLink}
              className="text-sm font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-2"
            >
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
            <a 
              href={`/sites/${state.subdomainSlug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-full transition-colors shadow-lg flex items-center gap-2"
            >
              Preview ↗
            </a>
          </div>
        )}

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden mb-10 flex items-center gap-3 text-sm text-neutral-600 overflow-x-auto pb-4 hide-scrollbar">
          {STEPS.map((label, i) => {
            const stepLabel = isEdit && label === "Review & Publish" ? "Review & Save" : label;
            return (
              <button 
                key={label} 
                onClick={() => setStep(i)}
                className={`whitespace-nowrap transition-colors ${i === step ? "font-semibold text-black dark:text-white" : "text-neutral-600 dark:text-neutral-500"}`}
              >
                {i + 1}. {stepLabel}
                {i < STEPS.length - 1 ? " → " : ""}
              </button>
            );
          })}
        </div>

        {step === 0 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Intro &amp; Welcome</h2>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Choose the videos your guests see when they first open your invitation. Defaults are pre-loaded — upload your own to personalise.
            </p>

            <div className="space-y-6">
              {/* Intro Video */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-black dark:text-white">Intro Video</label>
                    <p className="text-xs text-neutral-500 mt-0.5">Plays at the very beginning — the "envelope" moment.</p>
                  </div>
                  {state.themeConfig.introVideoUrl && state.themeConfig.introVideoUrl === "/envelope/intro.mp4" && (
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 tracking-wide uppercase">Default</span>
                  )}
                </div>

                {/* Video preview — always shown when URL exists */}
                {state.themeConfig.introVideoUrl ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                    <video
                      key={state.themeConfig.introVideoUrl}
                      src={state.themeConfig.introVideoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#1a1a1a] flex items-center justify-center">
                    <p className="text-sm text-neutral-400">No video selected</p>
                  </div>
                )}

                {/* Controls — always visible */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] text-sm font-medium text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    {uploadingBgImage === "intro" ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Uploading…</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> {state.themeConfig.introVideoUrl ? "Change Video" : "Upload Video"}</>
                    )}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => handleVideoUpload("intro", e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {state.themeConfig.introVideoUrl && state.themeConfig.introVideoUrl !== "/envelope/intro.mp4" && (
                    <button
                      type="button"
                      onClick={() => updateState("themeConfig", { ...state.themeConfig, introVideoUrl: "/envelope/intro.mp4" })}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                {bgUploadError && uploadingBgImage === null && (
                  <p className="text-xs text-red-500">{bgUploadError}</p>
                )}
              </div>

              {/* Opening Video */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-black dark:text-white">Opening Video (Background)</label>
                    <p className="text-xs text-neutral-500 mt-0.5">Plays as the ambient background after the envelope opens.</p>
                  </div>
                  {state.themeConfig.openingVideoUrl && state.themeConfig.openingVideoUrl === "/envelope/reveal.mp4" && (
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 tracking-wide uppercase">Default</span>
                  )}
                </div>

                {/* Video preview — always shown when URL exists */}
                {state.themeConfig.openingVideoUrl ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                    <video
                      key={state.themeConfig.openingVideoUrl}
                      src={state.themeConfig.openingVideoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-[#1a1a1a] flex items-center justify-center">
                    <p className="text-sm text-neutral-400">No video selected</p>
                  </div>
                )}

                {/* Controls — always visible */}
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] text-sm font-medium text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    {uploadingBgImage === "opening" ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Uploading…</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> {state.themeConfig.openingVideoUrl ? "Change Video" : "Upload Video"}</>
                    )}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => handleVideoUpload("opening", e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  {state.themeConfig.openingVideoUrl && state.themeConfig.openingVideoUrl !== "/envelope/reveal.mp4" && (
                    <button
                      type="button"
                      onClick={() => updateState("themeConfig", { ...state.themeConfig, openingVideoUrl: "/envelope/reveal.mp4" })}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Names, Date &amp; Layout</h2>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Drag or move items up and down to rearrange how they appear on the video invitation.
            </p>



            <div className="space-y-4">
              {(state.heroLayout || ["image", "revealText", "names", "date"]).map((itemId, index) => {
                const isFirst = index === 0;
                const isLast = index === (state.heroLayout?.length || 4) - 1;

                const renderControls = () => (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveHeroLayoutItem(index, 'up')}
                      disabled={isFirst}
                      className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHeroLayoutItem(index, 'down')}
                      disabled={isLast}
                      className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ↓
                    </button>
                  </div>
                );

                if (itemId === "names") {
                  return (
                    <div key={itemId} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/5 dark:bg-[#111]/50 items-start">
                      <div className="flex-1 space-y-4">
                        <label className="text-sm font-semibold text-black dark:text-white block">Names</label>
                        <input
                          placeholder="Partner A's name"
                          value={state.partnerA}
                          onChange={(e) => {
                            updateState("partnerA", e.target.value);
                            updateState("subdomainSlug", slugify(e.target.value + state.partnerB));
                          }}
                          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                        />
                        <input
                          placeholder="Partner B's name"
                          value={state.partnerB}
                          onChange={(e) => {
                            updateState("partnerB", e.target.value);
                            updateState("subdomainSlug", slugify(state.partnerA + e.target.value));
                          }}
                          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                        />
                        <label className="flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          Your custom URL / Subdomain
                          <input
                            value={state.subdomainSlug}
                            onChange={(e) => updateState("subdomainSlug", slugify(e.target.value))}
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                          />
                        </label>
                      </div>
                      {renderControls()}
                    </div>
                  );
                }

                if (itemId === "date") {
                  return (
                    <div key={itemId} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/5 dark:bg-[#111]/50 items-center">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-semibold text-black dark:text-white block">Wedding Date</label>
                        <input
                          type="date"
                          value={state.weddingDate}
                          onChange={(e) => updateState("weddingDate", e.target.value)}
                          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                        />
                      </div>
                      {renderControls()}
                    </div>
                  );
                }

                if (itemId === "revealText") {
                  return (
                    <div key={itemId} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/5 dark:bg-[#111]/50 items-center">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-semibold text-black dark:text-white block">Reveal Text (e.g. You are Invited)</label>
                        <input
                          placeholder="e.g. You are Invited"
                          value={state.revealOverlay.text}
                          onChange={(e) =>
                            updateState("revealOverlay", { ...state.revealOverlay, text: e.target.value })
                          }
                          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                        />
                      </div>
                      {renderControls()}
                    </div>
                  );
                }

                if (itemId === "image") {
                  return (
                    <div key={itemId} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white/5 dark:bg-[#111]/50 items-start">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-semibold text-black dark:text-white block">Image / Logo</label>
                        {!state.heroImageOverlay?.imageUrl ? (
                          <div className="flex flex-col gap-2">
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500 px-3 py-6 transition-all bg-white dark:bg-[#1a1a1a]">
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                onChange={(e) => handleHeroImageSelect(e.target.files?.[0])}
                                className="hidden"
                              />
                              <span className="text-sm font-medium text-black dark:text-white">Upload image</span>
                            </label>
                            {uploadingHeroImage && <p className="text-xs text-neutral-500 mt-1 text-center">Uploading…</p>}
                            {heroImageUploadError && <p className="text-xs text-red-500 mt-1 text-center">{heroImageUploadError}</p>}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-[#1a1a1a]">
                            <div className="flex items-center justify-between">
                              <img
                                src={state.heroImageOverlay.imageUrl}
                                alt="Hero overlay"
                                className="h-16 object-contain rounded bg-black/5 p-1"
                              />
                              <button
                                type="button"
                                onClick={() => updateState("heroImageOverlay", undefined)}
                                className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                               <label className="text-sm text-neutral-600 dark:text-neutral-400">Image Width: {state.heroImageOverlay.width}px</label>
                               <input 
                                 type="range" 
                                 min="50" 
                                 max="400" 
                                 value={state.heroImageOverlay.width} 
                                 onChange={(e) => updateState("heroImageOverlay", { ...state.heroImageOverlay!, width: parseInt(e.target.value) })} 
                                 className="w-full accent-black dark:accent-white" 
                               />
                            </div>
                          </div>
                        )}
                      </div>
                      {renderControls()}
                    </div>
                  );
                }

                const customField = state.heroCustomFields?.find(f => f.id === itemId);
                if (customField) {
                  return (
                    <div key={itemId} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-[#1a1a1a] items-start">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-black dark:text-white block">Custom Text</span>
                          <button type="button" className="text-red-500 text-sm hover:underline" onClick={() => removeHeroCustomField(customField.id)}>Remove</button>
                        </div>
                        {customField.type === 'text' ? (
                          <input value={customField.value} onChange={(e) => updateHeroCustomField(customField.id, { value: e.target.value })} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black px-3 py-2 text-black dark:text-white outline-none" placeholder="Enter text" />
                        ) : (
                          <textarea value={customField.value} onChange={(e) => updateHeroCustomField(customField.id, { value: e.target.value })} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black px-3 py-2 text-black dark:text-white outline-none resize-none" placeholder="Enter text" rows={3} />
                        )}
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex justify-between">
                            <label className="text-sm text-neutral-600 dark:text-neutral-400">Font Size: {customField.fontSize}px</label>
                          </div>
                          <input type="range" min="12" max="72" value={customField.fontSize} onChange={(e) => updateHeroCustomField(customField.id, { fontSize: parseInt(e.target.value) })} className="w-full accent-black dark:accent-white" />
                        </div>
                      </div>
                      {renderControls()}
                    </div>
                  );
                }

                return null;
              })}

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => addHeroCustomField('text')} className="flex-1 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500 py-4 text-sm font-medium transition-colors bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">+ Custom Single Line</button>
                <button type="button" onClick={() => addHeroCustomField('textarea')} className="flex-1 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500 py-4 text-sm font-medium transition-colors bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">+ Custom Multi-Line</button>
              </div>


            </div>
          </div>
        )}

        {step === 2 && (() => {
          const blocks: InvitationBlock[] = state.story.blocks || [];

          const setBlocks = (next: InvitationBlock[]) =>
            updateState("story", { ...state.story, blocks: next });

          const addBlock = (type: InvitationBlock['type']) => {
            const id = `block-${Date.now()}`;
            if (type === 'image') {
              setBlocks([...blocks, { id, type, value: '', align: 'center' }]);
            } else {
              setBlocks([...blocks, { id, type, value: '', fontSize: type === 'heading' ? 28 : 16, align: 'center', bold: type === 'heading', italic: false }]);
            }
          };

          const updateBlock = (id: string, patch: Partial<InvitationBlock>) =>
            setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));

          const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

          const moveBlock = (id: string, dir: -1 | 1) => {
            const idx = blocks.findIndex(b => b.id === id);
            if (idx + dir < 0 || idx + dir >= blocks.length) return;
            const next = [...blocks];
            [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
            setBlocks(next);
          };

          const uploadBlockImage = async (id: string, file: File) => {
            try {
              const presignRes = await fetch("/api/uploads/reveal-asset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, fileType: file.type }),
              });
              if (!presignRes.ok) throw new Error("Could not prepare upload");
              const { uploadUrl, publicUrl } = await presignRes.json();
              const putRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
              });
              if (!putRes.ok) throw new Error("Upload failed");
              updateBlock(id, { value: publicUrl });
            } catch (err) {
              console.error("Block image upload failed", err);
            }
          };

          return (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Invitation</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Build your invitation with text blocks and images. Drag to reorder, resize, and style each element.</p>

              {/* Block list */}
              <div className="flex flex-col gap-3">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="relative rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/5 p-4 flex flex-col gap-3 group">

                    {/* Move up / down */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => moveBlock(block.id, -1)} disabled={idx === 0}
                        className="w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center disabled:opacity-30 hover:bg-black">↑</button>
                      <button type="button" onClick={() => moveBlock(block.id, 1)} disabled={idx === blocks.length - 1}
                        className="w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center disabled:opacity-30 hover:bg-black">↓</button>
                    </div>

                    {/* Block type badge + delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {block.type === 'heading' ? '⬛ Heading' : block.type === 'text' ? '📝 Text' : '🖼 Image'}
                      </span>
                      <button type="button" onClick={() => removeBlock(block.id)}
                        className="text-neutral-400 hover:text-red-500 text-xs transition-colors">✕ Remove</button>
                    </div>

                    {block.type === 'image' ? (
                      <div className="flex flex-col gap-2">
                        {block.value ? (
                          <div className="relative">
                            <img src={block.value} alt="" className="w-full max-h-48 object-contain rounded-xl" />
                            <button type="button" onClick={() => updateBlock(block.id, { value: '' })}
                              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">Remove</button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl h-28 cursor-pointer hover:border-black dark:hover:border-white transition-colors">
                            <span className="text-2xl">📷</span>
                            <span className="text-sm text-neutral-500">Upload Image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadBlockImage(block.id, f); }} />
                          </label>
                        )}
                        {/* Alignment */}
                        <div className="flex gap-2 justify-center">
                          {(['left','center','right'] as const).map(a => (
                            <button key={a} type="button" onClick={() => updateBlock(block.id, { align: a })}
                              className={`px-3 py-1 text-xs rounded-lg border transition-colors ${ block.align === a ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:border-black dark:hover:border-white' }`}>
                              {a === 'left' ? '⬅ Left' : a === 'center' ? '⬛ Center' : 'Right ➡'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {/* Text input */}
                        {block.type === 'heading' ? (
                          <input
                            value={block.value}
                            onChange={e => updateBlock(block.id, { value: e.target.value })}
                            placeholder="Enter heading..."
                            className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-2 font-serif focus:border-black dark:focus:border-white outline-none transition-colors text-black dark:text-white"
                            style={{ fontSize: block.fontSize }}
                          />
                        ) : (
                          <textarea
                            value={block.value}
                            onChange={e => updateBlock(block.id, { value: e.target.value })}
                            placeholder="Enter text..."
                            rows={3}
                            className="w-full bg-white/5 border border-neutral-300 dark:border-neutral-700 rounded-xl p-3 focus:border-black dark:focus:border-white outline-none transition-colors resize-none text-black dark:text-white"
                            style={{ fontSize: block.fontSize }}
                          />
                        )}

                        {/* Controls row */}
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Font size */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">Size</span>
                            <input type="range" min={10} max={60} value={block.fontSize || 16}
                              onChange={e => updateBlock(block.id, { fontSize: Number(e.target.value) })}
                              className="w-24 accent-black dark:accent-white" />
                            <span className="text-xs w-6 text-neutral-600 dark:text-neutral-400">{block.fontSize}</span>
                          </div>

                          {/* Bold / Italic */}
                          <button type="button" onClick={() => updateBlock(block.id, { bold: !block.bold })}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${ block.bold ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500' }`}>B</button>
                          <button type="button" onClick={() => updateBlock(block.id, { italic: !block.italic })}
                            className={`px-2.5 py-1 text-xs italic rounded-lg border transition-colors ${ block.italic ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500' }`}>I</button>

                          {/* Alignment */}
                          {(['left','center','right'] as const).map(a => (
                            <button key={a} type="button" onClick={() => updateBlock(block.id, { align: a })}
                              className={`px-2 py-1 text-xs rounded-lg border transition-colors ${ block.align === a ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500' }`}>
                              {a === 'left' ? '≡L' : a === 'center' ? '≡C' : '≡R'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add block buttons */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                <button type="button" onClick={() => addBlock('heading')}
                  className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white py-4 text-sm font-medium transition-colors bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex flex-col items-center gap-1">
                  <span className="text-xl">⬛</span> Add Heading
                </button>
                <button type="button" onClick={() => addBlock('text')}
                  className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white py-4 text-sm font-medium transition-colors bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex flex-col items-center gap-1">
                  <span className="text-xl">📝</span> Add Text
                </button>
                <button type="button" onClick={() => addBlock('image')}
                  className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white py-4 text-sm font-medium transition-colors bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex flex-col items-center gap-1">
                  <span className="text-xl">🖼</span> Add Image
                </button>
              </div>

              {/* Meta image capture */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-2">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Capture the invitation as a social preview image for WhatsApp / Facebook / Twitter sharing.</p>
                <button type="button" onClick={generateMetaImageFromStory} disabled={generatingOgImage}
                  className="rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-md">
                  {generatingOgImage ? 'Capturing...' : 'Capture as Share Image'}
                </button>
                {state.themeConfig.ogImageUrl && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">✓ Share image set</p>
                    <img src={state.themeConfig.ogImageUrl} alt="Meta" className="w-full max-w-[200px] rounded-xl border border-neutral-200 dark:border-neutral-800" />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Events</h2>
            <div className="space-y-6">
              {state.events.map((event, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white/5 dark:bg-[#111]/50">
                  <input
                    placeholder="Event name (e.g. Haldi)"
                    value={event.name}
                    onChange={(e) => updateEvent(i, { name: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(i, { date: e.target.value })}
                      className="w-1/2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                    />
                    <input
                      type="time"
                      value={event.time}
                      onChange={(e) => updateEvent(i, { time: e.target.value })}
                      className="w-1/2 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                    />
                  </div>
                  <input
                    placeholder="Venue name"
                    value={event.venueName}
                    onChange={(e) => updateEvent(i, { venueName: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                  />
                  <input
                    placeholder="Address or Google Maps link"
                    value={event.venueAddress}
                    onChange={(e) => updateEvent(i, { venueAddress: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                  />
                  <input
                    placeholder="Dress code (optional)"
                    value={event.dressCode}
                    onChange={(e) => updateEvent(i, { dressCode: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-black dark:text-white block">Event Background (Optional)</label>
                    <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111] text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      {uploadingBgImage === `event-${event.id || i}` ? "Uploading..." : state.themeConfig.sectionBackgrounds?.[`event-${event.id || i}`] ? "Change Background" : "Upload Background Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSectionBgSelect(`event-${event.id || i}`, file);
                        }}
                      />
                    </label>
                    {state.themeConfig.sectionBackgrounds?.[`event-${event.id || i}`] && (
                      <div className="mt-2 flex items-center justify-between p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                        <img src={state.themeConfig.sectionBackgrounds[`event-${event.id || i}`]} alt="Event Background" className="h-12 w-12 object-cover rounded" />
                        <button type="button" onClick={() => {
                          const newBgs = { ...state.themeConfig.sectionBackgrounds };
                          delete newBgs[`event-${event.id || i}`];
                          updateState("themeConfig", { ...state.themeConfig, sectionBackgrounds: newBgs });
                        }} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-black dark:text-white block">Outfit Inspiration Image (Optional)</label>
                    <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111] text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      {uploadingBgImage === `outfit-${i}` ? "Uploading..." : event.outfitImageUrl ? "Change Outfit Image" : "Upload Outfit Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleOutfitUpload(i, file);
                        }}
                      />
                    </label>
                    {event.outfitImageUrl && (
                      <div className="mt-2 flex items-center justify-between p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                        <img src={event.outfitImageUrl} alt="Outfit Inspiration" className="h-12 w-12 object-cover rounded" />
                        <button type="button" onClick={() => updateEvent(i, { outfitImageUrl: undefined })} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(i)}
                    className="self-start text-sm font-medium text-red-500 hover:text-red-400 transition-colors mt-2"
                  >
                    Remove Event
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEvent}
                className="w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 px-4 py-6 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all"
              >
                + Add another event
              </button>
            </div>

            <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
              <h3 className="font-serif text-2xl font-medium text-black dark:text-white mb-2">Duplicate Links (Variants)</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Create alternative links for your invitation that only show specific events. Useful for inviting guests to only certain ceremonies.
              </p>
              <div className="space-y-4">
                {(state.themeConfig.variants || []).map((variant, index) => (
                  <div key={variant.id} className="flex flex-col gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white/5 dark:bg-[#111]/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <input
                          placeholder="Variant Name (e.g. Friends Only)"
                          value={variant.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            updateVariant(index, { name, slugSuffix: slugify(name) });
                          }}
                          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-neutral-600 dark:text-neutral-400">Variant Link URL Suffix</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700">/sites/{state.subdomainSlug || 'your-url'}/</span>
                            <input
                              placeholder="e.g. friends"
                              value={variant.slugSuffix}
                              onChange={(e) => updateVariant(index, { slugSuffix: slugify(e.target.value) })}
                              className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-400 p-2 ml-4">Remove</button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <label className="text-sm font-semibold text-black dark:text-white block">Which events should this link show?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {state.events.map((evt, i) => {
                          const eventId = evt.id || `temp-${i}`;
                          const isSelected = variant.visibleEventIds.includes(eventId);
                          return (
                            <label key={eventId} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-black dark:border-white bg-black/5 dark:bg-white/10' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'}`}>
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                                checked={isSelected}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  let newIds = [...variant.visibleEventIds];
                                  if (checked && !newIds.includes(eventId)) newIds.push(eventId);
                                  if (!checked) newIds = newIds.filter(id => id !== eventId);
                                  updateVariant(index, { visibleEventIds: newIds });
                                }}
                              />
                              <span className="text-sm font-medium text-black dark:text-white">{evt.name || `Event ${i + 1}`}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 px-4 py-4 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Create a Variant Link
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Theme</h2>
            <div className="grid grid-cols-2 gap-4">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    updateState("themeConfig", { ...state.themeConfig, palette: p.id })
                  }
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left font-medium transition-all ${
                    state.themeConfig.palette === p.id
                      ? "border-black dark:border-white ring-1 ring-black dark:ring-white text-black dark:text-white bg-black/5 dark:bg-white/10"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  <span
                    className="h-8 w-8 rounded-full border border-black/10 dark:border-white/20 shadow-inner"
                    style={{ backgroundColor: p.swatch }}
                  />
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <h3 className="font-serif text-2xl font-medium text-black dark:text-white mb-4">Global Background</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Upload a beautiful background image that will show behind your entire invitation.
              </p>
              
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/5 dark:bg-[#111] mb-6">
                {!state.themeConfig.backgroundImageUrl ? (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500 px-3 py-4 transition-all bg-white dark:bg-[#1a1a1a]">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => handleSectionBgSelect("global", e.target.files?.[0])}
                      className="hidden"
                    />
                    <span className="text-sm font-medium text-black dark:text-white">Upload image</span>
                  </label>
                ) : (
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={state.themeConfig.backgroundImageUrl}
                      alt="Global background"
                      className="h-12 w-20 rounded-md border border-neutral-200 dark:border-neutral-700 object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => updateState("themeConfig", { ...state.themeConfig, backgroundImageUrl: "" })}
                      className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {uploadingBgImage === "global" && <p className="text-xs text-neutral-500 mt-1">Uploading…</p>}
              </div>

              <h3 className="font-serif text-2xl font-medium text-black dark:text-white mb-4">Parallax Backgrounds</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Upload custom background images for specific sections to create a stunning scroll effect.
              </p>
              
              <div className="space-y-4">
                {sectionOrder.filter(s => s !== "rsvp").map((sectionId) => {
                  const currentBg = state.themeConfig.sectionBackgrounds?.[sectionId];
                  return (
                    <div key={sectionId} className="flex flex-col gap-2 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/5 dark:bg-[#111]">
                      <h4 className="capitalize font-medium text-black dark:text-white">{sectionId}</h4>
                      
                      {!currentBg ? (
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-neutral-500 px-3 py-4 transition-all bg-white dark:bg-[#1a1a1a]">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => handleSectionBgSelect(sectionId, e.target.files?.[0])}
                            className="hidden"
                          />
                          <span className="text-sm font-medium text-black dark:text-white">Upload image</span>
                        </label>
                      ) : (
                        <div className="flex items-center gap-4 mt-2">
                          <img
                            src={currentBg}
                            alt={`${sectionId} background`}
                            className="h-12 w-20 rounded-md border border-neutral-200 dark:border-neutral-700 object-cover shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newBgs = { ...state.themeConfig.sectionBackgrounds };
                              delete newBgs[sectionId];
                              updateState("themeConfig", { ...state.themeConfig, sectionBackgrounds: newBgs });
                            }}
                            className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      
                      {uploadingBgImage === sectionId && <p className="text-xs text-neutral-500 mt-1">Uploading…</p>}
                    </div>
                  );
                })}
              </div>
              {bgUploadError && <p className="text-sm text-red-500 mt-4">{bgUploadError}</p>}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="font-serif text-3xl font-medium text-black dark:text-white">Music</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Add a soundtrack that plays when your guests open the invitation. Music plays automatically at a comfortable 60% volume.
            </p>
            
            <div className="flex gap-2">
              {(['youtube', 'upload', 'link'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateState("musicType", t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    state.musicType === t
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {t === 'youtube' && "YouTube"}
                  {t === 'upload' && "Upload File"}
                  {t === 'link' && "Direct Link"}
                </button>
              ))}
            </div>

            {state.musicType === 'youtube' && (
              <div className="space-y-2">
                <input
                  placeholder="Paste YouTube Link (e.g. https://youtube.com/watch?v=...)"
                  value={state.musicUrl}
                  onChange={(e) => updateState("musicUrl", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                />
              </div>
            )}

            {state.musicType === 'link' && (
              <div className="space-y-2">
                <input
                  placeholder="Paste direct MP3/MP4 URL"
                  value={state.musicUrl}
                  onChange={(e) => updateState("musicUrl", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111] px-4 py-3.5 text-black dark:text-white placeholder:text-neutral-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none"
                />
              </div>
            )}

            {state.musicType === 'upload' && (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center cursor-pointer w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 px-4 py-10 transition-all bg-white dark:bg-[#111]">
                  <input
                    type="file"
                    accept="audio/mpeg,video/mp4"
                    onChange={(e) => handleMusicSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                  <span className="font-medium text-black dark:text-white mb-2">Upload Audio/Video</span>
                  <span className="text-sm text-neutral-500">Supports MP3, MP4</span>
                </label>
                {uploadingMusic && <p className="text-xs text-neutral-500">Uploading file…</p>}
                {musicUploadError && <p className="text-sm text-red-500">{musicUploadError}</p>}
                {state.musicUrl && !uploadingMusic && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">✓ File uploaded successfully</p>
                )}
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95 duration-500 py-10">
            <h2 className="font-serif text-4xl font-medium text-black dark:text-white">
              {isEdit ? "Review & Save" : "Review & Publish"}
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-sm">
              {isEdit 
                ? "Your changes will be live immediately after saving. Double check your preview!"
                : "Payment is disabled for now — your invitation will be published live immediately."}
            </p>
            <button
              type="button"
              onClick={handleCreateOrUpdate}
              disabled={creating}
              className="rounded-full bg-black dark:bg-white px-10 py-4 text-base font-medium text-white dark:text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl"
            >
              {creating ? (isEdit ? "Saving…" : "Publishing…") : (isEdit ? "Save Changes" : "Save & Publish")}
            </button>
            {createError && <p className="text-sm font-medium text-red-500">{createError}</p>}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-900 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="rounded-full bg-black dark:bg-white px-8 py-3 text-sm font-medium text-white dark:text-black hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <WizardPreview state={state} updateState={updateState} activeStep={step} />
    </main>
  );
}
