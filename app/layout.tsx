import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppSessionProvider from "./SessionProvider";
import { auth } from "@/auth"; // Correct NextAuth v5 import
import AuthProvider from "./actions/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family Car Wash | Premium Doorstep Service",
  description: "We wash, you relax. Bi-weekly car care subscription.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // fetch session server-side

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#0a0a0a] text-white`}>
        <AppSessionProvider session={session}>
        <AuthProvider>
          <Navbar />
          <div className="pt-[80px] min-h-[calc(100vh-1px)] flex flex-col justify-between">
            <div>{children}</div>
            <Footer />
          </div>
        </AuthProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
