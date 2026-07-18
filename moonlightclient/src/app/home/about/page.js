"use client";
import React from "react";
import "./about.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * MOONLIGHT MACHINERY — about us
 * Same paper/ink/accent system as Contact/Mview. Leads with numbers
 * instead of a founder photo montage — fits a machinery business better
 * than lifestyle copy would.
 */

const STATS = [
  { label: "Years in business", value: "14" },
  { label: "Machines delivered", value: "2,300+" },
  { label: "States served", value: "19" },
  { label: "Repeat clients", value: "68%" },
];

const VALUES = [
  {
    title: "Built to run daily",
    desc: "Every machine is tested under real production load before it leaves the factory floor, not just powered on and boxed.",
  },
  {
    title: "Straight pricing",
    desc: "One quoted price, one invoice. No separate 'installation surprise' or hidden freight markup after the fact.",
  },
  {
    title: "We answer the phone",
    desc: "Sales and after-sales support come from the same small team — the person who sold you the machine can also help fix it.",
  },
  {
    title: "Parts, not excuses",
    desc: "Genuine spares kept in stock for every machine line we sell, so a breakdown means a part shipped, not a rebuild quote.",
  },
];

const TIMELINE = [
  { year: "2011", title: "Founded in Gurgaon", desc: "Started as a two-person repair shop for paper plate machines." },
  { year: "2015", title: "First in-house production line", desc: "Began manufacturing our own semi-automatic machines instead of only reselling." },
  { year: "2019", title: "Pan-India dispatch", desc: "Expanded logistics to ship and install machines across 19 states." },
  { year: "2024", title: "Full-automatic range launched", desc: "Introduced hydraulic and full-automatic lines alongside the original manual machines." },
];

export default function About() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((s) => s !== "");

  return (
    <div className="ab-root py-24 w-full max-w-[1200px] mx-auto">
      {/* <div className="ab-crumb ab-mono flex hidden md:flex">
        <Link href="/">Home</Link>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          return (
            <div key={href} className="flex gap-2">
              <span>/</span>
              <Link href={href} className="capitalize text-gray-500">
                {segment.replace(/-/g, " ")}
              </Link>
            </div>
          );
        })}
      </div> */}

      {/* ---------- intro ---------- */}
      <section className="ab-intro">
        <div className="ab-eyebrow ab-mono">About us</div>
        <h1 className="ab-title">Machines that earn their keep</h1>
        <p className="ab-subhead">
          Moonlight Machinery builds and supplies paper plate, cup, lamination, and
          cotton wick machines for small manufacturers across India. We started as a
          repair shop — that's still how we think about every machine we sell: it
          has to run, every day, without a service call every month.
        </p>
      </section>

      {/* ---------- stats ---------- */}
      <section className="ab-stats">
        {STATS.map((s) => (
          <div className="ab-stat-cell" key={s.label}>
            <div className="ab-stat-value ab-mono">{s.value}</div>
            <div className="ab-stat-label ab-mono">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- values ---------- */}
      <section className="ab-section">
        <div className="ab-section-head">
          <div className="ab-eyebrow ab-mono">Why people buy from us</div>
          <h2 className="ab-section-title">Not the cheapest quote. The one you don't regret.</h2>
        </div>
        <div className="ab-values-grid">
          {VALUES.map((v) => (
            <div className="ab-value-card" key={v.title}>
              <h3 className="ab-value-title">{v.title}</h3>
              <p className="ab-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- timeline ---------- */}
      <section className="ab-section">
        <div className="ab-section-head">
          <div className="ab-eyebrow ab-mono">How we got here</div>
          <h2 className="ab-section-title">Fourteen years, four turning points</h2>
        </div>
        <div className="ab-timeline">
          {TIMELINE.map((t) => (
            <div className="ab-timeline-row" key={t.year}>
              <div className="ab-timeline-year ab-mono">{t.year}</div>
              <div className="ab-timeline-body">
                <div className="ab-timeline-title">{t.title}</div>
                <p className="ab-timeline-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- cta ---------- */}
      <section className="ab-cta">
        <div>
          <div className="ab-cta-title">Have a production line in mind?</div>
          <p className="ab-cta-desc">Tell us your output target and we'll recommend the right machine.</p>
        </div>
        <Link href="/contact" className="ab-cta-btn">Talk to us</Link>
      </section>
    </div>
  );
}