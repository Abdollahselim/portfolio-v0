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
  title: "Portfolio Pro",
  description: "A production-grade developer portfolio system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
