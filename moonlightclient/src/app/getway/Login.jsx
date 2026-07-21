"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import './login.scss'
import axios from "axios";


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

  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [formRenderedAt, setFormRenderedAt] = useState(null);

  const [hpField, setHpField] = useState(""); // honeypot — must stay empty
  const [redirecting, setRedirecting] = useState(false);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (locked && lockRemaining === 0) {
      setLocked(false);
      setAttemptsLeft(MAX_ATTEMPTS);
      setError("");
    }
  }, [locked, lockRemaining]);

  async function handleCredentialsSubmit(e) {
    e.preventDefault();
    if (locked || submitting) return;
    setError("");
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const res = await axios.post("/api/getway/checkuser", {
        username,
        password,
      });

      const valid = res?.data?.success || res?.data?.valid;
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
        setError(
          `Invalid username or password. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`,
        );
      }
    } catch (err) {
      console.error("Credentials check failed:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to verify credentials. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
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

  async function handleCodeSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const joined = code.join("");
    if (joined.length < 6) {
      setError("Enter all 6 digits.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const res = await axios.post("/api/getway/checkcode", {
        username,
        password,
        code: joined,
      });

      const valid = res?.data?.success || res?.data?.valid;
      if (!valid) {
        setError("Incorrect code. Check your authenticator app and try again.");
        setCode(["", "", "", "", "", ""]);
        codeRefs.current[0]?.focus();
        return;
      }

      await handleSubmit();
    } catch (err) {
      console.error("Code verification failed:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to verify code. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Starts the session the instant this page loads — before any
  // credentials are typed — and gets back the CSRF token + timing anchor.
  useEffect(() => {
    fetch("/api/getway/session/init")
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
        setFormRenderedAt(data.formRenderedAt);
      })
      .catch(() =>
        setError("Could not start a secure session. Please refresh the page."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center h-[100vh] text-white bg-[#15140f]">
        <div className="lg-form-side">
          <div className="lg-card lg-loading-card">
            <div className="lg-loading-message">Starting secure login session…</div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/getway/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          hp_field: hpField,
          csrf_token: csrfToken,
          form_rendered_at: formRenderedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      setStep("success");
      setRedirecting(true);
      setTimeout(() => {
        router.push(data.redirect || "/admin");
      }, 300);
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="lg-root">


      <div className="lg-side">
        <div className="lg-brand">
          <div className="lg-brand-mark">M</div>
          <span className="lg-brand-name">Admin Panel</span>
        </div>

        <div>
          <h1 className="lg-headline">Restricted access</h1>
          <p className="lg-sub">
            This panel controls live inventory, pricing, and order data. Every
            session is logged. If this isn't you, close this tab.
          </p>
        </div>

        <div className="lg-status">
          <div className="lg-status-row">
            <span className="lg-status-label lg-mono">System status</span>
            <span className="lg-status-value lg-mono">
              <span className="lg-status-dot" />
              Operational
            </span>
          </div>
          <div className="lg-status-row">
            {/* <span className="lg-status-label lg-mono">Last login</span> */}
            {/* <span className="lg-status-value lg-mono">Today, 8:41 AM</span> */}
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
            <span className="lg-brand-name"> Admin Panel</span>
          </div>

          {step === "credentials" && (
            <form onSubmit={handleCredentialsSubmit}>
              <div className="lg-form-eyebrow lg-mono">Sign in</div>
              <h2 className="lg-form-title">Admin login</h2>

              {error && <div className="lg-error lg-mono">{error}</div>}

              <div className="lg-field">
                <label className="lg-label lg-mono" htmlFor="lg-user">
                  Username
                </label>
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
                <label className="lg-label lg-mono" htmlFor="lg-pass">
                  Password
                </label>
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
                <a className="lg-forgot" href="#">
                  Forgot password?
                </a>
              </div>

              <button
                className="lg-submit-btn"
                type="submit"
                disabled={locked || submitting || loading || redirecting}
              >
                {submitting && <span className="lg-spinner" />}
                {locked
                  ? `Locked — ${lockRemaining}s`
                  : redirecting
                    ? "Redirecting…"
                    : submitting
                      ? "Verifying…"
                      : "Continue"}
              </button>

              
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleCodeSubmit}>
              <div className="lg-form-eyebrow lg-mono">Step 2 of 2</div>
              <h2 className="lg-form-title">Verify it's you</h2>
              <p className="lg-code-desc">
                6-digit code send you email.
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

              <button
                className="lg-submit-btn"
                type="submit"
                disabled={submitting || loading || redirecting}
              >
                {submitting && <span className="lg-spinner" />}
                {redirecting
                  ? "Redirecting…"
                  : submitting
                    ? "Verifying…"
                    : "Verify and sign in"}
              </button>

              {/* <p className="lg-meta lg-mono">Demo code: {DEMO_CODE}</p> */}

              <button
                type="button"
                className="lg-back-link"
                onClick={() => {
                  setStep("credentials");
                  setError("");
                  setCode(["", "", "", "", "", ""]);
                }}
              >
                ← Back to login
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="lg-success">
              <div className="lg-success-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    d="M3 9.5L7 13.5L15 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div>
                <div className="lg-success-title">Access granted</div>
                <p className="lg-success-desc">
                  You're signed in. Redirecting to the dashboard…
                </p>
              </div>
              <div className="lg-session-box lg-mono">
                <div className="lg-session-row">
                  <span>User</span>
                  <span>{username || DEMO_USER}</span>
                </div>
                <div className="lg-session-row">
                  <span>Session started</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="lg-session-row">
                  <span>Device trusted</span>
                  <span>{remember ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
