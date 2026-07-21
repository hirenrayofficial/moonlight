"use client";
import React, { useEffect, useState } from "react";

/**
 * STOCKROOM — cookie consent
 * Bottom banner + a granular preferences panel. Persists the choice in
 * localStorage and re-shows automatically if consent is missing or stale.
 *
 * IMPORTANT: this component only handles the UI/state layer (asking,
 * storing, and exposing the choice). Actual legal compliance also
 * requires: not loading analytics/marketing scripts until consent is
 * granted, a real privacy policy this links to, and region-specific
 * rules (GDPR opt-in vs CCPA opt-out behave differently). Wire your
 * script-loading logic to `onConsentChange` below rather than assuming
 * this component alone makes the site compliant.
 */

const STORAGE_KEY = "cookie_consent_v1";
const CONSENT_VERSION = 1;

const CATEGORIES = [
  {
    key: "necessary",
    label: "Necessary",
    desc: "Required for login, cart, and basic site function. Always on.",
    locked: true,
  },
  {
    key: "functional",
    label: "Functional",
    desc: "Remembers preferences like currency, region, and recently viewed items.",
    locked: false,
  },
  {
    key: "analytics",
    label: "Analytics",
    desc: "Helps us see which pages are used, so we can fix what's broken.",
    locked: false,
  },
  {
    key: "marketing",
    label: "Marketing",
    desc: "Used for retargeting ads and measuring campaign performance.",
    locked: false,
  },
];

const defaultPrefs = { necessary: true, functional: false, analytics: false, marketing: false };

function loadStoredConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null; // policy changed — ask again
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  const record = { version: CONSENT_VERSION, prefs, timestamp: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage unavailable (private mode, quota, etc.) — consent still
    // applies for this session via component state, just won't persist.
  }
  return record;
}

