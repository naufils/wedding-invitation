import { NextRequest, NextResponse } from "next/server";
import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { key, uploadId, partNumber } = await req.json();

  if (!key || !uploadId || !partNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const url = await getSignedUrl(
    r2,
    new UploadPartCommand({
      Bucket: R2_BUCKET,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    }),
    { expiresIn: 3600 },
  );

  return NextResponse.json({ url });
}
