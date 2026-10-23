import type { Metadata } from "next";
import { NikahInvitation } from "@/components/wedding-schedule/NikahInvitation";

export const metadata: Metadata = {
  title: {
    absolute: "Nikkah Ceremony of Haseeb & Adeeba",
  },
  description:
    "You are cordially invited to witness and bless the sacred Nikkah union of Shaikh Haseeb and Adeeba Afreen on Thursday, 29th October 2026 at Ellora Lawns, Aurangabad.",
  openGraph: {
    title: "Nikkah Ceremony of Haseeb & Adeeba",
    description:
      "You are cordially invited to witness and bless the sacred Nikkah union of Shaikh Haseeb and Adeeba Afreen on Thursday, 29th October 2026 at Ellora Lawns, Aurangabad.",
    url: "https://evermint.vercel.app/haseeb&adeeba_nikah_invitation",
    siteName: "Nikkah Ceremony of Haseeb & Adeeba",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://evermint.vercel.app/og-wedding-banner.jpg",
        secureUrl: "https://evermint.vercel.app/og-wedding-banner.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Nikkah Ceremony of Haseeb & Adeeba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikkah Ceremony of Haseeb & Adeeba",
    description:
      "You are cordially invited to witness and bless the sacred Nikkah union of Shaikh Haseeb and Adeeba Afreen on Thursday, 29th October 2026 at Ellora Lawns, Aurangabad.",
    images: ["https://evermint.vercel.app/og-wedding-banner.jpg"],
  },
};

export default function HaseebAdeebaNikahInvitationPage() {
  return <NikahInvitation />;
}
