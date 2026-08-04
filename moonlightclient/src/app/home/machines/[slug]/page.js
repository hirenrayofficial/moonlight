// app/home/machines/[slug]/page.jsx
// SERVER COMPONENT — no "use client" here.
// This runs on the server / at build time, so Google gets fully-formed
// HTML + <title> + <meta> + JSON-LD on the very first response.
// No waiting for client JS to fetch data and re-render.

import { notFound } from "next/navigation";
import { getspcItem } from "@/services/home/GetProduct";
import Mview from "@/component/machine/Mview"
import Script from "next/script";


export async function generateMetadata({ params }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { slug } = await params;
  const data = await getspcItem(slug);
  const product = data?.[0];

  if (!product) {
    return {
      title: "Product Not Found | Moonlight Machinery",
    };
  }

  const url = `${SITE_URL}/home/machines/${slug}`;

  // Fallbacks are written to be keyword-relevant, not generic,
  // in case the CMS field for this product is empty.
  const title =
    product.pageTitle?.trim() ||
    `${product.name} Price in India | Moonlight Machinery`;

  const description =
    product.metaDescription?.trim() ||
    (product.description
      ? product.description.trim().slice(0, 155)
      : `${product.name} — genuine machine, PAN-India shipping. Get latest price, specifications and a quote from Moonlight Machinery.`);

  const image = product.images?.[0];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { slug } = await params;
  const data = await getspcItem(slug);
  const product = data?.[0];

  if (!product) {
    notFound();
  }

  const url = `${SITE_URL}/home/machines/${slug}`;

  // Product structured data — helps Google show price / availability /
  // rich snippet in search results for exactly this kind of query.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: product.description || "",
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Moonlight Machinery",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.pricing?.basePrice || 0,
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      {/* Structured data lives in the server-rendered HTML — crawlers
          see it immediately, no JS execution required. */}
      <Script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Pass server-fetched data down as initialProduct so the client
          component can render real content on first paint instead of
          a skeleton, and skip re-fetching what we already have. */}
      <Mview slug={slug} initialProduct={product} />
    </>
  );
}