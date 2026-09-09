"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./review-manager.scss";

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Form fields
  const [editId, setEditId] = useState(null);
  const [personName, setPersonName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [star, setStar] = useState(5);
  const [location, setLocation] = useState("");
  const [reviewType, setReviewType] = useState("");

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // list | create | edit

  const fetchReviews = async () => {
    setLoadingList(true);
    try {
      const response = await axios.get("/api/admin/dashboard/review-set");
      if (response?.data?.success) {
        setReviews(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setPersonName("");
    setFeedback("");
    setStar(5);
    setLocation("");
    setReviewType("");
  };

  const handleAction = async (method) => {
    if (!personName.trim() || !feedback.trim() || !location.trim() || !reviewType.trim()) {
      setStatus("error");
      setMessage("All structural text fields are mandatory.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      let response;
      const payload = {
        person_name: personName,
        feedback,
        star: Number(star),
        location,
        review_type: reviewType,
      };

      if (method === "POST") {
        response = await axios.post("/api/admin/dashboard/review-set", payload);
      } else if (method === "PUT") {
        response = await axios.put("/api/admin/dashboard/review-set", {
          id: editId,
          ...payload,
        });
      }

      if (response?.data?.success) {
        setStatus("success");
        setMessage(response.data.message || "Operation executed successfully.");
        resetForm();
        fetchReviews();
        setTimeout(() => setActiveTab("list"), 1200);
      } else {
        setStatus("error");
        setMessage(response?.data?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("API request failed:", error);
      setStatus("error");
      setMessage(error?.response?.data?.message || "Communication protocol failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to purge review ID: [${id}]?`)) return;
    try {
      const res = await axios.delete(`/api/admin/dashboard/review-set?id=${id}`);
      if (res?.data?.success) {
        fetchReviews();
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setPersonName(item.person_name);
    setFeedback(item.feedback);
    setStar(item.star);
    setLocation(item.location);
    setReviewType(item.review_type);
    setActiveTab("edit");
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="rm-root">
      {/* Cyber Grid Background Elements */}
      <div className="rm-bg-grid" aria-hidden="true">
        <div className="grid-line-v"></div>
        <div className="grid-line-v"></div>
        <div className="grid-line-h"></div>
      </div>

      <motion.div
        className="rm-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <div className="rm-header">
          <div className="rm-eyebrow rm-mono">
            <span className="rm-dot"></span> DATABASE FEEDBACK REGISTRY // 03
          </div>
          <h1 className="rm-title">REVIEW MANIFEST MANAGER</h1>
          <p className="rm-sub">
            Monitor client feedback, inject new testimonials, or refine ratings and classification metrics.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="rm-tabs">
          <button
            className={`rm-tab rm-mono ${activeTab === "list" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("list");
              setStatus("idle");
              setMessage("");
            }}
          >
            // VIEW REVIEWS ({reviews.length})
          </button>
          <button
            className={`rm-tab rm-mono ${activeTab === "create" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("create");
              resetForm();
              setStatus("idle");
              setMessage("");
            }}
          >
            + ADD NEW REVIEW
          </button>
          {activeTab === "edit" && (
            <button className="rm-tab rm-mono active">⚙ EDIT RECORD</button>
          )}
        </div>

        {/* Main Interface Content Panel */}
        <div className="rm-panel">
          <div className="rm-panel-head rm-mono">
            <span>MODE: [{activeTab.toUpperCase()}]</span>
            <span className="rm-status-indicator">SECURE CONNECTION</span>
          </div>

          <div className="rm-form-body">
            {activeTab === "list" ? (
              <div className="rm-list-container">
                {loadingList ? (
                  <div className="rm-empty-msg rm-mono">QUERYING DATABASE...</div>
                ) : reviews.length === 0 ? (
                  <div className="rm-empty-msg rm-mono">
                    NO FEEDBACK ENTRIES RECORDED. CLICK "+ ADD NEW REVIEW" TO BEGIN.
                  </div>
                ) : (
                  <div className="rm-grid-items">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="rm-item-card">
                        <div className="rm-item-meta">
                          <div className="rm-item-top-row">
                            <span className="rm-item-name rm-mono">
                              <strong>{rev.person_name}</strong>
                            </span>
                            <span className="rm-item-stars rm-mono">
                              {"★".repeat(rev.star)}{"☆".repeat(5 - rev.star)} ({rev.star}/5)
                            </span>
                          </div>
                          <p className="rm-item-feedback">"{rev.feedback}"</p>
                          <div className="rm-item-details rm-mono">
                            <span>LOC: {rev.location}</span>
                            <span>TYPE: {rev.review_type}</span>
                          </div>
                        </div>
                        <div className="rm-item-actions">
                          <button
                            className="rm-action-btn edit rm-mono"
                            onClick={() => handleEditClick(rev)}
                          >
                            EDIT
                          </button>
                          <button
                            className="rm-action-btn delete rm-mono"
                            onClick={() => handleDelete(rev._id)}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="rm-field">
                  <label className="rm-label rm-mono" htmlFor="person-name">
                    REVIEWER PERSON NAME
                  </label>
                  <input
                    id="person-name"
                    className="rm-input rm-mono"
                    type="text"
                    placeholder="e.g. Johnathan Vance"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                  />
                </div>

                <div className="rm-field">
                  <label className="rm-label rm-mono" htmlFor="review-feedback">
                    FEEDBACK CONTENT
                  </label>
                  <textarea
                    id="review-feedback"
                    className="rm-input rm-textarea rm-mono"
                    rows="3"
                    placeholder="Enter customer testimonials or observations..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <div className="rm-row-grid">
                  <div className="rm-field">
                    <label className="rm-label rm-mono" htmlFor="review-star">
                      STAR RATING (1 - 5)
                    </label>
                    <select
                      id="review-star"
                      className="rm-input rm-mono"
                      value={star}
                      onChange={(e) => setStar(e.target.value)}
                    >
                      <option value="5">5 Stars - Exceptional</option>
                      <option value="4">4 Stars - Superior</option>
                      <option value="3">3 Stars - Standard</option>
                      <option value="2">2 Stars - Substandard</option>
                      <option value="1">1 Star - Critical Issue</option>
                    </select>
                  </div>

                  <div className="rm-field">
                    <label className="rm-label rm-mono" htmlFor="review-location">
                      LOCATION / GEO-ZONE
                    </label>
                    <input
                      id="review-location"
                      className="rm-input rm-mono"
                      type="text"
                      placeholder="e.g. Tokyo, Japan / Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rm-field">
                  <label className="rm-label rm-mono" htmlFor="review-type">
                    REVIEW CLASSIFICATION TYPE
                  </label>
                  <input
                    id="review-type"
                    className="rm-input rm-mono"
                    type="text"
                    placeholder="e.g. Enterprise Client / Beta Tester"
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value)}
                  />
                </div>

                {/* Status Alerts */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      className="rm-alert rm-error rm-mono"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      [ ERROR: {message} ]
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.div
                      className="rm-alert rm-success rm-mono"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      [ SUCCESS: {message} ]
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit / Execution Actions */}
                <button
                  className="rm-submit-btn rm-mono"
                  disabled={status === "loading"}
                  onClick={() => handleAction(activeTab === "create" ? "POST" : "PUT")}
                >
                  {status === "loading" ? (
                    <span className="rm-load-row">
                      <span className="rm-spinner"></span> PROCESSING DIRECTIVE...
                    </span>
                  ) : (
                    <span>
                      {activeTab === "create" && "PUBLISH NEW REVIEW RECORD →"}
                      {activeTab === "edit" && "COMMIT REVIEW MODIFICATIONS →"}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}