"use client"
import React, { useState } from "react";
import './contact.scss'
import axios from "axios";
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
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted | error
  const [errorMessage, setErrorMessage] = useState("");

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setErrorMessage("Please fill in name, email, and message.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await axios.post("/api/home/enquery", values);

      if (response?.data?.success) {
        setStatus("submitted");
      } else {
        setStatus("error");
        setErrorMessage(response?.data?.message || "Unable to send enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      setStatus("error");
      setErrorMessage(
        error?.response?.data?.message || "There was a problem sending your enquiry. Please try again later."
      );
    }
  };

  return { values, update, status, errorMessage, handleSubmit };
}

export default function ContactPage() {
  const { values, update, status, errorMessage, handleSubmit } = useContactForm();

  return (
    <div className="ct-root">


      {/* <div className="ct-crumb ct-mono">
        Home / <span className="current">Contact</span>
      </div> */}

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
                  className="ct-textarea h-[60px] md:h-[130px]"
                  required
                  placeholder="What's going on?"
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </div>

              {status === "error" && (
                <p className="ct-error ct-mono">{errorMessage || "Failed to submit enquiry."}</p>
              )}
              <button className="ct-submit-btn" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <div className="ct-panel-col hidden md:flex md:flex-col">
          <div className="ct-panel-title ct-mono">Direct lines</div>
          <div className="ct-manifest">
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Support</span>
              <span className="ct-manifest-value">hhelp@moonlightmachinery.com</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Wholesale</span>
              <span className="ct-manifest-value">wholesale@moonlightmachinery.com</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Phone</span>
              <span className="ct-manifest-value">+91 8178445596,+91 9354327757, +91 9883500259, +91 9907330121</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Warehouse</span>
              <span className="ct-manifest-value">Plot -13,Ram Vihar,Dhanwapur Road,Sector-104,Gurgaon-12201</span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Hours</span>
              <span className="ct-manifest-value">Mon–Fri, 24hrs</span>
            </div>
          </div>

          <div className="ct-response">
            <div className="ct-response-label ct-mono">Average response time</div>
            <div className="ct-response-value ct-mono">12 hrs</div>
            <div className="ct-response-sub">During business hours, Mon–Fri</div>
          </div>

          {/* <div className="ct-faq-title">Common questions</div>
          <a className="ct-faq-link" href="#">Where's my order?</a>
          <a className="ct-faq-link" href="#">How do returns work?</a>
          <a className="ct-faq-link" href="#">Do you ship internationally?</a>
          <a className="ct-faq-link" href="#">Do you offer wholesale pricing?</a> */}
        </div>
      </div>
    </div>
  );
}