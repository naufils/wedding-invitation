import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { driveSyncQueue } from "@/lib/queue";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const mediaUpload = await prisma.mediaUpload.findUnique({ where: { id } });
  if (!mediaUpload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.mediaUpload.update({ where: { id }, data: { driveSyncStatus: "pending" } });
  await driveSyncQueue.add(
    "sync",
    { mediaUploadId: id },
    { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
  );

  return NextResponse.json({ ok: true });
}
