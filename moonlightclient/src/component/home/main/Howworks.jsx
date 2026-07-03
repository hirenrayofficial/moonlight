"use client"
import React, { useState } from "react";
import Video from "./Video";
import useYouTubeMeta from "./useYouTubeMeta";

/**
 * STOCKROOM — how it works + trust videos
 * Fixed version: the playable URL now lives in `src` (what actually gets
 * passed to ReactPlayer). `poster` was renamed `thumbnail` and is passed
 * to Video's `light` prop, since react-player has no `poster` prop.
 */

const STEPS = [
  { n: "01", title: "See the product", desc: "A full walkthrough of what it actually is, what it does, and who it's for — before you spend anything." },
  { n: "02", title: "Know the real price", desc: "Exact cost breakdown, no hidden fees or bundled upsells hiding the real number." },
  { n: "03", title: "See how it earns", desc: "The actual day-to-day method — what you do, how often, and what it realistically pays." },
  { n: "04", title: "Try it yourself", desc: "Everything you need to start today, laid out step by step, no guesswork." },
];


const VIDEOS = [
  {
    duration: "2:14",
    src: "https://www.youtube.com/watch?v=dvi_CI2-xDI",
    desc: "A walkthrough of where your order actually sits before it ships.",
  },
  {
    duration: "1:48",
    src: "https://www.youtube.com/watch?v=U-2XoKMIy90",
    desc: "Start to finish: pick ticket to sealed box, no cuts.",
  },
  {
    duration: "3:02",
    src: "https://youtu.be/7K7ZxO2hJIg?si=FDRj-ZVGhGpF8Vgs",
    desc: "The seven people who pack, ship, and answer your emails.",
  },
];

function isYouTubeUrl(url) {
  return typeof url === "string" && /youtube\.com|youtu\.be/.test(url);
}

function VideoCard({ video, active, onClick }) {
  const meta = useYouTubeMeta(isYouTubeUrl(video.src) ? video.src : null);
  const title = video.title || meta.title || "Untitled";
  const thumbnail = video.thumbnail || meta.thumbnail;

  return (
    <button className={`hw-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="hw-thumb-wrap">
        {thumbnail && <img className="hw-thumb" src={thumbnail} alt={title} />}
        <span className="hw-thumb-duration hw-mono">{video.duration}</span>
        <span className="hw-play-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="15" fill="rgba(21,20,15,0.55)" stroke="white" strokeWidth="1" />
            <path d="M13 10.5L22 16L13 21.5V10.5Z" fill="white" />
          </svg>
        </span>
      </div>
      <div className="hw-card-info">
        <div className="hw-card-title">{title}</div>
        <div className="hw-card-desc">{video.desc}</div>
      </div>
    </button>
  );
}

export default function HowItWorks() {
  const [activeVideo, setActiveVideo] = useState(0);
  const current = VIDEOS[activeVideo];
  const currentMeta = useYouTubeMeta(isYouTubeUrl(current.src) ? current.src : null);
  const currentTitle = current.title || currentMeta.title || "Loading title…";
  const currentThumbnail = current.thumbnail || currentMeta.thumbnail;

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
          pointer-events: none;
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
            <Video key={current.src} link={current.src} thumbnail={currentThumbnail} />
            <div className="hw-player-meta">
              <span className="hw-player-title">{currentTitle}</span>
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
            <VideoCard
              key={v.src}
              video={v}
              active={i === activeVideo}
              onClick={() => setActiveVideo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}