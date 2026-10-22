import { WeddingSchedule } from "@/components/wedding-schedule/WeddingSchedule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Functions Schedule | Haseeb & Adeeba",
  description: "You are invited to the wedding of Haseeb and Adeeba. Eight-day celebration itinerary from Rajjaga to the Grand Reception.",
  openGraph: {
    title: "Wedding of Haseeb & Adeeba | Functions Schedule",
    description: "You are invited to the wedding of Haseeb and Adeeba. View our eight-day celebration itinerary from Rajjaga to the Grand Reception.",
    url: "/schedule",
    siteName: "Wedding of Haseeb & Adeeba",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "You are invited to the wedding of Haseeb and Adeeba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding of Haseeb & Adeeba | Functions Schedule",
    description: "You are invited to the wedding of Haseeb and Adeeba. View our eight-day celebration itinerary from Rajjaga to the Grand Reception.",
    images: ["/og-image.jpg"],
  },
};

export default function SchedulePage() {
  return <WeddingSchedule />;
}
