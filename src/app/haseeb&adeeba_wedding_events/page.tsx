import type { Metadata } from "next";
import { WeddingSchedule } from "@/components/wedding-schedule/WeddingSchedule";

export const metadata: Metadata = {
  title: "Haseeb & Adeeba — Wedding Schedule | 25 Oct – 1 Nov 2026",
  description:
    "Join us in celebrating the sacred union and wedding festivities of Shaikh Haseeb & Adeeba Afreen from 25th October to 1st November 2026.",
  openGraph: {
    title: "Haseeb & Adeeba — Wedding Invitation & Schedule",
    description:
      "Join us in celebrating the wedding festivities of Shaikh Haseeb & Adeeba Afreen (25th Oct – 1st Nov 2026).",
    url: "https://evermint.vercel.app/haseeb&adeeba_wedding_events",
    type: "website",
    images: [
      {
        url: "https://evermint.vercel.app/og-wedding-banner.jpg",
        secureUrl: "https://evermint.vercel.app/og-wedding-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Haseeb & Adeeba Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haseeb & Adeeba — Wedding Invitation & Schedule",
    description:
      "Join us in celebrating the wedding festivities of Shaikh Haseeb & Adeeba Afreen (25th Oct – 1st Nov 2026).",
    images: ["https://evermint.vercel.app/og-wedding-banner.jpg"],
  },
};

export default function HaseebAdeebaWeddingEventsPage() {
  return <WeddingSchedule />;
}
