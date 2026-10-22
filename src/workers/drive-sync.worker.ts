import { Worker } from "bullmq";
import { Readable } from "stream";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { google } from "googleapis";
import { r2, R2_BUCKET } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { redisConnection, DriveSyncJobData } from "@/lib/queue";
import { getDriveOAuthClient } from "@/lib/google-drive";
import { decryptToken } from "@/lib/crypto";

async function syncMediaUploadToDrive(mediaUploadId: string) {
  const mediaUpload = await prisma.mediaUpload.findUnique({ where: { id: mediaUploadId } });
  if (!mediaUpload) return;

  const wedding = await prisma.wedding.findUnique({ where: { id: mediaUpload.weddingId } });
  if (!wedding?.driveRefreshToken || !wedding.driveFolderId) {
    await prisma.mediaUpload.update({
      where: { id: mediaUploadId },
      data: { driveSyncStatus: "failed" },
    });
    return;
  }

  const client = getDriveOAuthClient();
  client.setCredentials({ refresh_token: decryptToken(wedding.driveRefreshToken) });

  const object = await r2.send(
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: mediaUpload.storageKey }),
  );
  const body = object.Body as Readable;

  const drive = google.drive({ version: "v3", auth: client });
  const fileName = mediaUpload.storageKey.split("/").pop() ?? mediaUploadId;

  const uploaded = await drive.files.create({
    requestBody: { name: fileName, parents: [wedding.driveFolderId] },
    media: { mimeType: object.ContentType, body },
    fields: "id",
  });

  await prisma.mediaUpload.update({
    where: { id: mediaUploadId },
    data: { driveSyncStatus: "synced", driveFileId: uploaded.data.id },
  });
}

export const driveSyncWorker = new Worker<DriveSyncJobData>(
  "drive-sync",
  async (job) => {
    try {
      await syncMediaUploadToDrive(job.data.mediaUploadId);
    } catch (err) {
      await prisma.mediaUpload.update({
        where: { id: job.data.mediaUploadId },
        data: { driveSyncStatus: "failed" },
      });
      throw err;
    }
  },
  { connection: redisConnection },
);
