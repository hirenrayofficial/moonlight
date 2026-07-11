"use client";
import React from "react";
import "./social.scss";

/**
 * MOONLIGHT MACHINERY — social section
 * Same system as the header: paper background, hairline rule, mono
 * labels, sharp corners. Each card opens the real profile directly.
 */

const SOCIALS = [
  {
    name: "Instagram",
    handle: "@moonlightmachinery",
    url: "https://instagram.com/moonlightmachinery",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14.6" cy="5.4" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "Moonlight Machinery",
    url: "https://youtube.com/@moonlightmachinery",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1.5" y="4.5" width="17" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8.2 7.6L12.4 10L8.2 12.4V7.6Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "/moonlightmachinery",
    url: "https://facebook.com/moonlightmachinery",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 6.5H10.5C9.7 6.5 9 7.2 9 8V10H12L11.6 12H9V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "+91 81784 45596",
    url: "https://wa.me/918178445596",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 16.5L5 13.2C4.2 11.9 3.9 10.4 4.3 9C5 6.2 7.7 4.3 10.6 4.8C13.1 5.2 15 7.5 14.9 10.1C14.8 13 12.3 15.3 9.4 15.1C8.4 15 7.5 14.7 6.7 14.1L4 16.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    handle: "Moonlight Machinery",
    url: "https://linkedin.com/company/moonlightmachinery",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="6.3" cy="6.5" r="0.9" fill="currentColor" />
        <path d="M6.3 9V14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9.3 14.5V11C9.3 9.8 10.1 9 11.2 9C12.3 9 13 9.8 13 11V14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function SocialSection() {
  function openSocial(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="sc-root">
      <div className="sc-inner">
        <div className="sc-head">
          <span className="sc-eyebrow">Follow the shop floor</span>
          <h2 className="sc-title">Find us where you already are</h2>
        </div>

        <div className="sc-grid">
          {SOCIALS.map((s) => (
            <button
              key={s.name}
              className="sc-card"
              onClick={() => openSocial(s.url)}
              aria-label={`Open Moonlight Machinery on ${s.name}`}
            >
              <span className="sc-icon">{s.icon}</span>
              <span className="sc-text">
                <span className="sc-name">{s.name}</span>
                <span className="sc-handle">{s.handle}</span>
              </span>
              <span className="sc-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}