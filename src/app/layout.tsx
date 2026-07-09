import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { profile } from "@/lib/data";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Update this to your real domain before deploying — OG/canonical URLs resolve against it.
const siteUrl = "https://mohamed-shahin.vercel.app";
const title = "Mohamed Shahin M — Full-Stack Developer & Dynamics 365 CRM";
const description =
  "Freelance full-stack developer working across Microsoft Dynamics 365 CRM, the Power Platform, and full-stack web & mobile development with React, Node.js, and Flutter.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Mohamed Shahin — Portfolio",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "Mohamed Shahin",
    "Freelance Developer",
    "Full-Stack Developer",
    "Dynamics 365",
    "Power Platform",
    "Power Pages",
    "Azure Functions",
    "React",
    "Node.js",
    "Flutter Developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: title,
    title,
    description,
    firstName: "Mohamed",
    lastName: "Shahin M",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressCountry: "India",
  },
  sameAs: [profile.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Ponnaiyah Ramajayam Institute of Science and Technology",
  },
  knowsAbout: [
    "Microsoft Dynamics 365",
    "Power Platform",
    "Power Pages",
    "Azure Functions",
    "Power BI",
    "Flutter",
    "React",
    "Node.js",
  ],
  hasCredential: [
    "Microsoft Power BI Data Analyst Associate (PL-300)",
    "Microsoft Power Platform Developer Associate (PL-400)",
    "Microsoft Power Platform Fundamentals (PL-900)",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
