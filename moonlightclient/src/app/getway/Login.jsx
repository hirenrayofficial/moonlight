"use client"
import React, { useEffect, useRef, useState } from "react";

/**
 * STOCKROOM ADMIN — login
 * Dark, control-panel styling (distinct from the customer-facing paper
 * theme) since this is a restricted internal surface, not a storefront.
 * Two-step flow: credentials, then a 6-digit verification code.
 *
 * Demo credentials (replace with real auth):
 *   username: admin
 *   password: stockroom2026
 */

const DEMO_USER = "admin";
const DEMO_PASS = "stockroom2026";
const DEMO_CODE = "482913";
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

function useCountdown(seconds, active) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) return;
    setRemaining(seconds);
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(iv);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [active, seconds]);

  return remaining;
}

export default function AdminLogin() {
  const [step, setStep] = useState("credentials"); // credentials | code | success
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef([]);

  const lockRemaining = useCountdown(LOCKOUT_SECONDS, locked);

  useEffect(() => {
    if (locked && lockRemaining === 0) {
      setLocked(false);
      setAttemptsLeft(MAX_ATTEMPTS);
      setError("");
    }
  }, [locked, lockRemaining]);

  function handleCredentialsSubmit(e) {
    e.preventDefault();
    if (locked || submitting) return;
    setError("");
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const valid = username.trim() === DEMO_USER && password === DEMO_PASS;

      if (valid) {
        setStep("code");
        return;
      }

      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);

      if (remaining <= 0) {
        setLocked(true);
        setError(`Too many failed attempts. Locked for ${LOCKOUT_SECONDS}s.`);
      } else {
        setError(`Invalid username or password. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`);
      }
    }, 700);
  }

  function handleCodeChange(i, val) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) codeRefs.current[i + 1]?.focus();
  }

  function handleCodeKeyDown(i, e) {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const joined = code.join("");
    if (joined.length < 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (joined === DEMO_CODE) {
        setStep("success");
      } else {
        setError("Incorrect code. Check your authenticator app and try again.");
        setCode(["", "", "", "", "", ""]);
        codeRefs.current[0]?.focus();
      }
    }, 600);
  }

  return (
    <div className="lg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .lg-root {
          --bg: #15140f;
          --panel: #1c1b16;
          --panel-raised: #232219;
          --line: #34332a;
          --line-strong: #47463a;
          --ink: #ecece4;
          --ink-dim: #9b9a8c;
          --ink-faint: #6c6b5f;
          --accent: #f2b705;
          --accent-ink: #15140f;
          --danger: #e2574c;
          --ok: #5cba7d;

          background: var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .lg-root * { box-sizing: border-box; }
        @media (max-width: 860px) { .lg-root { grid-template-columns: 1fr; } }

        .lg-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        /* ---------- left: system panel ---------- */
        .lg-side {
          padding: 48px;
          border-right: 1px solid var(--line-strong);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 40px,
            var(--bg);
        }
        @media (max-width: 860px) { .lg-side { display: none; } }

        .lg-brand { display: flex; align-items: center; gap: 10px; }
        .lg-brand-mark {
          width: 26px; height: 26px;
          background: var(--accent);
          color: var(--accent-ink);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
        }
        .lg-brand-name { font-size: 15px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }

        .lg-headline {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(28px, 3.4vw, 42px);
          line-height: 1.02;
          margin: 40px 0 16px;
          max-width: 12ch;
        }
        .lg-sub { font-size: 14px; color: var(--ink-dim); max-width: 38ch; line-height: 1.6; }

        .lg-status {
          border: 1px solid var(--line-strong);
          background: var(--panel);
        }
        .lg-status-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px; border-bottom: 1px solid var(--line);
          font-size: 12px;
        }
        .lg-status-row:last-child { border-bottom: none; }
        .lg-status-label { color: var(--ink-faint); }
        .lg-status-value { color: var(--ink); display: flex; align-items: center; gap: 6px; }
        .lg-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); }

        /* ---------- right: form ---------- */
        .lg-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .lg-card { width: 100%; max-width: 380px; }

        .lg-mobile-brand {
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        @media (max-width: 860px) { .lg-mobile-brand { display: flex; } }

        .lg-form-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 10px;
        }
        .lg-form-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: 24px;
          margin: 0 0 28px 0;
        }

        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 8px;
        }
        .lg-input-wrap { position: relative; }
        .lg-input {
          width: 100%;
          background: var(--panel);
          border: 1px solid var(--line-strong);
          color: var(--ink);
          padding: 12px 14px;
          font-size: 13.5px;
          font-family: 'Work Sans', sans-serif;
        }
        .lg-input:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
        .lg-input::placeholder { color: var(--ink-faint); }
        .lg-input:disabled { opacity: 0.5; }

        .lg-toggle-pw {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--ink-faint);
          font-size: 10.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
        }
        .lg-toggle-pw:hover { color: var(--ink); }

        .lg-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .lg-remember { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--ink-dim); }
        .lg-remember input { accent-color: var(--accent); width: 14px; height: 14px; }
        .lg-forgot { font-size: 12.5px; color: var(--ink-dim); text-decoration: none; }
        .lg-forgot:hover { color: var(--accent); }

        .lg-error {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--danger);
          background: rgba(226,87,76,0.08);
          color: var(--danger);
          padding: 10px 12px;
          font-size: 12.5px;
          margin-bottom: 18px;
        }

        .lg-submit-btn {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--accent);
          color: var(--accent-ink);
          border: 1px solid var(--accent);
          padding: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .lg-submit-btn:hover:not(:disabled) { background: transparent; color: var(--accent); }
        .lg-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lg-submit-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        .lg-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(21,20,15,0.35);
          border-top-color: var(--accent-ink);
          border-radius: 50%;
          animation: lg-spin 0.7s linear infinite;
        }
        @keyframes lg-spin { to { transform: rotate(360deg); } }

        .lg-meta { font-size: 11.5px; color: var(--ink-faint); margin-top: 18px; text-align: center; }

        /* ---------- code step ---------- */
        .lg-code-desc { font-size: 13px; color: var(--ink-dim); line-height: 1.6; margin-bottom: 24px; }
        .lg-code-row { display: flex; gap: 8px; margin-bottom: 22px; }
        .lg-code-input {
          width: 44px;
          height: 52px;
          text-align: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 18px;
          background: var(--panel);
          border: 1px solid var(--line-strong);
          color: var(--ink);
        }
        .lg-code-input:focus { outline: 2px solid var(--accent); outline-offset: -1px; }

        .lg-back-link {
          background: none;
          border: none;
          color: var(--ink-faint);
          font-size: 12px;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
          padding: 0;
          margin-top: 16px;
        }
        .lg-back-link:hover { color: var(--ink); }

        /* ---------- success ---------- */
        .lg-success {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .lg-success-icon {
          width: 40px; height: 40px;
          border: 1px solid var(--ok);
          color: var(--ok);
          display: flex; align-items: center; justify-content: center;
        }
        .lg-success-title { font-size: 18px; font-weight: 600; }
        .lg-success-desc { font-size: 13px; color: var(--ink-dim); line-height: 1.6; }
        .lg-session-box {
          width: 100%;
          border: 1px solid var(--line-strong);
          background: var(--panel);
          padding: 14px 16px;
          font-size: 12px;
        }
        .lg-session-row { display: flex; justify-content: space-between; padding: 5px 0; color: var(--ink-dim); }
        .lg-session-row span:last-child { color: var(--ink); }
      `}</style>

      <div className="lg-side">
        <div className="lg-brand">
          <div className="lg-brand-mark">S</div>
          <span className="lg-brand-name">Stockroom Admin</span>
        </div>

        <div>
          <h1 className="lg-headline">Restricted access</h1>
          <p className="lg-sub">
            This panel controls live inventory, pricing, and order data.
            Every session is logged. If this isn't you, close this tab.
          </p>
        </div>

        <div className="lg-status">
          <div className="lg-status-row">
            <span className="lg-status-label lg-mono">System status</span>
            <span className="lg-status-value lg-mono"><span className="lg-status-dot" />Operational</span>
          </div>
          <div className="lg-status-row">
            <span className="lg-status-label lg-mono">Last login</span>
            <span className="lg-status-value lg-mono">Today, 8:41 AM</span>
          </div>
          <div className="lg-status-row">
            <span className="lg-status-label lg-mono">2FA</span>
            <span className="lg-status-value lg-mono">Required</span>
          </div>
        </div>
      </div>

      <div className="lg-form-side">
        <div className="lg-card">
          <div className="lg-mobile-brand">
            <div className="lg-brand-mark">S</div>
            <span className="lg-brand-name">Stockroom Admin</span>
          </div>

          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit}>
              <div className="lg-form-eyebrow lg-mono">Sign in</div>
              <h2 className="lg-form-title">Admin login</h2>

              {error && (
                <div className="lg-error lg-mono">{error}</div>
              )}

              <div className="lg-field">
                <label className="lg-label lg-mono" htmlFor="lg-user">Username</label>
                <input
                  id="lg-user"
                  className="lg-input"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={username}
                  disabled={locked || submitting}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="lg-field">
                <label className="lg-label lg-mono" htmlFor="lg-pass">Password</label>
                <div className="lg-input-wrap">
                  <input
                    id="lg-pass"
                    className="lg-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    disabled={locked || submitting}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "56px" }}
                  />
                  <button
                    type="button"
                    className="lg-toggle-pw"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="lg-row-between">
                <label className="lg-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember this device
                </label>
                <a className="lg-forgot" href="#">Forgot password?</a>
              </div>

              <button className="lg-submit-btn" type="submit" disabled={locked || submitting}>
                {submitting && <span className="lg-spinner" />}
                {locked
                  ? `Locked — ${lockRemaining}s`
                  : submitting
                  ? "Verifying…"
                  : "Continue"}
              </button>

              <p className="lg-meta lg-mono">Demo: admin / stockroom2026</p>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleCodeSubmit}>
              <div className="lg-form-eyebrow lg-mono">Step 2 of 2</div>
              <h2 className="lg-form-title">Verify it's you</h2>
              <p className="lg-code-desc">
                Enter the 6-digit code from your authenticator app.
              </p>

              {error && <div className="lg-error lg-mono">{error}</div>}

              <div className="lg-code-row">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (codeRefs.current[i] = el)}
                    className="lg-code-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={submitting}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  />
                ))}
              </div>

              <button className="lg-submit-btn" type="submit" disabled={submitting}>
                {submitting && <span className="lg-spinner" />}
                {submitting ? "Verifying…" : "Verify and sign in"}
              </button>

              <p className="lg-meta lg-mono">Demo code: {DEMO_CODE}</p>

              <button
                type="button"
                className="lg-back-link"
                onClick={() => { setStep("credentials"); setError(""); setCode(["", "", "", "", "", ""]); }}
              >
                ← Back to login
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="lg-success">
              <div className="lg-success-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M3 9.5L7 13.5L15 4.5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div>
                <div className="lg-success-title">Access granted</div>
                <p className="lg-success-desc">You're signed in. Redirecting to the dashboard…</p>
              </div>
              <div className="lg-session-box lg-mono">
                <div className="lg-session-row"><span>User</span><span>{username || DEMO_USER}</span></div>
                <div className="lg-session-row"><span>Session started</span><span>{new Date().toLocaleTimeString()}</span></div>
                <div className="lg-session-row"><span>Device trusted</span><span>{remember ? "Yes" : "No"}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}