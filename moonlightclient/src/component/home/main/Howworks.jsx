"use client"
import React, { useState } from "react";

/**
 * STOCKROOM — how it works + trust videos
 * Native <video> controls, no custom play-button chrome — fits the brand's
 * "function over polish" argument literally. Steps are numbered because
 * fulfillment genuinely is a sequence, unlike the earlier metric strips.
 */

const STEPS = [
  { n: "01", title: "Order placed", desc: "You order direct from the catalog — no reseller, no markup layered on top." },
  { n: "02", title: "Picked from stock", desc: "Every item shown is sitting in our warehouse already. Nothing is drop-shipped." },
  { n: "03", title: "Packed in-house", desc: "Same team that receives the goods packs your order, same day it's placed." },
  { n: "04", title: "Shipped same day", desc: "Orders in by 3pm ship that afternoon. You get tracking within the hour." },
];

const VIDEOS = [
  {
    title: "Inside the warehouse",
    duration: "2:14",
    poster: "/videos/warehouse-poster.jpg",
    src: "/videos/warehouse.mp4",
    desc: "A walkthrough of where your order actually sits before it ships.",
  },
  {
    title: "How we pack an order",
    duration: "1:48",
    poster: "/videos/packing-poster.jpg",
    src: "/videos/packing.mp4",
    desc: "Start to finish: pick ticket to sealed box, no cuts.",
  },
  {
    title: "Meet the team",
    duration: "3:02",
    poster: "/videos/team-poster.jpg",
    src: "/videos/team.mp4",
    desc: "The seven people who pack, ship, and answer your emails.",
  },
];

export default function HowItWorks() {
  const [activeVideo, setActiveVideo] = useState(0);
  const current = VIDEOS[activeVideo];

  return (
    <section className="hw-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .hw-root {
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
          width: 100%;
          padding: 56px 32px 64px;
          border-top: 1px solid var(--line-strong);
        }
        .hw-root * { box-sizing: border-box; }
        @media (max-width: 720px) { .hw-root { padding: 40px 20px 48px; } }

        .hw-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }
        .hw-inner { max-width: 1200px; margin: 0 auto; }

        .hw-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 10px;
        }
        .hw-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(24px, 3.2vw, 34px);
          line-height: 1.02;
          margin: 0 0 32px 0;
          max-width: 18ch;
        }

        /* ---------- layout: video + steps ---------- */
        .hw-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          border: 1px solid var(--line-strong);
          margin-bottom: 40px;
        }
        @media (max-width: 900px) { .hw-layout { grid-template-columns: 1fr; } }

        .hw-player-col {
          border-right: 1px solid var(--line-strong);
          background: var(--paper);
        }
        @media (max-width: 900px) {
          .hw-player-col { border-right: none; border-bottom: 1px solid var(--line-strong); }
        }

        .hw-video {
          width: 100%;
          aspect-ratio: 16 / 9;
          display: block;
          background: #1a1a17;
        }

        .hw-player-meta {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid var(--line-strong);
        }
        .hw-player-title { font-size: 14px; font-weight: 600; }
        .hw-player-duration { font-size: 11.5px; color: var(--ink-faint); }

        .hw-steps { padding: 24px 24px 8px; background: var(--paper); }
        .hw-step { display: flex; gap: 14px; padding-bottom: 22px; }
        .hw-step-num {
          font-size: 12px;
          color: var(--ink-faint);
          padding-top: 2px;
          flex-shrink: 0;
        }
        .hw-step-title { font-size: 13.5px; font-weight: 600; margin-bottom: 4px; }
        .hw-step-desc { font-size: 12.5px; line-height: 1.55; color: var(--ink-dim); }

        /* ---------- trust video grid ---------- */
        .hw-trust-head {
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 14px;
        }

        .hw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line-strong);
          border: 1px solid var(--line-strong);
        }
        @media (max-width: 720px) { .hw-grid { grid-template-columns: 1fr; } }

        .hw-card {
          background: var(--paper);
          text-align: left;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .hw-card.active { outline: 2px solid var(--accent); outline-offset: -2px; }

        .hw-thumb-wrap { position: relative; }
        .hw-thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          background: #1a1a17;
        }
        .hw-thumb-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: var(--ink);
          color: var(--bg);
          font-size: 10px;
          padding: 2px 6px;
        }
        .hw-play-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg);
          opacity: 0.9;
        }

        .hw-card-info { padding: 14px 16px 16px; border-top: 1px solid var(--line-strong); }
        .hw-card-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
        .hw-card-desc { font-size: 12px; line-height: 1.5; color: var(--ink-dim); }

        .hw-card:focus-visible { outline: 2px solid var(--ink); outline-offset: -2px; }
      `}</style>

      <div className="hw-inner">
        <div className="hw-eyebrow hw-mono">How it works</div>
        <h2 className="hw-title">From warehouse to your door, on camera</h2>

        <div className="hw-layout">
          <div className="hw-player-col">
            <video
              className="hw-video"
              key={current.src}
              controls
              poster={current.poster}
              preload="none"
            >
              <source src={current.src} type="video/mp4" />
            </video>
            <div className="hw-player-meta">
              <span className="hw-player-title">{current.title}</span>
              <span className="hw-player-duration hw-mono">{current.duration}</span>
            </div>
          </div>

          <div className="hw-steps">
            {STEPS.map((s) => (
              <div className="hw-step" key={s.n}>
                <span className="hw-step-num hw-mono">{s.n}</span>
                <div>
                  <div className="hw-step-title">{s.title}</div>
                  <p className="hw-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hw-trust-head hw-mono">More from inside the warehouse</div>
        <div className="hw-grid">
          {VIDEOS.map((v, i) => (
            <button
              key={v.title}
              className={`hw-card ${i === activeVideo ? "active" : ""}`}
              onClick={() => setActiveVideo(i)}
            >
              <div className="hw-thumb-wrap">
                <img className="hw-thumb" src={v.poster} alt={v.title} />
                <span className="hw-thumb-duration hw-mono">{v.duration}</span>
                <span className="hw-play-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="15" fill="rgba(21,20,15,0.55)" stroke="white" strokeWidth="1" />
                    <path d="M13 10.5L22 16L13 21.5V10.5Z" fill="white" />
                  </svg>
                </span>
              </div>
              <div className="hw-card-info">
                <div className="hw-card-title">{v.title}</div>
                <div className="hw-card-desc">{v.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}