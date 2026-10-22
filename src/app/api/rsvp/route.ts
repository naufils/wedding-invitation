import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttendingStatus } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { weddingSlug, guestName, phoneOrEmail, attendingStatus, eventIds, guestCount, dietaryNotes } = body;

  if (!weddingSlug || !guestName || !phoneOrEmail || !attendingStatus) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const wedding = await prisma.wedding.findUnique({
    where: { subdomainSlug: weddingSlug },
  });

  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  const rsvp = await prisma.rsvp.create({
    data: {
      weddingId: wedding.id,
      guestName,
      phoneOrEmail,
      attendingStatus: attendingStatus as AttendingStatus,
      eventIds: Array.isArray(eventIds) ? eventIds : [],
      guestCount: Number(guestCount) || 1,
      dietaryNotes: dietaryNotes || null,
    },
  });

  return NextResponse.json({ id: rsvp.id }, { status: 201 });
}
