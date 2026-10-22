import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { WeddingWizard } from "@/components/wizard/WeddingWizard";
import { WizardState } from "@/types/wizard";

export default async function EditWeddingPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;

  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  const session = await auth();
  const userEmail = session?.user?.email || "dev@local.test";

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    redirect("/login");
  }

  const wedding = await prisma.wedding.findUnique({
    where: { 
      id: weddingId,
      userId: user.id
    },
    include: {
      events: {
        orderBy: { orderIndex: "asc" }
      }
    }
  });

  if (!wedding) {
    notFound();
  }

  const coupleNames = wedding.coupleNames as { partnerA: string; partnerB: string };
  const theme = wedding.themeConfig as any;

  const initialState: WizardState = {
    partnerA: coupleNames?.partnerA || "",
    partnerB: coupleNames?.partnerB || "",
    weddingDate: new Date(wedding.weddingDate).toISOString().split('T')[0],
    subdomainSlug: wedding.subdomainSlug,
    heroLayout: theme?.heroLayout || ["image", "revealText", "names", "date"],
    heroCustomFields: theme?.heroCustomFields || [],
    heroImageOverlay: theme?.heroImageOverlay,
    events: wedding.events.map(event => ({
      id: event.id,
      name: event.name,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      dressCode: event.dressCode || "",
      outfitImageUrl: event.outfitImageUrl || undefined,
    })),
    story: theme?.story || { title: "", body: "" },
    themeConfig: {
      palette: theme?.palette || "royal-gold",
      fontPairing: theme?.fontPairing || "playfair-inter",
      backgroundImageUrl: theme?.backgroundImageUrl,
      sectionBackgrounds: theme?.sectionBackgrounds,
      sectionOrder: theme?.sectionOrder,
      introVideoUrl: theme?.introVideoUrl,
      openingVideoUrl: theme?.openingVideoUrl,
      ogImageUrl: theme?.ogImageUrl,
      variants: theme?.variants,
      rsvpPhone: theme?.rsvpPhone,
      rsvpGoogleSheetUrl: theme?.rsvpGoogleSheetUrl,
      hideRsvpForm: theme?.hideRsvpForm,
    } as any,
    musicUrl: theme?.musicUrl || "",
    musicType: theme?.musicType || "link",
    revealOverlay: theme?.revealOverlay || { text: "You are Invited", imageUrl: "" },
  };

  return (
    <div className="bg-[#faf6ee] dark:bg-black min-h-screen">
      <WeddingWizard 
        initialState={initialState} 
        isEdit={true} 
        weddingId={weddingId} 
      />
    </div>
  );
}
