import "./globals.css";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/AppHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EncodeFlow",
  description: "A platform for encoding and streaming videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans dark", inter.variable)}>
      <body className={geist.className}>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
