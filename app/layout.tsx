import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parizah Vogue | Elegant Dresses & Fashion Store",
  description:
    "Discover the latest collection of elegant dresses, timeless fashion, and modern styles at Parizah Vogue. Shop high-quality apparel designed for every occasion.",
  generator: "Next.js",
  keywords: [
    "Parizah Vogue",
    "fashion store",
    "women's dresses",
    "clothing",
    "ecommerce",
    "boutique",
    "party dresses",
    "formal wear",
    "trendy outfits",
    "online shopping",
  ],
  authors: [{ name: "Parizah Vogue" }],
  openGraph: {
    title: "Parizah Vogue | Elegant Dresses & Fashion Store",
    description:
      "Explore our curated collection of stylish dresses and apparel. Shop online at Parizah Vogue for modern, chic, and timeless fashion.",
    url: "https://parizahvogue.com", // replace with your domain
    siteName: "Parizah Vogue",
    images: [
      {
        url: "https://parizahvogue.com/og-image.jpg", // add your banner/OG image
        width: 1200,
        height: 630,
        alt: "Parizah Vogue - Fashion Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parizah Vogue | Elegant Dresses & Fashion Store",
    description:
      "Shop stylish and elegant dresses online. Discover fashion designed for every occasion at Parizah Vogue.",
    images: ["https://parizahvogue.com/og-image.jpg"], // same OG image
    creator: "@parizahvogue", // replace with your handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
