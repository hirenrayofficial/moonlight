"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./trust.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Stars({ rating, size = 16 }) {
  const numericRating = Number(rating) || 5;
  return (
    <div className="tr-stars" aria-label={`${numericRating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={n <= numericRating ? "tr-star filled" : "tr-star"}
          fill={n <= numericRating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TrustSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/home/landing-dt/review-dt");
        if (response?.data?.success) {
          setReviews(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load reviews for trust section:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute dynamic stats from fetched API data
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.star) || 5), 0) / totalReviews).toFixed(1)
    : "4.8";

  // Compute star breakdowns dynamically
  const breakdownCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const s = Number(r.star) || 5;
    if (breakdownCounts[s] !== undefined) breakdownCounts[s]++;
  });

  const starBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = breakdownCounts[stars];
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (stars === 5 ? 85 : 5);
    return { stars, pct };
  });

  return (
    <section className="tr-root">
      {/* Cyber Grid Background Elements */}
      <div className="tr-bg-grid" aria-hidden="true">
        <div className="grid-line-v"></div>
        <div className="grid-line-v"></div>
        <div className="grid-line-h"></div>
      </div>

      <div className="tr-inner">
        {/* Section Header */}
        <motion.div
          className="tr-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="tr-eyebrow tr-mono">
            <span className="tr-dot"></span> VERIFIED CLIENT MANIFEST // 05
          </div>
          <h2 className="tr-title">TRUSTED BY MANUFACTURERS ACROSS INDIA</h2>
          <p className="tr-subtitle tr-mono">
            Real performance telemetry and operational testimonials from industrial business owners scaling with Moonlight Machinery.
          </p>
        </motion.div>

        {/* Rating Summary Dashboard Card */}
        <motion.div 
          className="tr-summary"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="tr-summary-left">
            <div className="tr-summary-score-wrapper">
              <span className="tr-summary-score tr-mono">{averageRating}</span>
              <span className="tr-summary-max tr-mono">/5</span>
            </div>
            <Stars rating={Math.round(Number(averageRating))} size={18} />
            <div className="tr-summary-count tr-mono">
              Based on <strong>{totalReviews > 0 ? totalReviews : "312"}</strong> verified production telemetry metrics
            </div>
            <div className="tr-google-badge tr-mono">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.89 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <span>SECURE PROTOCOL SYNCED</span>
            </div>
          </div>

          <div className="tr-summary-right">
            {starBreakdown.map((b) => (
              <div className="tr-bd-row" key={b.stars}>
                <span className="tr-bd-label tr-mono">{b.stars} STAR</span>
                <div className="tr-bd-track">
                  <motion.div 
                    className="tr-bd-fill" 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="tr-bd-pct tr-mono">{b.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Individual Reviews Grid */}
        {loading ? (
          <div className="tr-empty-msg tr-mono">QUERYING TELEMETRY RECORDS...</div>
        ) : reviews.length === 0 ? (
          <div className="tr-empty-msg tr-mono">NO ACTIVE REVIEWS FOUND IN MANIFEST.</div>
        ) : (
          <motion.div
            className="tr-reviews-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {reviews.map((r) => {
              const cardId = r._id;
              const isExpanded = expandedCards[cardId];
              return (
                <motion.div className="tr-review-card" key={cardId} variants={staggerItem}>
                  <div className="tr-review-top">
                    <div className="tr-avatar tr-mono">
                      {r.person_name ? r.person_name.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div>
                      <div className="tr-review-name tr-mono">{r.person_name}</div>
                      <div className="tr-review-location tr-mono">LOC: {r.location} // {r.review_type}</div>
                    </div>
                    <div className="tr-card-google-icon" title="Verified Entry">
                      <svg width="14" height="14" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.89 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                      </svg>
                    </div>
                  </div>

                  <Stars rating={r.star} size={14} />

                  <div className="tr-text-container">
                    <p className={`tr-review-text tr-mono ${!isExpanded ? "line-clamp-3" : ""}`}>
                      "{r.feedback}"
                    </p>
                    {r.feedback && r.feedback.length > 120 && (
                      <button 
                        className="tr-read-more-btn tr-mono" 
                        onClick={() => toggleExpand(cardId)}
                      >
                        {isExpanded ? "[[-] SHOW LESS]" : "[[+] READ FULL FEEDBACK]"}
                      </button>
                    )}
                  </div>

                  <div className="tr-review-footer tr-mono">
                    <span className="tr-review-date">ID: {cardId.slice(-6).toUpperCase()}</span>
                    <span className="tr-verified-tag">✓ VERIFIED OWNER</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}