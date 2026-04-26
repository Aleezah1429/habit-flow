import type { Metadata, Viewport } from "next";
import { Outfit, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HabitFlow — Build daily habits",
  description: "A minimal, fast habit tracker. Mark a habit done today, watch your streak grow.",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
