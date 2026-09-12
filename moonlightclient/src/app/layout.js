import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import '@fontsource-variable/unbounded/wght.css';
import '@fontsource/gugi';
import '@fontsource/kalam';
import '@fontsource/sniglet';
import '@fontsource/dm-serif-text';
import Queryprovider from "@/services/provider/Queryprovider";
import Script from 'next/script';
import Floating from "@/component/home/floating/Floating";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.moonlightmachinery.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Moonlight Machinery, Gourgaon - Manufacturer of Paper Plate Making Machine and Dona Making Machine",
  },
  description:
    "Manufacturer of Paper Plate Making Machine, Dona Making Machine & Fully Automatic Paper Plate Making Machine offered by Moonlight Machinery from Gourgaon, Delhi, India",
  keywords: [
    "Paper Plate Making Machine",
    "Dona Making Machine",
    "Fully Automatic Paper Plate Making Machine",
    "Fully Automatic Dona Making Machine",
    "Hydraulic Paper Plate Making Machine",
    "Automatic Buffet Plate Making Machine",
    "Camphor Machine",
    "Moonlight Machinery",
    "Gurgaon",
    "Delhi",
    "India",
    "Siliguri",
    "West Bengal",
    "Gossaigaon",
    "Assam",
    "Gaziabad",
    "Noida",
    "Uttar Pradesh",
  ],
  authors: [{ name: "Moonlight Machinery" }],
  creator: "Moonlight Machinery",
  publisher: "Moonlight Machinery",

  // Canonical — must be a plain URL, not markdown
  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Moonlight Machinery",
    title: "Moonlight Machinery, Gourgaon - Manufacturer of Paper Plate Making Machine and Dona Making Machine",
    description:
      "Manufacturer of Paper Plate Making Machine, Dona Making Machine & Fully Automatic Paper Plate Making Machine offered by Moonlight Machinery from Gourgaon, Delhi, India",
    locale: "en_IN",
    images: [
      {
        url: "/android-chrome-512x512.png", // add a real 1200x630 image to /public
        width: 512,
        height: 512,
        alt: "Moonlight Machinery - Areca Leaf Plate Manufacturer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Moonlight Machinery, Gourgaon - Manufacturer of Paper Plate Making Machine and Dona Making Machine",
    description:
      "Manufacturer of Paper Plate Making Machine, Dona Making Machine & Fully Automatic Paper Plate Making Machine offered by Moonlight Machinery from Gourgaon, Delhi, India",
    images: ["/android-chrome-512x512.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  // This is the CORRECT way to add Google Search Console verification —
  // Next.js injects it into the real <head> automatically.
  verification: {
    google: "dIX2GPKVpfk8ZfH7slDv4gi69yJSFUftjATSqnlFGxU",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f5",
};

// JSON-LD structured data — this is what Lighthouse's "Structured data is valid"
// check and Google's Rich Results Test look for.
// const organizationJsonLd = {
//   "@context": "https://schema.org",
//   "@type": "Organization",
//   name: "Moonlight Machinery",
//   url: SITE_URL,
//   logo: `${SITE_URL}/favicon-32x32.png`,
//   description:
//     "Manufacturer of Paper Plate Making Machine, Dona Making Machine & Fully Automatic Paper Plate Making Machine offered by Moonlight Machinery from Gourgaon, Delhi, India",
//   address: {
//     "@type": "PostalAddress",
//     addressCountry: "IN",
//     streetAddress: "Plot -13,Ram Vihar,Dhanwapur Road,Sector-104",
//     addressLocality: "Gurgaon",
//     addressRegion: "Haryana",
//     postalCode: "122001",
//     // add streetAddress, addressLocality, addressRegion, postalCode if available
//   },
//   contactPoint: {
//     "@type": "ContactPoint",
//     contactType: "customer service",
//     areaServed: "IN",
//     availableLanguage: ["en", "hi"],
//     telephone: "+91-8178445596",
//     // telephone: "+91-XXXXXXXXXX",
//   },
//   sameAs: [
//     "https://www.facebook.com/people/Moonlight-machinery/100068148668790/",
//     "https://www.instagram.com/moonlightmachinery",
//     "https://www.youtube.com/@moonlightmachinery6670?si=1W37CtkGFkI7vX7A",
//     // "https://www.instagram.com/yourpage",
//   ],
// };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#faf9f5] flex flex-col">
        {/* GTM — beforeInteractive scripts are auto-hoisted into <head> by Next.js */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5ZKB7HST');
            `,
          }}
        />



        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZKB7HST"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Floating/>
        <Queryprovider>{children}</Queryprovider>
      </body>
    </html>
  );
}
