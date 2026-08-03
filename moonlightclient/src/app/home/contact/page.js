import React from 'react';
import Contact from './ContactDesign';

export const metadata = {
    title: "Contact Us - Get a Quote for Paper Plate Making Machines | Moonlight Machinery",
    description: "Contact Moonlight Machinery for hydraulic paper plate, dona & lamination machine quotes. Based in Gurgaon, shipping PAN-India. Call, WhatsApp, or email us today.",
    keywords: [
        "contact Moonlight Machinery",
        "paper plate machine manufacturer contact",
        "paper plate making machine quote India",
        "Moonlight Machinery Gurgaon",
        "buy paper plate machine contact number",
    ],
    alternates: {
        canonical: "https://www.moonlightmachinery.com/home/contact",
    },
    openGraph: {
        title: "Contact Moonlight Machinery - Paper Plate Machine Manufacturer",
        description: "Get in touch for hydraulic paper plate, dona & lamination machine quotes. PAN-India shipping from Gurgaon.",
        url: "https://www.moonlightmachinery.com/home/contact",
        siteName: "Moonlight Machinery",
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Moonlight Machinery",
        description: "Get in touch for hydraulic paper plate, dona & lamination machine quotes. PAN-India shipping from Gurgaon.",
    },
};

export default function Page() {
    return (
        <div className='px-2 sm:p-0'>
            <Contact />
        </div>
    )
}