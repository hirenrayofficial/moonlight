"use client";
import React, { useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import "./branchroute.scss";

/**
 * MOONLIGHT MACHINERY — branch route
 * A curved SVG line runs down the section; it draws itself as you scroll
 * (pathLength driven by scroll progress), and each branch stop lights up
 * once the line reaches it — same idea as a metro-map "next stop" effect.
 */

// isHQ: true,

const BRANCHES = [
  {
    city: "Gurgaon",
    state: "Haryana",
    // address: "Unavailable",
    phone: "+91 8178445597",
    isHQ: true,
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    // address: "Unavailable",
    phone: "+91 9354327757",
  },
  {
    city: "Siliguri",
    state: "West Bengal",
    address: "Eastern Bypass, PCRA Colony, Siliguri, West Bengal 734001",
    phone: "+91 8178445597",
  },
  {
    city: "Guwahati",
    state: "Assam",
    // address: "Unavailable",
    phone: "+91 9883500259",
  },
  {
    city: "Gaziabad",
    state: "Uttar Pradesh",
    // address: "Unavailable",
    phone: "+91 9907330121",
  },
];

// Builds a smooth zig-zag "route" path in a 0–100 coordinate space using
// cubic beziers with vertically-offset control points, which produces a
// gentle S-curve between each consecutive stop instead of sharp corners.
function buildRoutePath(count) {
  const points = Array.from({ length: count }, (_, i) => ({
    x: i === 0 || i === count - 1 ? 50 : i % 2 === 0 ? 32 : 68,
    y: (i / (count - 1)) * 100,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return { d, points };
}

export default function BranchRoute() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { d: pathD, points } = useMemo(
    () => buildRoutePath(BRANCHES.length),
    [],
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.35"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.floor(v * BRANCHES.length);
    setActiveIndex(Math.min(BRANCHES.length - 1, Math.max(-1, idx)));
  });

  return (
    <section className="br-root">
      <div className="br-inner">
        <div className="br-head">
          <span className="br-eyebrow">Where we operate</span>
          <h2 className="br-title">Five branches, one route</h2>
          <p className="br-subhead">
            Scroll down — the line traces our footprint from HQ to the newest
            branch.
          </p>
        </div>

        <div className="br-route" ref={containerRef}>
          <div className="br-line-col" aria-hidden="true">
            <svg
              className="br-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* faint full-length guide line, always visible */}
              <path
                d={pathD}
                className="br-path-track"
                vectorEffect="non-scaling-stroke"
                fill="none"
              />
              {/* animated draw-on-scroll line, on top of the guide */}
              <motion.path
                d={pathD}
                className="br-path-fill"
                fill="none"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
            </svg>

            {points.map((p, i) => (
              <div
                key={BRANCHES[i].city}
                className={`br-dot ${i <= activeIndex ? "active" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            ))}
          </div>

          <div className="br-stops">
            {BRANCHES.map((b, i) => (
              <motion.div
                key={b.city}
                className={`br-stop ${i <= activeIndex ? "active" : ""} ${i % 2 === 0 ? "left" : "right"}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {b.isHQ && <span className="br-hq-badge">Headquarters</span>}
                <div className="br-stop-city">{b.city}</div>
                <div className="br-stop-state">{b.state}</div>
                <div className="br-stop-address">{b.address}</div>
                <a
                  className="br-stop-phone"
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                >
                  {b.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
