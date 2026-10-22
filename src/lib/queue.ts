import { Queue } from "bullmq";

const parsed = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");

export const redisConnection = {
  host: parsed.hostname,
  port: Number(parsed.port || 6379),
  password: parsed.password || undefined,
  maxRetriesPerRequest: null as null,
};

export const driveSyncQueue = new Queue("drive-sync", { connection: redisConnection });

export type DriveSyncJobData = { mediaUploadId: string };
