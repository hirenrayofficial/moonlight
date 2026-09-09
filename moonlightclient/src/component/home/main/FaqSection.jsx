"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./faq-section.scss";

const faqs = [
  {
    question: "WHAT TYPES OF PAPER PLATES CAN BE PRODUCED WITH YOUR MACHINES?",
    answer:
      "Our automated machinery is engineered to manufacture a wide variety of disposable items, including standard round paper plates, silver foil plates, buffet plates, leaf-shaped platters, paper bowls, and customizable printed paper dishes ranging from 4 inches to 16 inches in diameter."
  },
  {
    question: "WHAT IS THE DAILY PRODUCTION CAPACITY (OUTPUT SPEED)?",
    answer:
      "Depending on the machine model (Automatic Single Die vs. Double Die or Fully Automatic Hydraulic systems), output capacities range typically from 2,000 to 6,000 pieces per hour, operating continuously under standard industrial power requirements."
  },
  {
    question: "WHAT POWER SUPPLY OR ELECTRICAL SETUP IS REQUIRED?",
    answer:
      "Most standard models operate efficiently on a single-phase (220V) household or small workshop power supply. Heavy-duty hydraulic and high-speed multi-die systems require a standard 3-phase industrial electrical connection (415V)."
  },
  {
    question: "WHAT GSM (PAPER THICKNESS) RANGE IS SUPPORTED?",
    answer:
      "Our machines seamlessly handle raw paper sheets and rolls starting from 80 GSM up to 600+ GSM. This accommodates everything from light snack plates to heavy-duty rigid buffet platters."
  },
  {
    question: "DO YOU PROVIDE INSTALLATION, TRAINING, AND SPARE PARTS?",
    answer:
      "Yes. Every machine dispatch includes complete operational guidance documents and video tutorials. Furthermore, we maintain a ready stock of essential spare parts (dies, heaters, sensors, and electronic controllers) with global dispatch support."
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-root">
      {/* Background Cyber Grid Elements */}
      <div className="faq-bg-grid" aria-hidden="true">
        <div className="grid-line-v"></div>
        <div className="grid-line-v"></div>
        <div className="grid-line-h"></div>
      </div>

      <div className="faq-container">
        {/* Section Header */}
        <div className="faq-header">
          <div className="faq-eyebrow faq-mono">
            <span className="faq-dot"></span> TECHNICAL INQUIRIES // 04
          </div>
          <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="faq-sub">
            Essential operational specifications, manufacturing capabilities, and deployment guidelines for our paper plate machinery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  className="faq-question-btn faq-mono"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">
                    <span className="faq-idx">[{String(index + 1).padStart(2, "0")}]</span> {faq.question}
                  </span>
                  <span className="faq-icon faq-mono">{isOpen ? "[-] " : "[+]"}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="faq-answer-content faq-mono">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}