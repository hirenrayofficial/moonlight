"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./video-manager.scss";
import Video from "../../component/home/main/Video";
import useYouTubeMeta from "../../component/home/main/useYouTubeMeta";

function isYouTubeUrl(url) {
  return typeof url === "string" && /youtube\.com|youtu\.be/.test(url);
}

// Sub-component for rendering video preview safely using the custom Video component and YouTube hook
function VideoPreviewComponent({ url }) {
  const isYT = isYouTubeUrl(url);
  const ytMeta = useYouTubeMeta(isYT ? url : null);

  if (isYT) {
    return (
      <div className="vm-video-frame yt-frame">
        {ytMeta?.embedUrl ? (
          <iframe
            src={ytMeta.embedUrl}
            title="YouTube Preview"
            className="vm-live-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="vm-empty-msg vm-mono">RESOLVING YOUTUBE METADATA...</div>
        )}
      </div>
    );
  }

  return (
    <div className="vm-video-frame">
      <Video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className="vm-live-video"
      />
    </div>
  );
}

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSource, setVideoSource] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // list | create | edit

  const fetchVideos = async () => {
    setLoadingList(true);
    try {
      const response = await axios.get("/api/admin/dashboard/videoset");
      if (response?.data?.success) {
        setVideos(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load existing videos:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAction = async (method) => {
    if (!videoSource.trim()) {
      setStatus("error");
      setMessage("Video source identifier is mandatory.");
      return;
    }
    if (method !== "DELETE" && !videoUrl.trim()) {
      setStatus("error");
      setMessage("Video URL is required.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      let response;
      if (method === "POST") {
        response = await axios.post("/api/admin/dashboard/videoset", {
          video_url: videoUrl,
          video_source: videoSource,
        });
      } else if (method === "PUT") {
        response = await axios.put("/api/admin/dashboard/videoset", {
          video_url: videoUrl,
          video_source: videoSource,
        });
      } else if (method === "DELETE") {
        response = await axios.delete(
          `/api/admin/dashboard/videoset?video_source=${encodeURIComponent(videoSource)}`
        );
      }

      if (response?.data?.success) {
        setStatus("success");
        setMessage(response.data.message || "Operation executed successfully.");
        setVideoUrl("");
        setVideoSource("");
        fetchVideos();
        setTimeout(() => setActiveTab("list"), 1200);
      } else {
        setStatus("error");
        setMessage(response?.data?.message || "Operation failed.");
      }
    } catch (error) {
      console.error("API request failed:", error);
      setStatus("error");
      setMessage(
        error?.response?.data?.message || "Communication protocol failed."
      );
    }
  };

  const handleDelete = async (sourceKey) => {
    if (!confirm(`Are you sure you want to purge source: [${sourceKey}]?`))
      return;
    try {
      const res = await axios.delete(
        `/api/admin/dashboard/videoset?video_source=${encodeURIComponent(sourceKey)}`
      );
      if (res?.data?.success) {
        fetchVideos();
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
    }
  };

  const handleEditClick = (item) => {
    setVideoSource(item.video_source);
    setVideoUrl(item.video_url);
    setActiveTab("edit");
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="vm-root">
      {/* Cyber Grid Background Elements */}
      <div className="vm-bg-grid" aria-hidden="true">
        <div className="grid-line-v"></div>
        <div className="grid-line-v"></div>
        <div className="grid-line-h"></div>
      </div>

      <motion.div
        className="vm-container"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <div className="vm-header">
          <div className="vm-eyebrow vm-mono">
            <span className="vm-dot"></span> DATABASE STREAM CONTROLLER // 02
          </div>
          <h1 className="vm-title">VIDEO ASSET MANIFEST</h1>
          <p className="vm-sub">
            Inspect active streams, register new sources, or modify existing
            configurations on the fly.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="vm-tabs">
          <button
            className={`vm-tab vm-mono ${activeTab === "list" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("list");
              setStatus("idle");
              setMessage("");
            }}
          >
            // VIEW EXISTING ({videos.length})
          </button>
          <button
            className={`vm-tab vm-mono ${activeTab === "create" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("create");
              setVideoSource("");
              setVideoUrl("");
              setStatus("idle");
              setMessage("");
            }}
          >
            + ADD NEW VIDEO
          </button>
          {activeTab === "edit" && (
            <button className="vm-tab vm-mono active">⚙ EDIT RECORD</button>
          )}
        </div>

        {/* Main Interface Content Panel */}
        <div className="vm-panel">
          <div className="vm-panel-head vm-mono">
            <span>MODE: [{activeTab.toUpperCase()}]</span>
            <span className="vm-status-indicator">SECURE CONNECTION</span>
          </div>

          <div className="vm-form-body">
            {activeTab === "list" ? (
              <div className="vm-list-container">
                {loadingList ? (
                  <div className="vm-empty-msg vm-mono">
                    QUERYING DATABASE...
                  </div>
                ) : videos.length === 0 ? (
                  <div className="vm-empty-msg vm-mono">
                    NO RECORDED VIDEO STREAMS FOUND. CLICK "+ ADD NEW VIDEO" TO
                    BEGIN.
                  </div>
                ) : (
                  <div className="vm-grid-items">
                    {videos.map((vid) => (
                      <div key={vid._id} className="vm-item-card">
                        <div className="vm-item-preview">
                          <Video
                            src={vid.video_url}
                            muted
                            loop
                            playsInline
                            className="vm-thumb-video"
                          />
                        </div>
                        <div className="vm-item-meta">
                          <div className="vm-item-key vm-mono">
                            KEY: <strong>{vid.video_source}</strong>
                          </div>
                          <div className="vm-item-url vm-mono text-truncate">
                            URL: {vid.video_url}
                          </div>
                        </div>
                        <div className="vm-item-actions">
                          <button
                            className="vm-action-btn edit vm-mono"
                            onClick={() => handleEditClick(vid)}
                          >
                            EDIT
                          </button>
                          <button
                            className="vm-action-btn delete vm-mono"
                            onClick={() => handleDelete(vid.video_source)}
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
                <div className="vm-field">
                  <label className="vm-label vm-mono" htmlFor="video-source">
                    UNIQUE SOURCE IDENTIFIER (Key)
                  </label>
                  <input
                    id="video-source"
                    className="vm-input vm-mono"
                    type="text"
                    disabled={activeTab === "edit"}
                    placeholder="e.g. hero-background-main"
                    value={videoSource}
                    onChange={(e) => setVideoSource(e.target.value)}
                  />
                  {activeTab === "edit" && (
                    <span className="vm-hint vm-mono">
                      Identifier keys cannot be modified during editing.
                    </span>
                  )}
                </div>

                <div className="vm-field">
                  <label className="vm-label vm-mono" htmlFor="video-url">
                    MEDIA RESOURCE URL (.mp4 / stream source / YouTube)
                  </label>
                  <input
                    id="video-url"
                    className="vm-input vm-mono"
                    type="url"
                    placeholder="https://cdn.domain.com/asset.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                {/* Live Stream Preview Window using custom Video and YouTube meta hook */}
                {videoUrl && (
                  <div className="vm-preview-box">
                    <div className="vm-preview-label vm-mono">
                      STREAM PREVIEW:
                    </div>
                    <VideoPreviewComponent url={videoUrl} />
                  </div>
                )}

                {/* Status Alerts */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div
                      className="vm-alert vm-error vm-mono"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      [ ERROR: {message} ]
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.div
                      className="vm-alert vm-success vm-mono"
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
                  className="vm-submit-btn vm-mono"
                  disabled={status === "loading"}
                  onClick={() =>
                    handleAction(activeTab === "create" ? "POST" : "PUT")
                  }
                >
                  {status === "loading" ? (
                    <span className="vm-load-row">
                      <span className="vm-spinner"></span> PROCESSING
                      DIRECTIVE...
                    </span>
                  ) : (
                    <span>
                      {activeTab === "create" && "REGISTER NEW VIDEO →"}
                      {activeTab === "edit" && "SAVE RECORD CHANGES →"}
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