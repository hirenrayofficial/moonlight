"use client"
import React, { useState } from "react";

/**
 * STOCKROOM — footer
 * Same system as the rest: hairline rules, mono labels, sharp corners.
 * Signature bit: a warehouse "manifest" line (address, hours, next
 * dispatch) instead of a generic newsletter teaser.
 */

const LINK_COLUMNS = [
  {
    title: "Catalog",
    links: ["Kitchen", "Workwear", "Tools", "New arrivals", "Full catalog"],
  },
  {
    title: "Company",
    links: ["About", "Warehouse tour", "Careers", "Wholesale"],
  },
  {
    title: "Support",
    links: ["Shipping", "Returns", "Track an order", "Contact"],
  },
];

const SOCIALS = ["Instagram", "X", "YouTube"];

function useSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitted

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  return { email, setEmail, status, handleSubmit };
}

export default function Footer() {
  const { email, setEmail, status, handleSubmit } = useSubscribe();
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ft-root {
          --bg: #15140f;
          --paper: #1c1b16;
          --ink: #ecece4;
          --ink-dim: #9b9a8c;
          --ink-faint: #6c6b5f;
          --line: #34332a;
          --line-strong: #47463a;
          --accent: #f2b705;
          --accent-ink: #15140f;

          background: var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          width: 100%;
        }
        .ft-root * { box-sizing: border-box; }

        .ft-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }
        .ft-inner { max-width: 1200px; margin: 0 auto; padding: 56px 32px 0; }
        @media (max-width: 720px) { .ft-inner { padding: 40px 20px 0; } }

        /* ---------- manifest strip ---------- */
        .ft-manifest {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--line-strong);
          margin-bottom: 48px;
        }
        @media (max-width: 720px) { .ft-manifest { grid-template-columns: repeat(2, 1fr); } }

        .ft-manifest-cell {
          padding: 18px 20px;
          border-right: 1px solid var(--line-strong);
        }
        .ft-manifest-cell:last-child { border-right: none; }
        @media (max-width: 720px) {
          .ft-manifest-cell:nth-child(2n) { border-right: none; }
          .ft-manifest-cell:nth-child(-n+2) { border-bottom: 1px solid var(--line-strong); }
        }
        .ft-manifest-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 6px;
        }
        .ft-manifest-value { font-size: 13px; color: var(--ink); }

        /* ---------- main grid ---------- */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.3fr repeat(3, 0.8fr) 1.3fr;
          gap: 32px;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) {
          .ft-grid { grid-template-columns: 1fr 1fr; row-gap: 36px; }
        }
        @media (max-width: 560px) {
          .ft-grid { grid-template-columns: 1fr; }
        }

        .ft-brand-col { grid-column: span 1; }
        @media (max-width: 900px) { .ft-brand-col { grid-column: span 2; } }
        @media (max-width: 560px) { .ft-brand-col { grid-column: span 1; } }

        .ft-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .ft-brand-mark {
          width: 22px;
          height: 22px;
          background: var(--accent);
          color: var(--accent-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        .ft-brand-name {
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .ft-tagline {
          font-size: 13px;
          line-height: 1.6;
          color: var(--ink-dim);
          max-width: 34ch;
        }

        .ft-col-title {
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 14px;
        }
        .ft-col-links { display: flex; flex-direction: column; gap: 10px; }
        .ft-col-link {
          font-size: 13px;
          color: var(--ink-dim);
          text-decoration: none;
          width: fit-content;
          border-bottom: 1px solid transparent;
        }
        .ft-col-link:hover { color: var(--ink); border-color: var(--line-strong); }
        .ft-col-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .ft-sub-col { grid-column: span 1; }
        @media (max-width: 560px) { .ft-sub-col { grid-column: span 1; } }

        .ft-sub-desc {
          font-size: 12.5px;
          line-height: 1.6;
          color: var(--ink-dim);
          margin-bottom: 14px;
        }
        .ft-sub-form { display: flex; border: 1px solid var(--line-strong); }
        .ft-sub-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          padding: 11px 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--ink);
        }
        .ft-sub-input::placeholder { color: var(--ink-faint); }
        .ft-sub-input:focus { outline: none; }
        .ft-sub-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--accent);
          color: var(--accent-ink);
          border: none;
          padding: 0 16px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ft-sub-btn:hover { background: var(--ink); color: var(--bg); }
        .ft-sub-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .ft-sub-note { font-size: 11px; color: var(--ink-faint); margin-top: 8px; }
        .ft-sub-success { font-size: 12.5px; color: var(--accent); }

        /* ---------- bottom bar ---------- */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 20px 32px;
        }
        @media (max-width: 720px) { .ft-bottom { padding: 20px; } }

        .ft-copyright { font-size: 11.5px; color: var(--ink-faint); }
        .ft-bottom-links { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .ft-bottom-link {
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--ink-faint);
          text-decoration: none;
        }
        .ft-bottom-link:hover { color: var(--ink); }
        .ft-bottom-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      `}</style>

      <div className="ft-inner">
        <div className="ft-manifest">
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Warehouse</div>
            <div className="ft-manifest-value">412 Foundry St, Akron, OH</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Hours</div>
            <div className="ft-manifest-value">Mon–Fri, 8am–5pm ET</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Next dispatch</div>
            <div className="ft-manifest-value">Today, 3:00pm ET</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Support</div>
            <div className="ft-manifest-value">help@stockroom.co</div>
          </div>
        </div>

        <div className="ft-grid">
          <div className="ft-brand-col">
            <div className="ft-brand">
              <div className="ft-brand-mark">S</div>
              <span className="ft-brand-name">Stockroom</span>
            </div>
            <p className="ft-tagline">
              Goods sourced direct, marked up once, and shipped from a
              warehouse we'll happily show you on camera.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div className="ft-sub-col" key={col.title}>
              <div className="ft-col-title ft-mono">{col.title}</div>
              <div className="ft-col-links">
                {col.links.map((l) => (
                  <a className="ft-col-link" href="#" key={l}>{l}</a>
                ))}
              </div>
            </div>
          ))}

          <div className="ft-sub-col">
            <div className="ft-col-title ft-mono">Restock alerts</div>
            <p className="ft-sub-desc">
              One email when a sold-out item is back. Nothing else.
            </p>
            {status === "submitted" ? (
              <p className="ft-sub-success ft-mono">You're on the list.</p>
            ) : (
              <form className="ft-sub-form" onSubmit={handleSubmit}>
                <input
                  className="ft-sub-input"
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button className="ft-sub-btn" type="submit">Notify me</button>
              </form>
            )}
            <p className="ft-sub-note ft-mono">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copyright ft-mono">© {year} Stockroom Supply Co.</span>
          <div className="ft-bottom-links">
            {SOCIALS.map((s) => (
              <a className="ft-bottom-link ft-mono" href="#" key={s}>{s}</a>
            ))}
            <a className="ft-bottom-link ft-mono" href="#">Privacy</a>
            <a className="ft-bottom-link ft-mono" href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}