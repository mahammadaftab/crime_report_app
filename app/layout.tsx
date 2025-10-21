import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "../components/LayoutClient";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // better font loading
});

export const metadata: Metadata = {
  title: "SafeReport - Anonymous Crime Reporting",
  description: "Securely and anonymously report crimes to law enforcement",
  keywords: [
    "crime report",
    "anonymous reporting",
    "safe community",
    "law enforcement",
  ],
  openGraph: {
    title: "SafeReport - Anonymous Crime Reporting",
    description: "Securely and anonymously report crimes to law enforcement",
    url: "https://safereport.app",
    siteName: "SafeReport",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SafeReport Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeReport - Anonymous Crime Reporting",
    description: "Report crimes securely and anonymously.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-black text-white antialiased selection:bg-sky-500/20`}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}