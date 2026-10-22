import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  const session = await auth();
  const userEmail = session?.user?.email ?? "dev@local.test";

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingWedding = await prisma.wedding.findFirst({
    where: { id, userId: user.id },
  });

  if (!existingWedding) {
    return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 });
  }

  const body = await req.json();
  const {
    partnerA,
    partnerB,
    weddingDate,
    events,
    story,
    themeConfig,
    musicUrl,
    subdomainSlug,
    revealOverlay,
    heroCustomFields,
    heroImageOverlay,
    heroLayout,
  } = body;

  const baseSlug = subdomainSlug ? slugify(subdomainSlug) : slugify(`${partnerA}${partnerB}`);
  const slug = baseSlug || existingWedding.subdomainSlug;

  // Check if slug is taken by someone else
  if (slug !== existingWedding.subdomainSlug) {
    const slugExists = await prisma.wedding.findUnique({ where: { subdomainSlug: slug } });
    if (slugExists) {
      return NextResponse.json({ error: "Subdomain is already taken" }, { status: 400 });
    }
  }

  try {
    // Delete existing events to replace them with the updated list
    await prisma.event.deleteMany({
      where: { weddingId: id },
    });

    const updatedWedding = await prisma.wedding.update({
      where: { id },
      data: {
        subdomainSlug: slug,
        coupleNames: { partnerA, partnerB },
        weddingDate: new Date(weddingDate),
        status: "published",
        themeConfig: {
          ...(themeConfig ?? { palette: "royal-gold", fontPairing: "playfair-inter" }),
          story,
          musicUrl,
          musicType: body.musicType,
          revealOverlay,
          heroCustomFields,
          heroImageOverlay,
          heroLayout,
        },
        events: {
          create: (events ?? []).map((event: Record<string, unknown>, i: number) => ({
            id: (event.id as string) || undefined,
            name: (event.name as string) || `Event ${i + 1}`,
            date: event.date ? new Date(event.date as string) : new Date(weddingDate),
            time: (event.time as string) || "00:00",
            venueName: (event.venueName as string) || "TBD",
            venueAddress: (event.venueAddress as string) || "TBD",
            dressCode: event.dressCode || null,
            outfitImageUrl: event.outfitImageUrl || null,
            orderIndex: i,
          })),
        },
      },
    });

    return NextResponse.json({ id: updatedWedding.id, subdomainSlug: updatedWedding.subdomainSlug });
  } catch (err: any) {
    console.error("[PUT /api/weddings/:id] Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Database error — could not save wedding" },
      { status: 500 }
    );
  }
}
