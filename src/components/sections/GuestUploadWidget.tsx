"use client";

import { useRef, useState } from "react";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB — S3/R2 multipart minimum part size

type FileProgress = {
  name: string;
  status: "uploading" | "done" | "error";
  percent: number;
};

async function uploadFileInChunks(
  file: File,
  weddingSlug: string,
  guestName: string,
  onProgress: (percent: number) => void,
) {
  const createRes = await fetch("/api/uploads/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weddingSlug,
      guestName,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });
  if (!createRes.ok) throw new Error("Could not start upload");
  const { mediaUploadId, uploadId, key } = await createRes.json();

  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  const parts: { PartNumber: number; ETag: string }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const partNumber = i + 1;
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

    // per-chunk retry — survives flaky venue wifi without restarting the whole file
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const signRes = await fetch("/api/uploads/sign-part", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, uploadId, partNumber }),
        });
        const { url } = await signRes.json();

        const putRes = await fetch(url, { method: "PUT", body: chunk });
        if (!putRes.ok) throw new Error(`chunk ${partNumber} failed`);

        const etag = putRes.headers.get("ETag") ?? "";
        parts.push({ PartNumber: partNumber, ETag: etag });
        lastError = undefined;
        break;
      } catch (err) {
        lastError = err;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    if (lastError) throw lastError;

    onProgress(Math.round(((i + 1) / totalChunks) * 100));
  }

  await fetch("/api/uploads/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaUploadId, key, uploadId, parts }),
  });
}

export function GuestUploadWidget({ weddingSlug }: { weddingSlug: string }) {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<FileProgress[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const selected = Array.from(fileList);
    setFiles(selected.map((f) => ({ name: f.name, status: "uploading", percent: 0 })));

    await Promise.all(
      selected.map(async (file, i) => {
        try {
          await uploadFileInChunks(file, weddingSlug, guestName, (percent) => {
            setFiles((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, percent } : f)),
            );
          });
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "done", percent: 100 } : f)),
          );
        } catch {
          setFiles((prev) => (prev.map((f, idx) => (idx === i ? { ...f, status: "error" } : f))));
        }
      }),
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full rounded-3xl bg-[#fbf7f0]/95 dark:bg-[#161412]/95 backdrop-blur-md p-8 sm:p-10 border border-[#e8dac7]/80 dark:border-neutral-800 shadow-2xl flex flex-col items-center gap-5 text-[#4a3828] dark:text-[#f0e6d6]">
        {/* Pill Tag */}
        <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase bg-[#f3e8d6] dark:bg-neutral-800/80 text-[var(--theme-color,#b8860b)] border border-[#e2d0b8] dark:border-neutral-700">
          • Collect Memories •
        </span>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-black dark:text-white">
            Share Your Photos
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xs mx-auto">
            Help us capture every precious moment! Upload your candid photos &amp; videos to our celebration album.
          </p>
        </div>

        {/* Name input */}
        <div className="w-full text-left space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-medium text-neutral-500 dark:text-neutral-400 pl-1">
            Your Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah & Michael"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 px-4 py-3 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-color,#b8860b)] transition-all shadow-sm"
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {/* Action Button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 px-6 font-medium text-sm text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{ backgroundColor: "var(--theme-color, #b8860b)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span>Upload Photos &amp; Videos ✦</span>
        </button>

        {/* Upload progress list */}
        {files.length > 0 && (
          <ul className="w-full mt-2 space-y-2 text-left text-xs divide-y divide-neutral-200 dark:divide-neutral-800">
            {files.map((f) => (
              <li key={f.name} className="flex items-center justify-between pt-2">
                <span className="truncate max-w-[200px] text-neutral-700 dark:text-neutral-300 font-medium">{f.name}</span>
                <span className="text-[11px] font-semibold text-[var(--theme-color,#b8860b)]">
                  {f.status === "done" ? "✓ Uploaded" : f.status === "error" ? "✕ Failed" : `${f.percent}%`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
