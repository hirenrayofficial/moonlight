"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * STOCKROOM — cinematic banner carousel
 * Full-bleed image slides, segmented progress bars instead of dots
 * (functional timing indicator, not decoration), autoplay that pauses
 * on hover/focus, keyboard arrows, and touch swipe.
 */

const SLIDES = [
  {
    eyebrow: "New arrival",
    title: "FULL AUTOMATIC SINGLE DIE PAPER PLATE MAKING MACHINE",
    desc: "Streamlines your entire production line. Just load the raw material roll, and the machine handles the cutting, pressing, and collecting",
    price: "From ₹60000.00",
    cta: "Buy Now",
    image: "/p-a.png",
  },
  {
    eyebrow: "Restocked",
    title: "FULL AUTOMATIC SINGLE DIE PAPER PLATE MAKING MACHINE",
    desc: "Eliminates manual labor errors. Just mount the paper roll, set the parameters, and let the machine handle the cutting, forming, and collecting",
    price: "From ₹35000.00",
    cta: "Buy Now",
    image: "/p-b.png",
  },
  {
    eyebrow: "Limited stock",
    title: "LAMINATION WITH ONLINE SLITTING",
    desc: "Equipped with heavy-duty, adjustable rotary blade cutters that deliver clean, burr-free edges. Effortlessly adjust width settings to meet diverse product requirements.",
    price: "₹40000.00",
    cta: "Buy Now",
    image: "/p-c.png",
  },
];

const AUTOPLAY_MS = 5500;

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const trackRef = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // autoplay
  useEffect(() => {
    if (paused) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const t = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, goTo]);

  // keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    const node = trackRef.current;
    node?.addEventListener("keydown", onKey);
    return () => node?.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  }

  return (
    <div
      className={`cb-root ${paused ? "cb-paused" : ""} w-full`}
      // className="w-full max-w-[1200px] mx-auto relative"
      ref={trackRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .cb-root {
          --ink: #15140f;
          --paper: #faf9f5;
          --line-strong: #b8b5a4;
          --accent: #f2b705;
          --accent-ink: #15140f;

          position: relative;
          width: 100%;
          height: 86vh;
          min-height: 460px;
          max-height: 760px;
          overflow: hidden;
          background: #0e0d0a;
          outline: none;
        }
        .cb-root * { box-sizing: border-box; }
        @media (max-width: 720px) { .cb-root { height: 78vh; min-height: 520px; } }

        .cb-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        /* ---------- slides ---------- */
        .cb-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.7s ease;
        }
        .cb-slide.active { opacity: 1; visibility: visible; z-index: 1; }

        .cb-slide-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.04);
          transition: transform 6s ease;
        }
        .cb-slide.active .cb-slide-image { transform: scale(1); }

        .cb-slide-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(14,13,10,0.15) 0%,
            rgba(14,13,10,0.15) 40%,
            rgba(14,13,10,0.88) 100%
          );
        }

        /* ---------- progress bars ---------- */
        .cb-progress-row {
          position: absolute;
          top: 20px;
          left: 24px;
          right: 24px;
          display: flex;
          gap: 6px;
          z-index: 3;
        }
        @media (max-width: 720px) { .cb-progress-row { left: 16px; right: 16px; } }

        .cb-progress-track {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.25);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .cb-progress-fill {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 0%;
          background: var(--accent);
        }
        .cb-progress-track.done .cb-progress-fill { width: 100%; }
        .cb-progress-track.active .cb-progress-fill {
          animation: cb-fill ${AUTOPLAY_MS}ms linear forwards;
        }
        .cb-root.cb-paused .cb-progress-track.active .cb-progress-fill {
          animation-play-state: paused;
        }
        @keyframes cb-fill { from { width: 0%; } to { width: 100%; } }

        /* ---------- content ---------- */
        .cb-content {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          z-index: 2;
          padding: 0 48px 56px;
          max-width: 720px;
        }
        @media (max-width: 720px) { .cb-content { padding: 0 20px 40px; max-width: 100%; } }

        .cb-eyebrow {
          display: inline-block;
          background: var(--accent);
          color: var(--accent-ink);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 10px;
          margin-bottom: 16px;
        }

        .cb-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          color: #fff;
          font-size: clamp(26px, 4.6vw, 52px);
          line-height: 1.02;
          margin: 0 0 14px 0;
        }

        .cb-desc {
          font-family: 'Work Sans', sans-serif;
          color: rgba(255,255,255,0.78);
          font-size: 15px;
          line-height: 1.6;
          max-width: 52ch;
          margin: 0 0 22px 0;
        }
        @media (max-width: 720px) { .cb-desc { display: none; } }

        .cb-cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .cb-price { color: #fff; font-size: 18px; font-weight: 600; }
        .cb-cta-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: #fff;
          color: var(--ink);
          border: 1px solid #fff;
          padding: 13px 22px;
          cursor: pointer;
        }
        .cb-cta-btn:hover { background: transparent; color: #fff; }
        .cb-cta-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* ---------- arrows ---------- */
        .cb-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 44px;
          height: 44px;
          background: rgba(21,20,15,0.45);
          border: 1px solid rgba(255,255,255,0.35);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .cb-arrow:hover { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
        .cb-arrow:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .cb-arrow.prev { left: 20px; }
        .cb-arrow.next { right: 20px; }
        @media (max-width: 720px) { .cb-arrow { width: 36px; height: 36px; } .cb-arrow.prev { left: 10px; } .cb-arrow.next { right: 10px; } }

        /* ---------- slide counter ---------- */
        .cb-counter {
          position: absolute;
          bottom: 24px;
          right: 24px;
          z-index: 3;
          color: rgba(255,255,255,0.75);
          font-size: 12px;
        }
        @media (max-width: 720px) { .cb-counter { display: none; } }
      `}</style>

      <div className={`cb-progress-row`}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`cb-progress-track ${i < index ? "done" : ""} ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            role="button"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className="cb-progress-fill" />
          </div>
        ))}
      </div>

      {SLIDES.map((s, i) => (
        <div className={`cb-slide ${i === index ? "active" : ""}`} key={s.title} aria-hidden={i !== index}>
          <img className="cb-slide-image" src={s.image} alt="" />
          <div className="cb-slide-scrim" />
        </div>
      ))}

      <div className="cb-content w-full max-w-[1200px]  ">
        <span className="cb-eyebrow cb-mono">{SLIDES[index].eyebrow}</span>
        <h2 className="cb-title">{SLIDES[index].title}</h2>
        <p className="cb-desc">{SLIDES[index].desc}</p>
        <div className="cb-cta-row">
          <span className="cb-price cb-mono">{SLIDES[index].price}</span>
          <button className="cb-cta-btn">{SLIDES[index].cta}</button>
        </div>
      </div>

      <button className="cb-arrow prev" onClick={prev} aria-label="Previous slide">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 2L4 8L10 14" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button className="cb-arrow next" onClick={next} aria-label="Next slide">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 2L12 8L6 14" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>

      <div className="cb-counter cb-mono">
        {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}