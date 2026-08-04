import ProductShowcase from '@/component/home/main/Listproduct'
import Mview from '@/component/machine/Mview'
import React from 'react'

export const metadata = {
  title: "Paper Plate Making Machines in India - Hydraulic, Semi-Automatic & Panel Machines | Moonlight Machinery",
  description: "Shop hydraulic single & double cylinder paper plate making machines, dona making machines & lamination machines in India. Genuine machines, best price, PAN-India shipping. Get a quote today.",
  keywords: [
    "paper plate making machine India",
    "hydraulic paper plate machine price",
    "buy paper plate making machine online",
    "hydraulic single cylinder paper plate machine",
    "hydraulic double cylinder paper plate machine",
    "dona making machine",
    "lamination machine India",
    "paper plate machine for sale India",
  ],
  openGraph: {
    title: "Paper Plate Making Machines in India | Moonlight Machinery",
    description: "Hydraulic single & double cylinder paper plate making machines, dona making machines & lamination machines. Genuine machines, best price, PAN-India shipping.",
    url: "https://www.moonlightmachinery.com/home/machines",
    siteName: "Moonlight Machinery",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Plate Making Machines in India | Moonlight Machinery",
    description: "Hydraulic single & double cylinder paper plate making machines, dona making machines & lamination machines in India.",
  },
  alternates: {
    canonical: "https://www.moonlightmachinery.com/home/machines",
  },
};
export default function page() {
  const show = false
  return (
    <div className='w-full flex justify-center py-16'>
      <ProductShowcase view={show} />
    </div>
  )
}