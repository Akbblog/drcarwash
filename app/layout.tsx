import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/app/SessionProvider";
import ResourceHints from "@/components/ResourceHints";
import PrefetchLinks from "@/components/PrefetchLinks";

// Optimize font loading with preload
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: "Family Car Wash | Premium Doorstep Service",
  description: "Premium bi-weekly car care subscription delivered to your doorstep. We wash, you relax. Always drive a clean car again.",
  keywords: ["car wash", "mobile car wash", "doorstep car service", "car detailing", "bi-weekly car care"],
  authors: [{ name: "Family Car Wash" }],
  openGraph: {
    title: "Family Car Wash | Premium Doorstep Service",
    description: "We wash, you relax. Bi-weekly car care subscription.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Car Wash | Premium Doorstep Service",
    description: "We wash, you relax. Bi-weekly car care subscription.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ff3366',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <ResourceHints />
      </head>
      <body className={`${inter.className} antialiased bg-[#0a0a0a] text-white`} suppressHydrationWarning>
        <SessionProvider>
          <PrefetchLinks />
          <Navbar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
