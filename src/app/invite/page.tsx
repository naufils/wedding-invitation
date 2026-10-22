import { WeddingSchedule } from "@/components/wedding-schedule/WeddingSchedule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding of Haseeb & Adeeba | 25 Oct – 1 Nov 2026",
  description: "You are invited to the wedding of Haseeb and Adeeba. Join us in celebrating our 8-day wedding festivities from 25th October to 1st November 2026.",
  openGraph: {
    title: "Wedding of Haseeb & Adeeba",
    description: "You are invited to the wedding of Haseeb and Adeeba. Join us in celebrating our 8-day wedding festivities from 25th October to 1st November 2026.",
    siteName: "Wedding of Haseeb & Adeeba",
    images: [
      {
        url: "/og-wedding-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "You are invited to the wedding of Haseeb and Adeeba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding of Haseeb & Adeeba",
    description: "You are invited to the wedding of Haseeb and Adeeba. Join us in celebrating our 8-day wedding festivities.",
    images: ["/og-wedding-banner.jpg"],
  },
};

export default function InvitePage() {
  return <WeddingSchedule />;
}
