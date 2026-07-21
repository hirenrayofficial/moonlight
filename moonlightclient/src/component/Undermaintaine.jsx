"use client";
import React, { useEffect, useState } from "react";

/**
 * MOONLIGHT MACHINERY — under maintenance
 * Same paper/ink/accent system as the rest of the site. Shows a live
 * countdown if a return time is set, and keeps Call/WhatsApp reachable
 * since "the site's down" shouldn't mean "we're unreachable."
 */

// Set this to a real ISO datetime to show a countdown, or leave null to
// just show the static message with no timer.
const RETURN_AT = null; // e.g. "2026-07-20T09:00:00+05:30"

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+918178445596";
const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+918178445596";

function useCountdown(targetIso) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        done: false,
      });
    }

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [targetIso]);

  return timeLeft;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function UnderMaintenance() {
  const timeLeft = useCountdown(RETURN_AT);

  function callNow() {
    window.location.href = `tel:${BUSINESS_PHONE}`;
  }

  function openWhatsApp() {
    const message = "Hi, I saw the site is under maintenance — I had a question.";
    const url = `https://wa.me/${WHATSAPP_PHONE.replace(/[^\d+]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="mt-root">
      <style>{`
 
        .mt-root {
          --bg: #faf9f5;
          --paper: #ffffff;
          --ink: #15140f;
          --ink-dim: #5a594e;
          --ink-faint: #9b9a8c;
          --line: #d9d6c9;
          --line-strong: #b8b5a4;
          --accent: #f2b705;
          --accent-ink: #15140f;
          --whatsapp: #3fae5c;

          background: var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }
        .mt-root * { box-sizing: border-box; }
        .mt-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        .mt-card {
          width: 100%;
          max-width: 560px;
          border: 1px solid var(--line-strong);
          background: var(--paper);
          text-align: center;
          padding: 48px 40px;
        }
        @media (max-width: 560px) { .mt-card { padding: 36px 24px; } }

        .mt-icon {
          width: 56px;
          height: 56px;
          border: 1px solid var(--line-strong);
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-ink);
          background: var(--accent);
        }
        .mt-icon svg { animation: mt-turn 3.5s linear infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .mt-icon svg { animation: none; } }
        @keyframes mt-turn { to { transform: rotate(360deg); } }

        .mt-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 12px;
        }

        .mt-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(24px, 4vw, 32px);
          line-height: 1.05;
          margin: 0 0 14px 0;
        }

        .mt-desc {
          font-size: 14px;
          line-height: 1.65;
          color: var(--ink-dim);
          max-width: 42ch;
          margin: 0 auto 28px;
        }

        .mt-countdown {
          display: flex;
          justify-content: center;
          gap: 1px;
          background: var(--line-strong);
          border: 1px solid var(--line-strong);
          margin-bottom: 28px;
        }
        .mt-count-cell {
          background: var(--paper);
          padding: 12px 14px;
          min-width: 64px;
        }
        .mt-count-value { font-size: 22px; font-weight: 600; }
        .mt-count-label {
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-top: 4px;
        }

        .mt-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
        .mt-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--ink);
          color: var(--bg);
          border: 1px solid var(--ink);
          padding: 12px 20px;
          cursor: pointer;
        }
        .mt-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        .mt-btn.whatsapp { background: var(--whatsapp); border-color: var(--whatsapp); color: #fff; }
        .mt-btn.whatsapp:hover { background: var(--ink); border-color: var(--ink); }
        .mt-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        .mt-meta { font-size: 11px; color: var(--ink-faint); }
      `}</style>

      <div className="mt-card">
        <div className="mt-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M13 3.5L14.6 6.4L17.8 5.7L17.4 9L20.2 10.8L17.9 13L20.2 15.2L17.4 17L17.8 20.3L14.6 19.6L13 22.5L11.4 19.6L8.2 20.3L8.6 17L5.8 15.2L8.1 13L5.8 10.8L8.6 9L8.2 5.7L11.4 6.4L13 3.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="13" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>

        <div className="mt-eyebrow mt-mono">Scheduled maintenance</div>
        <h1 className="mt-title">We're tightening a few bolts</h1>
        <p className="mt-desc">
          The site's offline for a short update. Your orders and enquiries are
          safe — nothing was lost. We'll be back shortly.
        </p>

        {RETURN_AT && timeLeft && !timeLeft.done && (
          <div className="mt-countdown">
            <div className="mt-count-cell">
              <div className="mt-count-value mt-mono">{pad(timeLeft.days)}</div>
              <div className="mt-count-label">Days</div>
            </div>
            <div className="mt-count-cell">
              <div className="mt-count-value mt-mono">{pad(timeLeft.hours)}</div>
              <div className="mt-count-label">Hrs</div>
            </div>
            <div className="mt-count-cell">
              <div className="mt-count-value mt-mono">{pad(timeLeft.minutes)}</div>
              <div className="mt-count-label">Min</div>
            </div>
            <div className="mt-count-cell">
              <div className="mt-count-value mt-mono">{pad(timeLeft.seconds)}</div>
              <div className="mt-count-label">Sec</div>
            </div>
          </div>
        )}

        <div className="mt-actions">
          <button className="mt-btn" onClick={callNow}>☎️ Call us</button>
          <button className="mt-btn whatsapp" onClick={openWhatsApp}>💬 WhatsApp</button>
        </div>

        <p className="mt-meta mt-mono">Moonlight Machinery · back online shortly</p>
      </div>
    </div>
  );
}