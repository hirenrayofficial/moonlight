"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./crousal.scss";
import { useQuery } from "@tanstack/react-query";
import { slider } from "@/services/home/GetProduct";

/**
 * STOCKROOM — cinematic banner carousel
 * Full-bleed image slides, segmented progress bars instead of dots,
 * autoplay that pauses on hover/focus, keyboard arrows, and touch swipe.
 */

const AUTOPLAY_MS = 5500;

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const trackRef = useRef(null);

  // 1. Fetch data first so it's available for callbacks
  const { data = [] } = useQuery({
    queryKey: ["itema"],
    queryFn: slider,
  });

  const dataLength = data?.length || 0;

  const goTo = useCallback(
    (i) => {
      if (dataLength === 0) return;
      setIndex(((i % dataLength) + dataLength) % dataLength);
    },
    [dataLength]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (paused || dataLength === 0) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const t = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, goTo, dataLength]);

  // Keyboard navigation
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

  const handelClick = (slug) => {
    window.location.href = "/home/machines/"+ slug;
  };

  // Render fallback if data is still loading or empty
  if (!data || data.length === 0) {
    return <div className="cb-root w-full py-16 text-center">Loading carousel...</div>;
  }

  return (
    <div
      className={`cb-root ${paused ? "cb-paused" : ""} w-full py-16`}
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
      <div className="cb-progress-row">
        {data.map((_, i) => (
          <div
            key={i}
            className={`cb-progress-track ${i < index ? "done" : ""} ${
              i === index ? "active" : ""
            }`}
            onClick={() => goTo(i)}
            role="button"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className="cb-progress-fill" />
          </div>
        ))}
      </div>

      {data.map((s, i) => (
        <div
          className={`cb-slide ${i === index ? "active" : ""}`}
          key={s.id || s.title || i}
          aria-hidden={i !== index}
        >
          <img className="cb-slide-image" src={s.images[0]} alt="" />
          <div className="cb-slide-scrim" />
        </div>
      ))}

      <div className="cb-content w-full max-w-[1200px]">
        <h2 className="cb-title">{data[index]?.name}</h2>
        <p className="cb-desc">{data[index]?.desc}</p>
        <div className="cb-cta-row">
          <span className="cb-price cb-mono">{data[index]?.price}</span>
          <button className="cb-cta-btn" onClick={()=>handelClick(data[index]?.slug)}>
            {data[index]?.cta || "Buy Now"}
          </button>
        </div>
      </div>

      <button
        className="cb-arrow prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M10 2L4 8L10 14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>
      <button className="cb-arrow next" onClick={next} aria-label="Next slide">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M6 2L12 8L6 14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>

      <div className="cb-counter cb-mono">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(data.length).padStart(2, "0")}
      </div>
    </div>
  );
}