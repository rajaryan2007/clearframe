import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";

const jetbrainsMonoHeading = JetBrains_Mono({ subsets: ['latin'], variable: '--font-heading' });

const raleway = Raleway({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: 'ClearFrame',
  description: 'INFORMATION EXTRACTOR',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", raleway.variable, jetbrainsMonoHeading.variable)}
      >
        <body className="min-h-full flex flex-col bg-black text-white selection:bg-primary/30">
          <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <div className="w-full max-w-7xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
              <Navbar />
            </div>
          </header>
          <main className="relative flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
