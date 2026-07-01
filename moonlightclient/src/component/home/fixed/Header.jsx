import React from "react";

/**
 * MOONLIGHT — utilitarian header
 * Same system as the Stockroom hero: paper background, hairline rule,
 * monospace nav labels, sharp corners. No blur, no pill button.
 */

export default function Header() {
  return (
    <header className="hd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .hd-root {
          --bg: #faf9f5;
          --ink: #15140f;
          --ink-dim: #5a594e;
          --line-strong: #b8b5a4;
          --accent: #f2b705;
          --accent-ink: #15140f;

          position: fixed;
          top: 0;
          left: 0;
          z-index: 40;
          width: 100%;
          background: var(--bg);
          border-bottom: 1px solid var(--line-strong);
          font-family: 'IBM Plex Mono', monospace;
        }
        .hd-root * { box-sizing: border-box; }

        .hd-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
        }
        @media (min-width: 768px) {
          .hd-inner { padding: 14px 0; }
        }

        .hd-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hd-brand-mark {
          width: 22px;
          height: 22px;
          background: var(--ink);
          color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .hd-brand-name {
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink);
        }

        .hd-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .hd-nav {
          display: none;
          align-items: center;
          gap: 28px;
        }
        @media (min-width: 768px) {
          .hd-nav { display: flex; }
        }
        .hd-nav-link {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-dim);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .hd-nav-link:hover { color: var(--ink); border-color: var(--line-strong); }
        .hd-nav-link:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .hd-shop-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--ink);
          color: var(--bg);
          border: 1px solid var(--ink);
          padding: 9px 18px;
          cursor: pointer;
        }
        .hd-shop-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        .hd-shop-btn:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }
      `}</style>

      <div className="hd-inner">
        <div className="hd-brand">
          <div className="hd-brand-mark">M</div>
          <span className="hd-brand-name">Moonlight</span>
        </div>

        <div className="hd-links">
          <nav className="hd-nav">
            <a className="hd-nav-link" href="#home">Home</a>
            <a className="hd-nav-link" href="#product">Product</a>
            <a className="hd-nav-link" href="#blog">Blog</a>
          </nav>
          <button className="hd-shop-btn">Shop</button>
        </div>
      </div>
    </header>
  );
}