export default function CookieConsent({ onConsentChange, privacyHref = "/privacy" }) {
  const [visible, setVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [hasDecided, setHasDecided] = useState(false);

  useEffect(() => {
    const stored = loadStoredConsent();
    if (stored) {
      setPrefs(stored.prefs);
      setHasDecided(true);
      onConsentChange?.(stored.prefs);
    } else {
      setVisible(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function commit(nextPrefs) {
    saveConsent(nextPrefs);
    setPrefs(nextPrefs);
    setHasDecided(true);
    setVisible(false);
    setPanelOpen(false);
    onConsentChange?.(nextPrefs);
  }

  function acceptAll() {
    commit({ necessary: true, functional: true, analytics: true, marketing: true });
  }

  function rejectNonEssential() {
    commit({ necessary: true, functional: false, analytics: false, marketing: false });
  }

  function savePreferences() {
    commit(prefs);
  }

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function reopen() {
    setVisible(true);
    setPanelOpen(true);
  }

  return (
    <>
      <style>{`

        .ck-wrap {
          --bg: #15140f;
          --panel: #1c1b16;
          --panel-raised: #232219;
          --line-strong: #47463a;
          --ink: #ecece4;
          --ink-dim: #9b9a8c;
          --ink-faint: #6c6b5f;
          --accent: #f2b705;
          --accent-ink: #15140f;
        }
        .ck-wrap * { box-sizing: border-box; }
        .ck-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        /* ---------- banner ---------- */
        .ck-banner {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 200;
          background: var(--panel);
          border-top: 1px solid var(--line-strong);
          padding: 20px 32px;
        }
        @media (max-width: 720px) { .ck-banner { padding: 16px; } }

        .ck-banner-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ck-text { flex: 1; min-width: 240px; }
        .ck-title {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 6px;
        }
        .ck-desc { font-size: 13px; line-height: 1.55; color: var(--ink); max-width: 62ch; }
        .ck-desc a { color: var(--accent); text-decoration: underline; }

        .ck-actions { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
        .ck-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 11px 16px;
          border: 1px solid var(--line-strong);
          background: transparent;
          color: var(--ink-dim);
          cursor: pointer;
        }
        .ck-btn:hover { color: var(--ink); border-color: var(--ink-dim); }
        .ck-btn.primary {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
        }
        .ck-btn.primary:hover { background: transparent; color: var(--accent); }
        .ck-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* ---------- reopen tab ---------- */
        .ck-reopen {
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 150;
          background: var(--panel);
          color: var(--ink-dim);
          border: 1px solid var(--line-strong);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 8px 12px;
          cursor: pointer;
        }
        .ck-reopen:hover { color: var(--ink); border-color: var(--ink-dim); }
        .ck-reopen:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* ---------- preferences overlay ---------- */
        .ck-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 210;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .ck-modal {
          width: 100%;
          max-width: 480px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          background: var(--panel);
          border: 1px solid var(--line-strong);
        }
        .ck-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--line-strong);
          flex-shrink: 0;
        }
        .ck-modal-title { font-size: 14px; font-weight: 600; color: var(--ink); }
        .ck-modal-close { background: none; border: none; color: var(--ink-faint); font-size: 16px; cursor: pointer; }
        .ck-modal-close:hover { color: var(--ink); }

        .ck-modal-body { padding: 4px 20px 20px; overflow-y: auto; }

        .ck-cat {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--line-strong);
        }
        .ck-cat:last-child { border-bottom: none; }
        .ck-cat-label { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
        .ck-cat-desc { font-size: 12px; color: var(--ink-dim); line-height: 1.5; max-width: 34ch; }
        .ck-cat-locked { font-size: 10px; color: var(--ink-faint); margin-top: 4px; }

        /* switch */
        .ck-switch {
          position: relative;
          width: 38px;
          height: 21px;
          flex-shrink: 0;
          background: var(--line-strong);
          border: none;
          cursor: pointer;
          margin-top: 2px;
        }
        .ck-switch.on { background: var(--accent); }
        .ck-switch.locked { opacity: 0.5; cursor: not-allowed; }
        .ck-switch-knob {
          position: absolute;
          top: 2px; left: 2px;
          width: 17px; height: 17px;
          background: var(--panel);
          transition: transform 0.15s ease;
        }
        .ck-switch.on .ck-switch-knob { transform: translateX(17px); background: var(--accent-ink); }
        .ck-switch:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .ck-modal-actions {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid var(--line-strong);
          flex-shrink: 0;
        }
        .ck-modal-actions .ck-btn { flex: 1; }
      `}</style>

      <div className="ck-wrap">
        {visible && !panelOpen && (
          <div className="ck-banner" role="dialog" aria-label="Cookie consent">
            <div className="ck-banner-inner">
              <div className="ck-text">
                <div className="ck-title ck-mono">A note on cookies</div>
                <p className="ck-desc">
                  We use cookies to run the site, remember your preferences, and understand
                  how it's used. Choose what you're comfortable with — see our{" "}
                  <a href={privacyHref}>privacy policy</a> for details.
                </p>
              </div>
              <div className="ck-actions">
                {/* <button className="ck-btn" onClick={() => setPanelOpen(true)}>Customize</button> */}
                <button className="ck-btn" onClick={rejectNonEssential}>Reject non-essential</button>
                <button className="ck-btn primary" onClick={acceptAll}>Accept all</button>
              </div>
            </div>
          </div>
        )}

        {/* {hasDecided && !visible && (
          <button className="ck-reopen ck-mono" onClick={reopen}>
            Cookie settings
          </button>
        )} */}

        {panelOpen && (
          <div className="ck-overlay" onClick={() => setPanelOpen(false)}>
            <div className="ck-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ck-modal-head">
                <span className="ck-modal-title">Cookie preferences</span>
                <button className="ck-modal-close" onClick={() => setPanelOpen(false)}>✕</button>
              </div>

              <div className="ck-modal-body">
                {CATEGORIES.map((cat) => (
                  <div className="ck-cat" key={cat.key}>
                    <div>
                      <div className="ck-cat-label">{cat.label}</div>
                      <div className="ck-cat-desc">{cat.desc}</div>
                      {cat.locked && <div className="ck-cat-locked ck-mono">Always active</div>}
                    </div>
                    <button
                      className={`ck-switch ${prefs[cat.key] ? "on" : ""} ${cat.locked ? "locked" : ""}`}
                      onClick={() => !cat.locked && toggle(cat.key)}
                      disabled={cat.locked}
                      role="switch"
                      aria-checked={prefs[cat.key]}
                      aria-label={cat.label}
                    >
                      <span className="ck-switch-knob" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="ck-modal-actions">
                <button className="ck-btn" onClick={rejectNonEssential}>Reject non-essential</button>
                <button className="ck-btn primary" onClick={savePreferences}>Save preferences</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}