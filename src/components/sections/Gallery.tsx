"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { GalleryPhoto } from "@/types/content";

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  if (photos.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="mb-8 text-center font-serif text-3xl">Gallery</h2>
      <div className="columns-2 gap-3 sm:columns-3">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.id}
            type="button"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            onClick={() => setLightboxPhoto(photo)}
            className="mb-3 block w-full overflow-hidden rounded"
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? ""}
              width={400}
              height={400}
              className="h-auto w-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
        >
          <Image
            src={lightboxPhoto.url}
            alt={lightboxPhoto.caption ?? ""}
            width={1200}
            height={1200}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
