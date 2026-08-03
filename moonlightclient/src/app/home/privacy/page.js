import React from 'react';
import PrivacyPolicy from './Privacy';

export const metadata = {
  title: "Privacy Policy | Moonlight Machinery",
  description: "Read Moonlight Machinery's privacy policy to understand how we collect, use, and protect your personal information when you use our website or purchase our machines.",
  alternates: {
    canonical: "https://www.moonlightmachinery.com/home/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Moonlight Machinery",
    description: "How Moonlight Machinery collects, uses, and protects your personal information.",
    url: "https://www.moonlightmachinery.com/home/privacy",
    siteName: "Moonlight Machinery",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <div>
      <PrivacyPolicy/>
    </div>
  )
}