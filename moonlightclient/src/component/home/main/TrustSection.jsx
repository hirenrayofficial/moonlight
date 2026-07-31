"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./trust.scss";

/**
 * MOONLIGHT MACHINERY — trust section
 * Google review summary + individual reviews + real delivery photos.
 * Uses the system default font stack only — no Google Fonts import,
 * unlike the rest of the project.
 *
 * NOTE: review data below is placeholder. For *live* Google reviews you'd
 * need the Google Places API (Place Details request, `reviews` field) —
 * that requires a billed Google Cloud project and a backend proxy (the
 * API key can't safely live in client-side code). Swap GOOGLE_REVIEWS /
 * RATING_SUMMARY for that response when you wire it up.
 */

const RATING_SUMMARY = {
  average: 4.8,
  total: 312,
  breakdown: [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 12 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ],
};

const GOOGLE_REVIEWS = [
  {
    name: "Koushik Barman",
    location: "Siliguri, WB",
    rating: 5,
    text: "I recently started a small paper plate manufacturing business and was looking for a reliable paper plate machine in Siliguri. After visiting this place, I decided to purchase from them, and it turned out to be a great decision. The team patiently explained everything, from machine operation to maintenance. The machine is easy to use, runs smoothly, and the quality of the paper plates is excellent. Their after-sales support has also been very helpful whenever I had questions. Highly recommended for anyone planning to start a paper plate business in Siliguri.",
    date: "1 months ago",
    img: "/google.png",
  },
  {
    name: "Rahul Debnath",
    location: "Siliguri, WB",
    rating: 5,
    text: "Moonlight Machinery is one of the most reliable machinery suppliers in Siliguri. They offer high-quality industrial and agricultural machinery at competitive prices with excellent customer service. The staff is knowledgeable, helpful, and always ready to provide the right guidance for machinery selection and maintenance. Their prompt delivery and professional support make them a trusted choice in Siliguri. Highly recommended for anyone looking for the best machinery dealer and machinery solutions in Siliguri.",
    date: "1 month ago",
    img: "/google.png",
  },
  {
    name: "Suresh Patil",
    location: "Gurugram, HR",
    rating: 4,
    text: "Good machine, delivery took two extra days but they called and kept us updated the whole time.",
    date: "3 months ago",
    img: "/google.png",
  },
  {
    name: "Anita Desai",
    location: "Surat, GJ",
    rating: 5,
    text: "Their team trained our operator on-site for two full days. That mattered more to us than the price difference.",
    date: "5 months ago",
    img: "/google.png",
  },
];

const DELIVERY_PHOTOS = [
  {
    src: "/scrmoon.png",
    caption: "Paper plate machine delivered — Jaipur, RJ",
  },
  { src: "/images/delivery-2.jpg", caption: "Installation day — Nagpur, MH" },
  {
    src: "/images/delivery-3.jpg",
    caption: "Cotton wick line loaded for dispatch",
  },
  {
    src: "/images/delivery-4.jpg",
    caption: "Lamination machine, unboxed on-site",
  },
  {
    src: "/images/delivery-5.jpg",
    caption: "Full-automatic setup — Kochi, KL",
  },
  { src: "/images/delivery-6.jpg", caption: "Loaded and ready to ship" },
];

function Stars({ rating, size = 14 }) {
  return (
    <span className="tr-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          className={n <= rating ? "tr-star filled" : "tr-star"}
        >
          <path
            d="M10 1.5L12.4 6.8L18.2 7.5L13.9 11.4L15.1 17.2L10 14.2L4.9 17.2L6.1 11.4L1.8 7.5L7.6 6.8L10 1.5Z"
            fill={n <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}

export default function TrustSection() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="tr-root">
      <div className="tr-inner">
        <div className="tr-head">
          <span className="tr-eyebrow">Why people trust us</span>
          <h2 className="tr-title">
            Reviewed by the people who bought the machine
          </h2>
        </div>

        {/* ---------- rating summary ---------- */}
        <div className="tr-summary">
          <div className="tr-summary-left">
            <div className="tr-summary-score">
              {RATING_SUMMARY.average.toFixed(1)}
            </div>
            <Stars rating={Math.round(RATING_SUMMARY.average)} size={16} />
            <div className="tr-summary-count">
              Based on {RATING_SUMMARY.total.toLocaleString("en-US")} Google
              reviews
            </div>
          </div>
          <div className="tr-summary-right">
            {RATING_SUMMARY.breakdown.map((b) => (
              <div className="tr-bd-row" key={b.stars}>
                <span className="tr-bd-label">{b.stars}★</span>
                <div className="tr-bd-track">
                  <div className="tr-bd-fill" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="tr-bd-pct">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- individual reviews ---------- */}
        <div className="tr-reviews-grid">
          {GOOGLE_REVIEWS.map((r) => (
            <div className="tr-review-card" key={r.name}>
              <div className="tr-review-top">
                <div className="tr-avatar">
                  {r.img ? (
                    <Image
                      src={r.img}
                      alt={r.name}
                      width={500}
                      height={36}
                      className="tr-avatar-img"
                    />
                  ) : (
                    r.name.charAt(0)
                  )}
                </div>

                <div>
                  <div className="tr-review-name">{r.name}</div>
                  <div className="tr-review-location">{r.location}</div>
                </div>
              </div>
              <Stars rating={r.rating} />
              <p className="tr-review-text  line-clamp-3">{r.text}</p>
              <div className="tr-review-date">{r.date} · Google review</div>
            </div>
          ))}
        </div>

        {/* ---------- delivery photos ---------- */}
        {/* <div className="tr-delivery-head">
          <span className="tr-eyebrow">Delivered, not just promised</span>
          <h3 className="tr-delivery-title">
            Real machines, on real loading docks
          </h3>
        </div>
        <div className="tr-photo-grid">
          {DELIVERY_PHOTOS.map((p, i) => (
            <button
              key={p.src}
              className="tr-photo-card"
              onClick={() => setLightbox(i)}
              aria-label={`View photo: ${p.caption}`}
            >
              <Image
                src={p.src}
                alt={p.caption}
                width={400}
                height={400}
                className="tr-photo-img"
              />
              <span className="tr-photo-caption">{p.caption}</span>
            </button>
          ))}
        </div> */}
      </div>

      {/* ---------- lightbox ---------- */}
      {lightbox !== null && (
        <div className="tr-lightbox" onClick={() => setLightbox(null)}>
          <button
            className="tr-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            className="tr-lightbox-img"
            src={DELIVERY_PHOTOS[lightbox].src}
            alt={DELIVERY_PHOTOS[lightbox].caption}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="tr-lightbox-caption">
            {DELIVERY_PHOTOS[lightbox].caption}
          </div>
        </div>
      )}
    </section>
  );
}
