"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import './crousal.scss'
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

  const handelClick = () => {
    window.location.href = "/home/machines"
  }

  return (
    <div
      className={`cb-root ${paused ? "cb-paused" : ""} w-full py-16`}
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
          <button className="cb-cta-btn" onClick={(e)=>handelClick()}>{SLIDES[index].cta}</button>
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