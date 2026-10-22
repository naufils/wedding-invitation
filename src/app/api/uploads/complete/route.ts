import { NextRequest, NextResponse } from "next/server";
import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";
import { driveSyncQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const { mediaUploadId, key, uploadId, parts } = await req.json();

  if (!mediaUploadId || !key || !uploadId || !Array.isArray(parts)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await r2.send(
    new CompleteMultipartUploadCommand({
      Bucket: R2_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    }),
  );

  // R2 copy is durable the moment this resolves — Drive sync below is a convenience
  // best-effort push, never the sole copy. Failure here must never undo the upload.
  await driveSyncQueue.add("sync", { mediaUploadId }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });

  return NextResponse.json({ ok: true });
}
