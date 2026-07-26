import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f3eee4",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Omer Portnoy | Software Engineer",
      template: "%s | Omer Portnoy",
    },
    description:
      "Omer Portnoy engineers practical full-stack products, AI prototypes, backend systems, and automation workflows.",
    applicationName: "Omer Portnoy Portfolio",
    authors: [{ name: "Omer Portnoy" }],
    creator: "Omer Portnoy",
    category: "technology",
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    keywords: [
      "software engineer",
      "full-stack developer",
      "AI engineer",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "portfolio",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Omer Portnoy",
      title: "Omer Portnoy | Software Engineer",
      description:
        "Practical products where AI, backend systems, and thoughtful interfaces meet.",
      images: [
        {
          url: "/og-portfolio.png",
          width: 1200,
          height: 630,
          alt: "Omer Portnoy — Software Engineer, Full-stack, AI, and Automation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Omer Portnoy | Software Engineer",
      description:
        "Practical products where AI, backend systems, and thoughtful interfaces meet.",
      images: ["/og-portfolio.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
