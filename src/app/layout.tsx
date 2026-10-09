import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "MemGuard | AI Memory Security",
  description: "Zero-Trust Memory Security Layer for Autonomous AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${dmMono.variable}`}>
      <body className="min-h-screen bg-[#0b0a0d] font-sans text-[#f4f3f6] antialiased">
        <div className="mg-backdrop" aria-hidden />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
