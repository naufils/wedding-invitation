"use client";

import { motion } from "framer-motion";
import { InvitationBlock } from "@/types/wizard";

export function StorySection({
  title,
  body,
  blocks,
}: {
  title: string;
  body: string;
  blocks?: InvitationBlock[];
}) {
  // Prefer blocks if present
  if (blocks && blocks.length > 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto px-6 py-16 flex flex-col gap-5"
      >
        {blocks.map((block) => {
          const alignClass =
            block.align === "left"
              ? "text-left items-start"
              : block.align === "right"
              ? "text-right items-end"
              : "text-center items-center";

          if (block.type === "image" && block.value) {
            return (
              <div key={block.id} className={`flex w-full ${alignClass}`}>
                <img
                  src={block.value}
                  alt=""
                  className="max-w-full max-h-64 object-contain rounded-xl shadow-md"
                />
              </div>
            );
          }

          if (!block.value) return null;

          return (
            <p
              key={block.id}
              className={`leading-relaxed ${alignClass}`}
              style={{
                fontSize: block.fontSize ?? (block.type === "heading" ? 28 : 16),
                fontWeight: block.bold ? 700 : 400,
                fontStyle: block.italic ? "italic" : "normal",
                fontFamily: block.type === "heading" ? "var(--font-fancy, serif)" : undefined,
              }}
            >
              {block.value}
            </p>
          );
        })}
      </motion.section>
    );
  }

  // Fallback: legacy title/body
  if (!title && !body) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto max-w-2xl px-6 py-16 text-center"
    >
      {title && <h2 className="mb-4 font-serif text-3xl">{title}</h2>}
      {body && <p className="text-base leading-relaxed text-neutral-700">{body}</p>}
    </motion.section>
  );
}
