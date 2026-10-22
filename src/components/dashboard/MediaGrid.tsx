"use client";

import { useState } from "react";

type MediaUpload = {
  id: string;
  storageKey: string;
  fileType: string;
  driveSyncStatus: string;
  uploadedByGuestName: string;
  createdAt: Date;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  synced: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export function MediaGrid({ mediaUploads }: { mediaUploads: MediaUpload[] }) {
  const [retrying, setRetrying] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(mediaUploads.map((m) => [m.id, m.driveSyncStatus])),
  );

  async function handleRetry(id: string) {
    setRetrying(id);
    try {
      await fetch(`/api/uploads/${id}/retry`, { method: "POST" });
      setStatuses((prev) => ({ ...prev, [id]: "pending" }));
    } finally {
      setRetrying(null);
    }
  }

  if (mediaUploads.length === 0) {
    return <p className="text-sm text-neutral-500">No guest uploads yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {mediaUploads.map((media) => {
        const status = statuses[media.id];
        return (
          <div key={media.id} className="rounded border border-neutral-200 p-3 text-sm">
            <p className="truncate font-medium">{media.storageKey.split("/").pop()}</p>
            <p className="text-xs text-neutral-500">by {media.uploadedByGuestName}</p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[status] ?? ""}`}
            >
              {status}
            </span>
            {status === "failed" && (
              <button
                type="button"
                onClick={() => handleRetry(media.id)}
                disabled={retrying === media.id}
                className="mt-2 block text-xs text-[#b8860b] underline disabled:opacity-50"
              >
                {retrying === media.id ? "Retrying…" : "Retry sync"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
