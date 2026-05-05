import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const copy = getDictionary(lang as "en" | "ko");
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
