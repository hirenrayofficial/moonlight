"use client";

import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QueryModal({ isOpen, onClose, product }) {
  const [form, setForm] = useState({
    customerName: "",
    customerContact: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!product?.name) {
      setStatus({
        type: "error",
        message: "Product information is missing.",
      });
      return;
    }

    setLoading(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const response = await fetch("/api/home/product/user-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: product.name,
          productSku: product.sku || "",
          customerName: form.customerName,
          customerContact: form.customerContact,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to submit query.");
      }

      setStatus({
        type: "success",
        message: "Your query has been submitted successfully.",
      });

      setForm({
        customerName: "",
        customerContact: "",
        message: "",
      });

      setTimeout(() => {
        onClose();
        setStatus({
          type: "",
          message: "",
        });
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="query-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="query-modal"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="query-modal-close"
              onClick={onClose}
              aria-label="Close query form"
            >
              <X size={20} />
            </button>

            <div className="query-modal-header">
              <span className="query-modal-label">PRODUCT QUERY</span>

              <h2>Send Your Query</h2>

              <p>
                Ask us anything about{" "}
                <strong>{product?.name}</strong>
              </p>
            </div>

            <div className="query-product">
              <div>
                <span>Product</span>
                <strong>{product?.name}</strong>
              </div>

              {product?.sku && (
                <div>
                  <span>SKU</span>
                  <strong>{product.sku}</strong>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="query-form">
              <div className="query-field">
                <label htmlFor="customerName">
                  Customer Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  placeholder="Enter your name"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="query-field">
                <label htmlFor="customerContact">
                  Customer Contact No.
                </label>

                <input
                  id="customerContact"
                  type="tel"
                  name="customerContact"
                  placeholder="Enter your contact number"
                  value={form.customerContact}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <div className="query-field">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder={`I want to know more about ${product?.name || "this product"}`}
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              {status.message && (
                <div
                  className={`query-status ${
                    status.type === "success"
                      ? "success"
                      : "error"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                className="query-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="query-spinner"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Query
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}