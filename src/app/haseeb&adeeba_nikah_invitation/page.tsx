import type { Metadata } from "next";
import { NikahInvitation } from "@/components/wedding-schedule/NikahInvitation";

export const metadata: Metadata = {
  title: "Haseeb & Adeeba — Nikkah Ceremony Invitation | 29 Oct 2026",
  description:
    "Join us in celebrating the sacred union and Nikkah Ceremony of Shaikh Haseeb & Adeeba Afreen on 29th October 2026 at Ellora Lawns, Aurangabad.",
  openGraph: {
    title: "Haseeb & Adeeba — Nikkah Ceremony Invitation",
    description:
      "Join us in celebrating the Nikkah Ceremony of Shaikh Haseeb & Adeeba Afreen on Thursday, 29th October 2026.",
    url: "https://evermint.vercel.app/haseeb&adeeba_nikah_invitation",
    type: "website",
    images: [
      {
        url: "https://evermint.vercel.app/og-wedding-banner.jpg",
        secureUrl: "https://evermint.vercel.app/og-wedding-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Haseeb & Adeeba Nikkah Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haseeb & Adeeba — Nikkah Ceremony Invitation",
    description:
      "Join us in celebrating the Nikkah Ceremony of Shaikh Haseeb & Adeeba Afreen on Thursday, 29th October 2026.",
    images: ["https://evermint.vercel.app/og-wedding-banner.jpg"],
  },
};

export default function HaseebAdeebaNikahInvitationPage() {
  return <NikahInvitation />;
}
