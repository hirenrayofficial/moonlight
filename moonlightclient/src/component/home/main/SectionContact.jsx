"use client"
import React, { useState } from "react";
import './contact.scss'
import axios from "axios";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="ct-root">


      {/* <div className="ct-crumb ct-mono">
        Home / <span className="current">Contact</span>
      </div> */}

      <motion.div
        className="ct-head"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={headerVariants}
      >
        <div className="ct-eyebrow ct-mono">Contact</div>
        <h1 className="ct-title">Talk to the warehouse</h1>
        <p className="ct-subhead">
          Order questions, product specs, wholesale — send it here and it
          goes to the same small team that packs the boxes. No ticket queue,
          no bot first.
        </p>
      </motion.div>

      <motion.div
        className="ct-layout"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="ct-form-col" variants={itemVariants}>
          {status === "submitted" ? (
            <motion.div
              className="ct-success"
              initial="hidden"
              animate="visible"
              variants={successVariants}
            >
              <span className="ct-success-title ct-mono">Message received.</span>
              <p className="ct-success-desc">
                We reply from a real inbox, usually within one business day.
                You'll hear from us at {values.email}.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <motion.div className="ct-row2" variants={itemVariants}>
                <motion.div
                  className="ct-field"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
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
                </motion.div>
                <motion.div
                  className="ct-field"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
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
                </motion.div>
              </motion.div>

              <motion.div className="ct-row2" variants={itemVariants}>
                <motion.div
                  className="ct-field"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
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
                </motion.div>
                <motion.div
                  className="ct-field"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="ct-label ct-mono" htmlFor="ct-order">Order number (optional)</label>
                  <input
                    id="ct-order"
                    className="ct-input"
                    type="text"
                    placeholder="#08213"
                    value={values.order}
                    onChange={(e) => update("order", e.target.value)}
                  />
                </motion.div>
              </motion.div>

              <motion.div className="ct-field" variants={itemVariants}>
                <label className="ct-label ct-mono" htmlFor="ct-message">Message</label>
                <textarea
                  id="ct-message"
                  className="ct-textarea h-[60px] md:h-[130px]"
                  required
                  placeholder="What's going on?"
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                />
              </motion.div>

              {status === "error" && (
                <motion.p
                  className="ct-error ct-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {errorMessage || "Failed to submit enquiry."}
                </motion.p>
              )}
              <motion.button
                className="ct-submit-btn"
                type="submit"
                disabled={status === "submitting"}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {status === "submitting" ? "Sending…" : "Send message"}
              </motion.button>
            </form>
          )}
        </motion.div>

        <motion.div
          className="ct-panel-col hidden md:flex md:flex-col"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="ct-panel-title ct-mono" variants={itemVariants}>Direct lines</motion.div>
          <motion.div
            className="ct-manifest"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div className="ct-manifest-row" variants={itemVariants}>
              <span className="ct-manifest-label ct-mono">Support</span>
              <span className="ct-manifest-value">hhelp@moonlightmachinery.com</span>
            </motion.div>
            <motion.div className="ct-manifest-row" variants={itemVariants}>
              <span className="ct-manifest-label ct-mono">Wholesale</span>
              <span className="ct-manifest-value">wholesale@moonlightmachinery.com</span>
            </motion.div>
            <motion.div className="ct-manifest-row" variants={itemVariants}>
              <span className="ct-manifest-label ct-mono">Phone</span>
              <span className="ct-manifest-value">+91 8178445596,+91 9354327757, +91 9883500259, +91 9907330121</span>
            </motion.div>
            <motion.div className="ct-manifest-row" variants={itemVariants}>
              <span className="ct-manifest-label ct-mono">Warehouse</span>
              <span className="ct-manifest-value">Plot -13,Ram Vihar,Dhanwapur Road,Sector-104,Gurgaon-12201</span>
            </motion.div>
            <motion.div className="ct-manifest-row" variants={itemVariants}>
              <span className="ct-manifest-label ct-mono">Hours</span>
              <span className="ct-manifest-value">Mon–Fri, 24hrs</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="ct-response"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="ct-response-label ct-mono">Average response time</div>
            <div className="ct-response-value ct-mono">12 hrs</div>
            <div className="ct-response-sub">During business hours, Mon–Fri</div>
          </motion.div>

          {/* <div className="ct-faq-title">Common questions</div>
          <a className="ct-faq-link" href="#">Where's my order?</a>
          <a className="ct-faq-link" href="#">How do returns work?</a>
          <a className="ct-faq-link" href="#">Do you ship internationally?</a>
          <a className="ct-faq-link" href="#">Do you offer wholesale pricing?</a> */}
        </motion.div>
      </motion.div>
    </div>
  );
}