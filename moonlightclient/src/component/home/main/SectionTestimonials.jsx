import React from "react";

/**
 * STOCKROOM — reviews section
 * Ratings shown as filled blocks (not stars — stays in the hardware-tag
 * visual language) plus a distribution bar, like an inspection report.
 */

const REVIEWS = [
  // {
  //   name: "R. Okafor",
  //   product: "Cast-iron skillet, 10in",
  //   rating: 5,
  //   date: "2026-05-14",
  //   verified: true,
  //   text: "Heavier than the one it replaced, in a good way. Even heat, no hot spots. Seasoning held up through a dishwasher mistake.",
  // },
  {
    name: "A. Patel",
    product: "Fully Automatic Paper Cup Machine",
    rating: 4,
    date: "2026-05-10",
    verified: true,
    text: "The machine is very efficient and easy to use. It has significantly improved our production speed.",
  },
  {
    name: "L. Smith",
    product: "Automatic Single Die Paper Plate Machine",
    rating: 5,
    date: "2026-05-08",
    verified: false,
    text: "This machine has been a game-changer for our business. The quality of the plates is excellent.",
  },
  {
    name: "M. Johnson",
    product: "Fully Automatic Paper Plate Machine",
    rating: 3,
    date: "2026-05-05",
    verified: true,
    text: "The machine works well, but we had some initial setup issues that took time to resolve.",
  },
  {
    name: "S. Lee", 
    product: "Disposable Bowl single die Machine",
    rating: 4,
    date: "2026-05-02",
    verified: true,
    text: "Good value for the price. The machine is reliable and has a decent production rate.",
  },
  {
    name: "J. Kim",
    product: "Fully Automatic Paper Cup Machine",
    rating: 5,
    date: "2026-04-30",
    verified: false,
    text: "Excellent machine! It has exceeded our expectations in terms of performance and durability.",
  },
  {
    name: "D. Brown",
    product: "Automatic Single Die Paper Plate Machine",
    rating: 2,
    date: "2026-04-28",
    verified: true,
    text: "The machine is okay, but we experienced some issues with the cutting mechanism.",
  }
  
];

const DISTRIBUTION = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 24 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

function average(reviews) {
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function RatingBlocks({ rating }) {
  return (
    <div className="tm-blocks" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`tm-block ${n <= rating ? "filled" : ""}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const avg = average(REVIEWS);

  return (
    <section className="tm-root">
      <style>{`
 
        .tm-root {
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
        .tm-root * { box-sizing: border-box; }
        @media (max-width: 720px) { .tm-root { padding: 40px 20px 48px; } }

        .tm-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }
        .tm-inner { max-width: 1200px; margin: 0 auto; }

        /* ---------- summary ---------- */
        .tm-summary {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 40px;
          border: 1px solid var(--line-strong);
          background: var(--paper);
          padding: 28px 32px;
          margin-bottom: 32px;
        }
        @media (max-width: 720px) {
          .tm-summary { grid-template-columns: 1fr; gap: 20px; padding: 24px 20px; }
        }

        .tm-score-block { display: flex; flex-direction: column; gap: 8px; }
        .tm-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .tm-score { font-size: 40px; font-weight: 600; line-height: 1; }
        .tm-score-sub { font-size: 12px; color: var(--ink-dim); }

        .tm-dist { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
        .tm-dist-row { display: grid; grid-template-columns: 44px 1fr 32px; align-items: center; gap: 10px; }
        .tm-dist-label { font-size: 11px; color: var(--ink-faint); }
        .tm-dist-track { height: 6px; background: var(--line); position: relative; }
        .tm-dist-fill { height: 100%; background: var(--ink); }
        .tm-dist-pct { font-size: 11px; color: var(--ink-faint); text-align: right; }

        /* ---------- header ---------- */
        .tm-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tm-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(22px, 2.8vw, 30px);
          line-height: 1;
          margin: 0;
        }
        .tm-count { font-size: 12px; color: var(--ink-faint); }

        /* ---------- grid ---------- */
        .tm-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line-strong);
          border: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) { .tm-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .tm-grid { grid-template-columns: 1fr; } }

        .tm-card {
          background: var(--paper);
          padding: 20px 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tm-blocks { display: flex; gap: 3px; }
        .tm-block { width: 12px; height: 6px; background: var(--line); }
        .tm-block.filled { background: var(--accent); }

        .tm-text { font-size: 13.5px; line-height: 1.6; color: var(--ink); flex: 1; }

        .tm-meta { border-top: 1px solid var(--line); padding-top: 12px; }
        .tm-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .tm-name { font-size: 12.5px; font-weight: 600; }
        .tm-verified {
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-dim);
          border: 1px solid var(--line-strong);
          padding: 2px 6px;
        }
        .tm-product { font-size: 11px; color: var(--ink-faint); }
      `}</style>

      <div className="tm-inner">
        <div className="tm-summary">
          <div className="tm-score-block">
            <span className="tm-eyebrow tm-mono">Overall rating</span>
            <span className="tm-score tm-mono">{avg.toFixed(1)}</span>
            <span className="tm-score-sub tm-mono">from {REVIEWS.length.toLocaleString("en-US")}+ reviews</span>
          </div>

          <div className="tm-dist">
            {DISTRIBUTION.map((d) => (
              <div className="tm-dist-row" key={d.stars}>
                <span className="tm-dist-label tm-mono">{d.stars} / 5</span>
                <div className="tm-dist-track">
                  <div className="tm-dist-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="tm-dist-pct tm-mono">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tm-head">
          <h2 className="tm-title">What ships out gets used</h2>
          <span className="tm-count tm-mono">Showing {REVIEWS.length} of 1,842 reviews</span>
        </div>

        <div className="tm-grid">
          {REVIEWS.map((r) => (
            <div className="tm-card" key={r.name + r.date}>
              <RatingBlocks rating={r.rating} />
              <p className="tm-text">{r.text}</p>
              <div className="tm-meta">
                <div className="tm-meta-row">
                  <span className="tm-name">{r.name}</span>
                  {r.verified && <span className="tm-verified tm-mono">Verified</span>}
                </div>
                <div className="tm-product tm-mono">{r.product} · {r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}