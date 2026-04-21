import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Container, Footer, Navbar } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Abdullah Selim — E-Commerce Web Developer",
    template: "%s | Abdullah Selim",
  },
  description:
    "E-commerce web developer with 4+ years delivering high-performing stores across WordPress, Shopify, Salla, and Zid. Based in Mansoura, Egypt.",
  keywords: [
    "e-commerce developer",
    "WordPress",
    "Shopify",
    "Salla",
    "Zid",
    "web developer Egypt",
    "Next.js developer",
  ],
  authors: [{ name: "Abdullah Selim" }],
  creator: "Abdullah Selim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "Abdullah Selim",
    title: "Abdullah Selim — E-Commerce Web Developer",
    description:
      "E-commerce web developer with 4+ years delivering high-performing stores across WordPress, Shopify, Salla, and Zid. Based in Mansoura, Egypt.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdullah Selim — E-Commerce Web Developer",
    description:
      "E-commerce web developer with 4+ years delivering high-performing stores across WordPress, Shopify, Salla, and Zid. Based in Mansoura, Egypt.",
    creator: "@abdullahselim",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Container>
          <Navbar />
          {children}
          <Footer />
        </Container>
      </body>
    </html>
  );
}
