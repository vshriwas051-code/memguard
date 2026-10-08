import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#060B14] text-slate-50 flex h-screen overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#0B1121] border-t border-l border-slate-800/50 rounded-tl-2xl shadow-xl">
          {children}
        </main>
      </body>
    </html>
  );
}
