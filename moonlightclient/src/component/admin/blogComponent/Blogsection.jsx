"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import "./review-manager.scss";

// Load CreateBlog dynamically with SSR disabled (Removes the duplicate declaration error)
const CreateBlog = dynamic(() => import("./CreateBlog"), {
  ssr: false,
  loading: () => (
    <div className="rm-empty-msg rm-mono">LOADING EDITOR WORKSPACE...</div>
  ),
});

export default function BlogSection() {
  // ... rest of your code remains the same
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
      const response = await axios.get("/api/admin/blog/get");
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
    if (
      !personName.trim() ||
      !feedback.trim() ||
      !location.trim() ||
      !reviewType.trim()
    ) {
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
        response = await axios.post("/api/admin/blog", payload);
      } else if (method === "PUT") {
        response = await axios.put("/api/admin/blog/update", {
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
      setMessage(
        error?.response?.data?.message || "Communication protocol failed.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to purge review ID: [${id}]?`)) return;
    try {
      const res = await axios.delete(
        `/api/admin/dashboard/review-set?id=${id}`,
      );
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
          <h1 className="rm-title">Your Blogs</h1>
          <p className="rm-sub">Monitor Your Blog, inject new Blog</p>
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
            // VIEW Blog ({reviews.length})
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
            + ADD NEW Blog
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
                  <div className="rm-empty-msg rm-mono">
                    QUERYING DATABASE...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rm-empty-msg rm-mono">
                    NO FEEDBACK ENTRIES RECORDED. CLICK "+ ADD NEW REVIEW" TO
                    BEGIN.
                  </div>
                ) : (
                  <div className="rm-grid-items">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="rm-item-card">
                        <div className="rm-item-meta">
                          <div className="rm-item-top-row">
                            <span className="rm-item-name rm-mono">
                              <strong>{rev.blog_title}</strong>
                            </span>
                          </div>
                          <p className="rm-item-feedback">
                            "{rev.blog_description}"
                          </p>
                        </div>
                        <div className="rm-item-actions">
                          {/* <button
                            className="rm-action-btn edit rm-mono"
                            onClick={() => handleEditClick(rev)}
                          >
                            EDIT
                          </button> */}
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
                <CreateBlog />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
