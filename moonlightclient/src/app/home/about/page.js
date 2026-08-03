import React from 'react'
import About from './AboutDesign';

export const metadata = {
  title: "About Us - 14 Years of Machinery Manufacturing | Moonlight Machinery",
  description: "Founded in 2011 in Gurgaon, Moonlight Machinery has delivered 2,300+ paper plate, lamination & cotton wick machines across 19 states in India. Genuine machines, straight pricing.",
  alternates: {
    canonical: "https://www.moonlightmachinery.com/home/about",
  },
  openGraph: {
    title: "About Moonlight Machinery - Trusted Paper Plate Machine Manufacturer",
    description: "14 years in business, 2,300+ machines delivered across India. Straight pricing, genuine parts, real support.",
    url: "https://www.moonlightmachinery.com/home/about",
    siteName: "Moonlight Machinery",
    locale: "en_IN",
    type: "website",
  },
};

export default function page() {
  
  return (
    <div className=' px-2 sm:p-0'>
      <About/>
    </div>
  )
}
