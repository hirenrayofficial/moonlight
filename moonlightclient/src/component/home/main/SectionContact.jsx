"use client"
import React, { useState } from "react";

/**
 * STOCKROOM — contact page
 * Form on the left, a manifest-style info panel on the right — same
 * "ticket" device used in the footer and hero, doing the trust-building
 * work instead of a generic "we'd love to hear from you" paragraph.
 */

const TOPICS = ["Order support", "Product question", "Returns", "Wholesale", "Press", "Something else"];

function useContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    order: "",
    topic: TOPICS[0],
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitted

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) return;
    setStatus("submitted");
  }

  return { values, update, status, handleSubmit };
}

export default function ContactPage() {
  const { values, update, status, handleSubmit } = useContactForm();

  return (
    <div className="ct-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .ct-root {
          --bg: #faf9f5;
          --paper: #ffffff;
          --ink: #15140f;
          --ink-dim: #5a594e;
          --ink-faint: #9b9a8c;
          --line: #d9d6c9;
          --line-strong: #b8b5a4;
          --accent: #f2b705;
          --accent-ink: #15140f;
          --ok: #4c8c5c;

          background: var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          min-height: 100vh;
          width: 100%;
        }
        .ct-root * { box-sizing: border-box; }
        .ct-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

        .ct-crumb {
          padding: 16px 32px;
          border-bottom: 1px solid var(--line-strong);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .ct-crumb span.current { color: var(--ink); }
        @media (max-width: 720px) { .ct-crumb { padding: 14px 20px; } }

        .ct-head { padding: 48px 32px 32px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 720px) { .ct-head { padding: 36px 20px 24px; } }
        .ct-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 10px;
        }
        .ct-title {
          font-family: 'Archivo Black', sans-serif;
          text-transform: uppercase;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1;
          margin: 0 0 12px 0;
        }
        .ct-subhead { font-size: 15px; color: var(--ink-dim); max-width: 52ch; line-height: 1.6; }

        /* ---------- layout ---------- */
        .ct-layout {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          border-top: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) { .ct-layout { grid-template-columns: 1fr; } }

        /* ---------- form ---------- */
        .ct-form-col {
          padding: 40px 40px 48px 32px;
          border-right: 1px solid var(--line-strong);
        }
        @media (max-width: 900px) {
          .ct-form-col { border-right: none; border-bottom: 1px solid var(--line-strong); padding: 32px 20px; }
        }

        .ct-field { margin-bottom: 20px; }
        .ct-label {
          display: block;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 8px;
        }
        .ct-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .ct-row2 { grid-template-columns: 1fr; } }

        .ct-input,
        .ct-select,
        .ct-textarea {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          padding: 11px 12px;
          font-family: 'Work Sans', sans-serif;
          font-size: 13.5px;
          color: var(--ink);
        }
        .ct-input::placeholder,
        .ct-textarea::placeholder { color: var(--ink-faint); }
        .ct-input:focus,
        .ct-select:focus,
        .ct-textarea:focus {
          outline: 2px solid var(--ink);
          outline-offset: -1px;
        }
        .ct-textarea { resize: vertical; min-height: 130px; }
        .ct-select { appearance: none; cursor: pointer; }

        .ct-submit-btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--ink);
          color: var(--bg);
          border: 1px solid var(--ink);
          padding: 14px 26px;
          cursor: pointer;
        }
        .ct-submit-btn:hover { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        .ct-submit-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        .ct-success {
          border: 1px solid var(--line-strong);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ct-success-title { font-size: 15px; font-weight: 600; color: var(--ok); }
        .ct-success-desc { font-size: 13px; color: var(--ink-dim); line-height: 1.6; }

        /* ---------- manifest panel ---------- */
        .ct-panel-col { padding: 40px 32px 48px; }
        @media (max-width: 900px) { .ct-panel-col { padding: 32px 20px; } }

        .ct-panel-title {
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }

        .ct-manifest {
          border: 1px solid var(--line-strong);
          background: var(--paper);
          margin-bottom: 28px;
        }
        .ct-manifest-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding: 13px 16px;
          border-bottom: 1px solid var(--line);
        }
        .ct-manifest-row:last-child { border-bottom: none; }
        .ct-manifest-label { font-size: 11.5px; color: var(--ink-faint); }
        .ct-manifest-value { font-size: 12.5px; color: var(--ink); text-align: right; }

        .ct-response {
          border: 1px dashed var(--line-strong);
          padding: 16px;
          margin-bottom: 28px;
        }
        .ct-response-label {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 6px;
        }
        .ct-response-value { font-size: 20px; font-weight: 600; }
        .ct-response-sub { font-size: 11.5px; color: var(--ink-faint); margin-top: 4px; }

        .ct-faq-title { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
        .ct-faq-link {
          display: block;
          font-size: 12.5px;
          color: var(--ink-dim);
          text-decoration: none;
          padding: 9px 0;
          border-bottom: 1px solid var(--line);
        }
        .ct-faq-link:last-child { border-bottom: none; }
        .ct-faq-link:hover { color: var(--ink); }
        .ct-faq-link:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
      `}</style>

      <div className="ct-crumb ct-mono">
        Home / <span className="current">Contact</span>
      </div>

      <div className="ct-head">
        <div className="ct-eyebrow ct-mono">Contact</div>
        <h1 className="ct-title">Talk to the warehouse</h1>
        <p className="ct-subhead">
          Order questions, product specs, wholesale — send it here and it
          goes to the same small team that packs the boxes. No ticket queue,
          no bot first.
        </p>
      </div>

      <div className="ct-layout">
        <div className="ct-form-col">
          {status === "submitted" ? (
            <div className="ct-success">
              <span className="ct-success-title ct-mono">Message received.</span>
              <p className="ct-success-desc">
                We reply from a real inbox, usually within one business day.
                You'll hear from us at {values.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ct-row2">
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-name">Name</label>
                  <input
                    id="ct-name"
                    className="ct-input"
                    type="text"
                    required
                    placeholder="Jordan Reyes"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-email">Email</label>
                  <input
                    id="ct-email"
                    className="ct-input"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="ct-row2">
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-topic">Topic</label>
                  <select
                    id="ct-topic"
                    className="ct-select"
                    value={values.topic}
                    onChange={(e) => update("topic", e.target.value)}
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-order">Order number (optional)</label>
                  <input
                    id="ct-order"
                    className="ct-input"
                    type="text"
                    placeholder="#08213"
                    value={values.order}
                    onChange={(e) => update("order", e.target.value)}
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label ct-mono" htmlFor="ct-message">Message</label>
                <textarea
                  id="ct-message"
                  className="ct-textarea"
                  required
                  placeholder="What's going on?"
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </div>

              <button className="ct-submit-btn" type="submit">Send message</button>
            </form>
          )}
        </div>

        <div className="ct-panel-col">
          <div className="ct-panel-title ct-mono">Direct lines</div>
          <div className="ct-manifest">
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Support</span>
              <span className="ct-manifest-value">help@stockroom.co</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Wholesale</span>
              <span className="ct-manifest-value">wholesale@stockroom.co</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Phone</span>
              <span className="ct-manifest-value">(330) 555-0148</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Warehouse</span>
              <span className="ct-manifest-value">412 Foundry St, Akron, OH</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Hours</span>
              <span className="ct-manifest-value">Mon–Fri, 8am–5pm ET</span>
            </div>
          </div>

          <div className="ct-response">
            <div className="ct-response-label ct-mono">Average response time</div>
            <div className="ct-response-value ct-mono">4.2 hrs</div>
            <div className="ct-response-sub">During business hours, Mon–Fri</div>
          </div>

          <div className="ct-faq-title">Common questions</div>
          <a className="ct-faq-link" href="#">Where's my order?</a>
          <a className="ct-faq-link" href="#">How do returns work?</a>
          <a className="ct-faq-link" href="#">Do you ship internationally?</a>
          <a className="ct-faq-link" href="#">Do you offer wholesale pricing?</a>
        </div>
      </div>
    </div>
  );
}