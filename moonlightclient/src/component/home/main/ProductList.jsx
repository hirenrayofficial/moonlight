"use client"

import React, { useState } from "react";

/**
 * STOCKROOM — product page
 * Same system as the hero + header: paper background, hairline rules,
 * mono data, sharp corners. Signature element here is a spec sheet
 * instead of marketing copy — the product argues for itself with numbers.
 */

const PRODUCT = {
  name: "Cast-Iron Skillet, 10in",
  sku: "SR-0142",
  price: 34.0,
  stock: 86,
  description:
    "Pre-seasoned, single-pour cast iron. Goes from stovetop to oven to table without changing pans. Gets better with use, not worse.",
  images: [
    "/images/skillet-1.jpg",
    "/images/skillet-2.jpg",
    "/images/skillet-3.jpg",
    "/images/skillet-4.jpg",
  ],
  specs: [
    { label: "Material", value: "Cast iron, pre-seasoned" },
    { label: "Diameter", value: "10 in / 25.4 cm" },
    { label: "Weight", value: "3.2 kg" },
    { label: "Oven safe", value: "Up to 500°F / 260°C" },
    { label: "Origin", value: "Made in Ohio, USA" },
    { label: "Care", value: "Hand wash, dry, oil lightly" },
  ],
};

const RELATED = [
  { name: "Canvas work apron", price: 42.0, image: "/images/apron.jpg" },
  { name: "Stainless prep bowls, set/3", price: 28.0, image: "/images/prep-bowls.jpg" },
  { name: "Waxed canvas tool roll", price: 56.0, image: "/images/tool-roll.jpg" },
];

function money(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  return (
    <div className="pd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .pd-root {
          --bg: #faf9f5;
          --paper: #ffffff;
          --ink: #15140f;
          --ink-dim: #5a594e;
          --ink-faint: #9b9a8c;
          --line: #d9d6c9;
          --line-strong: #b8b5a4;
          --accent: #f2b705;
          --accent-ink: #15140f;

          background: var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          min-height: 100vh;
          width: 100%;
        }
        .pd-root * { box-sizing: border-box; }

        .pd-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        /* ---------- breadcrumb ---------- */
        .pd-crumb {
          padding: 16px 32px;
          border-bottom: 1px solid var(--line-strong);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .pd-crumb span.current { color: var(--ink); }
        @media (max-width: 720px) { .pd-crumb { padding: 14px 20px; } }

        /* ---------- main grid ---------- */
        .pd-main {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          border-bottom: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) { .pd-main { grid-template-columns: 1fr; } }

        /* gallery */
        .pd-gallery {
          padding: 32px;
          border-right: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) {
          .pd-gallery { border-right: none; border-bottom: 1px solid var(--line-strong); padding: 24px 20px; }
        }
        .pd-image-main {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          background: #f0efe8;
          border: 1px solid var(--line-strong);
          display: block;
        }
        .pd-thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--line-strong);
          border: 1px solid var(--line-strong);
          border-top: none;
        }
        .pd-thumb {
          background: var(--paper);
          padding: 0;
          border: none;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          position: relative;
        }
        .pd-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #f0efe8;
        }
        .pd-thumb.active::after {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid var(--accent);
        }
        .pd-thumb:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }

        /* info / spec sheet */
        .pd-info { padding: 40px 40px 32px; }
        @media (max-width: 900px) { .pd-info { padding: 32px 20px; } }

        .pd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line-strong);
          padding: 6px 10px;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-dim);
          margin-bottom: 20px;
        }
        .pd-dot { width: 6px; height: 6px; border-radius: 50%; background: #5cba7d; }

        .pd-name {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(26px, 3.2vw, 34px);
          line-height: 1.05;
          margin: 0 0 12px 0;
        }
        .pd-sku { font-size: 11px; color: var(--ink-faint); margin-bottom: 20px; }

        .pd-price {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .pd-desc {
          font-size: 15px;
          line-height: 1.65;
          color: var(--ink-dim);
          max-width: 46ch;
          margin: 0 0 28px 0;
        }

        .pd-buy-row {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 28px;
        }
        .pd-qty {
          display: flex;
          align-items: center;
          border: 1px solid var(--line-strong);
        }
        .pd-qty button {
          background: transparent;
          border: none;
          width: 36px;
          height: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          cursor: pointer;
          color: var(--ink);
        }
        .pd-qty button:hover { background: var(--line); }
        .pd-qty span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          width: 34px;
          text-align: center;
        }
        .pd-add-btn {
          flex: 1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--ink);
          color: var(--bg);
          border: 1px solid var(--ink);
          cursor: pointer;
        }
        .pd-add-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        .pd-qty button:focus-visible,
        .pd-add-btn:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .pd-meta { font-size: 11.5px; color: var(--ink-faint); margin-bottom: 28px; }

        /* spec sheet */
        .pd-specs-title {
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          border-top: 1px solid var(--line-strong);
          padding-top: 16px;
          margin-bottom: 4px;
        }
        .pd-spec-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
        }
        .pd-spec-row:last-child { border-bottom: none; }
        .pd-spec-label { color: var(--ink-faint); }
        .pd-spec-value { color: var(--ink); text-align: right; }

        /* ---------- related ---------- */
        .pd-related-head {
          padding: 28px 32px 0;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        @media (max-width: 720px) { .pd-related-head { padding: 24px 20px 0; } }

        .pd-related {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line-strong);
          border: 1px solid var(--line-strong);
          margin: 20px 32px 40px;
        }
        @media (max-width: 720px) {
          .pd-related { grid-template-columns: repeat(2, 1fr); margin: 16px 20px 32px; }
        }

        .pd-related-card { background: var(--paper); }
        .pd-related-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
          background: #f0efe8;
        }
        .pd-related-info { padding: 10px 12px 12px; border-top: 1px solid var(--line-strong); }
        .pd-related-name { font-size: 12px; line-height: 1.35; color: var(--ink); margin-bottom: 4px; }
        .pd-related-price { font-size: 12.5px; font-weight: 600; color: var(--ink); }
      `}</style>

      <div className="pd-crumb pd-mono">
        Catalog / Kitchen / <span className="current">{PRODUCT.name}</span>
      </div>

      <section className="pd-main">
        <div className="pd-gallery">
          <img className="pd-image-main" src={PRODUCT.images[activeImage]} alt={PRODUCT.name} />
          <div className="pd-thumbs">
            {PRODUCT.images.map((src, i) => (
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
            In stock — {PRODUCT.stock} available
          </div>

          <h1 className="pd-name">{PRODUCT.name}</h1>
          <div className="pd-sku pd-mono">SKU {PRODUCT.sku}</div>

          <div className="pd-price pd-mono">${money(PRODUCT.price)}</div>

          <p className="pd-desc">{PRODUCT.description}</p>

          <div className="pd-buy-row">
            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span className="pd-mono">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="pd-add-btn">Add to cart — ${money(PRODUCT.price * qty)}</button>
          </div>

          <p className="pd-meta pd-mono">Ships from stock — most orders same day. Flat $6 shipping.</p>

          <div className="pd-specs-title pd-mono">Specification</div>
          {PRODUCT.specs.map((s) => (
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