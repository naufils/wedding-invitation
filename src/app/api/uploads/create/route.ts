import { NextRequest, NextResponse } from "next/server";
import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { weddingSlug, guestName, fileName, fileType, fileSize } = await req.json();

  if (!weddingSlug || !fileName || !fileType || !fileSize) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const wedding = await prisma.wedding.findUnique({ where: { subdomainSlug: weddingSlug } });
  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  const key = `weddings/${wedding.id}/guest-uploads/${Date.now()}-${fileName}`;
  const mediaType = fileType.startsWith("video/") ? "video" : "image";

  const multipart = await r2.send(
    new CreateMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: fileType,
    }),
  );

  const mediaUpload = await prisma.mediaUpload.create({
    data: {
      weddingId: wedding.id,
      uploadedByGuestName: guestName || "Guest",
      fileType: mediaType,
      storageKey: key,
      driveSyncStatus: "pending",
      fileSize: Number(fileSize),
    },
  });

  return NextResponse.json({
    mediaUploadId: mediaUpload.id,
    uploadId: multipart.UploadId,
    key,
  });
}
