"use client";

import React, { useEffect, useState } from "react";
import "./style/mview.scss";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getspcItem } from "@/services/home/GetProduct";
import Link from "next/link";
/**
 * STOCKROOM — product page
 * Same system as the hero + header: paper background, hairline rules,
 * mono data, sharp corners. Signature element here is a spec sheet
 * instead of marketing copy — the product argues for itself with numbers.
 */

// const PRODUCT = {
//   name: "Cast-Iron Skillet, 10in",
//   sku: "SR-0142",
//   price: 34.0,
//   stock: 86,
//   description:
//     "Pre-seasoned, single-pour cast iron. Goes from stovetop to oven to table without changing pans. Gets better with use, not worse.",
//   images: ["/p-a.png", "/p-b.png", "/p-c.png", "/p-d.png"],
//   specs: [
//     { label: "Material", value: "Cast iron, pre-seasoned" },
//     { label: "Diameter", value: "10 in / 25.4 cm" },
//     { label: "Weight", value: "3.2 kg" },
//     { label: "Oven safe", value: "Up to 500°F / 260°C" },
//     { label: "Origin", value: "Made in Ohio, USA" },
//     { label: "Care", value: "Hand wash, dry, oil lightly" },
//   ],
// };

const RELATED = [
  { name: "Canvas work apron", price: 42.0, image: "/images/apron.jpg" },
  {
    name: "Stainless prep bowls, set/3",
    price: 28.0,
    image: "/images/prep-bowls.jpg",
  },
  {
    name: "Waxed canvas tool roll",
    price: 56.0,
    image: "/images/tool-roll.jpg",
  },
];

function money(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Mview({ slug }) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const pathname = usePathname();

  // 1. Split the path and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["item", slug], // Included slug here (best practice)
    queryFn: () => getspcItem(slug), // Use an arrow function wrapper
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 2. Handle Error State
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="pd-root py-24 w-full max-w-[1200px]  ">
      <div className="pd-crumb pd-mono flex">
        <Link href="/">Home</Link>
        {segments.map((segment, index) => {
          // Build the path up to this segment
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          return (
            <div key={href} className="flex gap-2">
              <span>/</span>
              <Link href={href} className="capitalize bold text-gray-500">
                {segment.replace(/-/g, " ")}
              </Link>
            </div>
          );
        })}
      </div>

      <section className="pd-main">
        <div className="pd-gallery">
          <Image
            width={400}
            height={400}
            className="pd-image-main"
            src={data.images[activeImage]}
            alt={data.name}
          />
          <div className="pd-thumbs">
            {data.images.map((src, i) => (
              <button
                key={src}
                className={`pd-thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info">
          <div className="pd-eyebrow pd-mono">
            <span className="pd-dot" aria-hidden="true" />
            In stock — {data.stock} available
          </div>

          <h1 className="pd-name">{data.name}</h1>
          <div className="pd-sku pd-mono">SKU {data.sku}</div>

          <div className="pd-price pd-mono">₹{money(data.price)}</div>

          <p className="pd-desc">{data.description}</p>

          <div className="pd-buy-row">
            <div className="pd-qty">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="pd-mono">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button className="pd-add-btn" onClick={(e) => findDiectory()}>
              Add to cart — ${money(data.price * qty)}
            </button>
          </div>

          <p className="pd-meta pd-mono">
            Ships from stock — most orders same day. Flat $6 shipping.
          </p>

          <div className="pd-specs-title pd-mono">Specification</div>
          {data.specs.map((s) => (
            <div className="pd-spec-row" key={s.label}>
              <span className="pd-spec-label pd-mono">{s.label}</span>
              <span className="pd-spec-value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="pd-related-head pd-mono">Also in stock</div>
      <div className="pd-related">
        {RELATED.map((p) => (
          <div className="pd-related-card" key={p.name}>
            <img className="pd-related-image" src={p.image} alt={p.name} />
            <div className="pd-related-info">
              <div className="pd-related-name">{p.name}</div>
              <div className="pd-related-price pd-mono">${money(p.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
