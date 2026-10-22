import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(req: NextRequest) {
  const { fileName, fileType } = await req.json();

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const isVideo = fileType.startsWith("video/");
  const folder = isVideo ? "reveal-videos" : "reveal-assets";
  const key = `${folder}/${Date.now()}-${fileName}`;

  if (!R2_BUCKET) {
    return NextResponse.json({ 
      uploadUrl: `/api/uploads/local-upload?key=${encodeURIComponent(key)}`, 
      publicUrl: `/uploads/${key}` 
    });
  }

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: fileType }),
    { expiresIn: 3600 }, // 1 hour for larger video files
  );

  const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl });
}
