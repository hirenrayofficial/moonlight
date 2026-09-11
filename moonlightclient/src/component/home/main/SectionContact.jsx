"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./contact.scss";

const TOPICS = [
  "Order support",
  "Product question",
  "Returns",
  "Wholesale",
  "Press",
  "Something else",
];

function useContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    order: "",
    topic: TOPICS[0],
    message: "",
  });
  const [status, setStatus] = useState("idle");
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
        setErrorMessage(
          response?.data?.message || "Unable to send enquiry. Please try again."
        );
      }
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      setStatus("error");
      setErrorMessage(
        error?.response?.data?.message ||
          "There was a problem sending your enquiry. Please try again later."
      );
    }
  };

  return { values, update, status, errorMessage, handleSubmit };
}

export default function ContactPage() {
  const { values, update, status, errorMessage, handleSubmit } =
    useContactForm();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <div className="ct-root">
      {/* Decorative Cyber-Grid Background Lines */}
      <div className="ct-bg-grid" aria-hidden="true">
        <div className="grid-line-v"></div>
        <div className="grid-line-v"></div>
        <div className="grid-line-h"></div>
      </div>

      <motion.div
        className="ct-head"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={headerVariants}
      >
        <div className="ct-eyebrow ct-mono">
          <span className="ct-dot"></span> SECURE TRANSMISSION CHANNEL // 01
        </div>
        <h1 className="ct-title">NO MIDDLEMEN, JUST US</h1>
        <p className="ct-subhead">
          Order questions, product specs — send it here and it goes directly to
          the same small team that packs the boxes. No ticket queue, no bot
          first.
        </p>
      </motion.div>

      <motion.div
        className="ct-layout"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Form Column */}
        <motion.div className="ct-form-col" variants={itemVariants}>
          {status === "submitted" ? (
            <motion.div
              className="ct-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="ct-success-header ct-mono">
                [ STATUS: TRANSMITTED SUCCESSFULLY ]
              </div>
              <span className="ct-success-title ct-mono">
                Message received.
              </span>
              <p className="ct-success-desc">
                We reply from a real inbox, usually within one business day.
                You'll hear from us at <strong className="ct-mono">{values.email}</strong>.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <motion.div className="ct-row2" variants={itemVariants}>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-name">
                    01 // Name
                  </label>
                  <input
                    id="ct-name"
                    className="ct-input ct-mono"
                    type="text"
                    required
                    placeholder="Jordan Reyes"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-email">
                    02 // Email
                  </label>
                  <input
                    id="ct-email"
                    className="ct-input ct-mono"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div className="ct-row2" variants={itemVariants}>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-topic">
                    03 // Topic
                  </label>
                  <div className="ct-select-wrapper">
                    <select
                      id="ct-topic"
                      className="ct-select ct-mono"
                      value={values.topic}
                      onChange={(e) => update("topic", e.target.value)}
                    >
                      {TOPICS.map((t) => (
                        <option key={t} value={t} className="ct-option">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="ct-field">
                  <label className="ct-label ct-mono" htmlFor="ct-order">
                    04 // Order Ref (Optional)
                  </label>
                  <input
                    id="ct-order"
                    className="ct-input ct-mono"
                    type="text"
                    placeholder="#08213"
                    value={values.order}
                    onChange={(e) => update("order", e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div className="ct-field" variants={itemVariants}>
                <label className="ct-label ct-mono" htmlFor="ct-message">
                  05 // Message Directive
                </label>
                <textarea
                  id="ct-message"
                  className="ct-textarea ct-mono"
                  required
                  placeholder="Detail your inquiry here..."
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </motion.div>

              {status === "error" && (
                <motion.div
                  className="ct-error ct-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  [ ERROR: {errorMessage || "Failed to submit enquiry."} ]
                </motion.div>
              )}

              <motion.button
                className="ct-submit-btn ct-mono"
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
                whileTap={{ scale: 0.99 }}
              >
                {status === "submitting" ? (
                  <span className="ct-loading-flex">
                    <span className="ct-spinner"></span> TRANSMITTING...
                  </span>
                ) : (
                  <span>DISPATCH MESSAGE →</span>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Panel/Manifest Column */}
        <motion.div
          className="ct-panel-col hidden md:flex md:flex-col"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* <div className="ct-panel-title ct-mono">
            // MANIFEST & DIRECT CHANNELS
          </div> */}

          <div className="ct-manifest">
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">SUPPORT</span>
              <span className="ct-manifest-value ct-mono">
                support@moonlightmachinery.com
              </span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">HOTLINES</span>
              <span className="ct-manifest-value ct-mono">
                +91 93543-27757 / +91 98835-00259
              </span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">Office</span>
              <span className="ct-manifest-value ct-mono">
                Plot-13, Ram Vihar, Dhanwapur Rd, Sec-104, Gurgaon-122001
              </span>
            </div>
            <div className="ct-manifest-row">
              <span className="ct-manifest-label ct-mono">UPTIME</span>
              <span className="ct-manifest-value ct-mono">Mon–Fri, 24 Hours</span>
            </div>
          </div>

          <div className="ct-response">
            <div className="ct-response-label ct-mono">
              AVG SYSTEM RESPONSE LATENCY
            </div>
            <div className="ct-response-value ct-mono">~12 HOURS</div>
            <div className="ct-response-sub ct-mono">
              Evaluated during standard operational hours
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}