import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
}

export async function POST(req: NextRequest) {
  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  // Anyone reaching this endpoint publishes under the same dev@local.test account.
  // Re-add the NODE_ENV production check here once GOOGLE_CLIENT_ID/SECRET are real.
  const session = await auth();
  const userEmail = session?.user?.email ?? "dev@local.test";
  const userName = session?.user?.name ?? "Dev User";

  const body = await req.json();
  const {
    partnerA: rawPartnerA,
    partnerB: rawPartnerB,
    weddingDate: rawWeddingDate,
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

  // field validation bypassed for now — fill sensible defaults for anything left blank
  // so the flow can be tested end-to-end without filling in every step.
  const partnerA = rawPartnerA || "Partner A";
  const partnerB = rawPartnerB || "Partner B";
  const weddingDate = rawWeddingDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: userName ?? undefined,
      authProvider: "google",
    },
  });

  const baseSlug = subdomainSlug ? slugify(subdomainSlug) : slugify(`${partnerA}${partnerB}`);
  const slug = baseSlug || `wedding${Date.now()}`;

  const wedding = await prisma.wedding.create({
    data: {
      userId: user.id,
      subdomainSlug: slug,
      coupleNames: { partnerA, partnerB },
      weddingDate: new Date(weddingDate),
      themeConfig: themeConfig ?? { palette: "royal-gold", fontPairing: "playfair-inter" },
      // payment gate bypassed for now — publish immediately on save
      status: "published",
      paymentStatus: "unpaid",
      events: {
        create: (events ?? []).map((event: Record<string, unknown>, i: number) => ({
          name: (event.name as string) || `Event ${i + 1}`,
          date: event.date ? new Date(event.date as string) : new Date(weddingDate),
          time: (event.time as string) || "00:00",
          venueName: (event.venueName as string) || "TBD",
          venueAddress: (event.venueAddress as string) || "TBD",
          dressCode: event.dressCode || null,
          orderIndex: i,
        })),
      },
    },
    include: { events: true },
  });

  // story/musicUrl stored inside themeConfig-adjacent JSON for now (Phase1 content pipeline
  // reads a flat WeddingContent shape; a dedicated column can be split out later if it grows).
  await prisma.wedding.update({
    where: { id: wedding.id },
    data: {
      themeConfig: {
        ...(themeConfig ?? { palette: "royal-gold", fontPairing: "playfair-inter" }),
        story,
        musicUrl,
        revealOverlay,
        heroCustomFields,
        heroImageOverlay,
        heroLayout,
      },
    },
  });

  return NextResponse.json({ id: wedding.id, subdomainSlug: wedding.subdomainSlug }, { status: 201 });
}
