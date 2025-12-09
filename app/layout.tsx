import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: "Parizah Vogue - বাংলাদেশে পাকিস্তান থেকে আমদানিকৃত ড্রেস | Parizah Vogue",
  description: "পাকিস্তান থেকে আমদানিকৃত উচ্চমানের ড্রেস, শাড়ি এবং পার্টি ওয়্যার কিনুন। Parizah Vogue - ফ্যাশনের নতুন সংজ্ঞা। Best dresses imported from Pakistan in Bangladesh.",
  keywords: ["পাকিস্তান ড্রেস", "আমদানিকৃত ড্রেস", "বাংলাদেশ ফ্যাশন", "পার্টি ড্রেস", "শাড়ি", "উচ্চমানের কাপড়", "Parizah Vogue", "Pakistan dresses Bangladesh", "imported dresses", "fashion Bangladesh"],
  authors: [{ name: "Parizah Vogue" }],
  creator: "Parizah Vogue",
  publisher: "Parizah Vogue",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://parizah-vogue.muazdev.site'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Parizah Vogue - পাকিস্তান থেকে আমদানিকৃত ড্রেস",
    description: "পাকিস্তান থেকে আমদানিকৃত উচ্চমানের ড্রেস এবং পার্টি ওয়্যার। ফ্যাশনের নতুন সংজ্ঞা।",
    url: 'https://parizah-vogue.muazdev.site',
    siteName: 'Parizah Vogue',
    images: [
      {
        url: '/og-image.jpg', // Add this image to public folder
        width: 1200,
        height: 630,
        alt: 'Parizah Vogue - Fashion Redefined',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Parizah Vogue - পাকিস্তান থেকে আমদানিকৃত ড্রেস",
    description: "পাকিস্তান থেকে আমদানিকৃত উচ্চমানের ড্রেস এবং পার্টি ওয়্যার।",
    images: ['/og-image.jpg'],
    creator: '@parizahvogue', // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // Add your verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
