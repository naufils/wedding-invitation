import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes, Cinzel, Cormorant_Garamond, Amiri, Pinyon_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-fancy",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://evermint.vercel.app";
};

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "You are Invited | Wedding of Haseeb & Adeeba",
    template: "%s | Wedding of Haseeb & Adeeba",
  },
  description: "You are invited to the wedding of Haseeb and Adeeba. Join us in celebrating our 8-day wedding festivities from 25th October to 1st November 2026.",
  applicationName: "Wedding of Haseeb & Adeeba",
  authors: [{ name: "Haseeb & Adeeba" }],
  creator: "Haseeb & Adeeba",
  publisher: "Evermint",
  openGraph: {
    title: "Wedding of Haseeb & Adeeba",
    description: "You are invited to the wedding of Haseeb and Adeeba. View our 8-day celebration itinerary, ceremonies & venue details.",
    url: siteUrl,
    siteName: "Wedding of Haseeb & Adeeba",
    locale: "en_US",
    type: "website",
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
    description: "You are invited to the wedding of Haseeb and Adeeba. View our 8-day celebration itinerary, ceremonies & venue details.",
    images: ["/og-wedding-banner.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/wedding-schedule/cover-card.jpg",
  },
  other: {
    "theme-color": "#18110b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${pinyonScript.variable} ${cinzel.variable} ${cormorantGaramond.variable} ${amiri.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Great+Vibes&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
