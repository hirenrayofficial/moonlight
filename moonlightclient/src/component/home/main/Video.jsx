"use client"
import React, { useState } from "react";

/**
 * Video — no external package, no version drift.
 * YouTube links render as an <iframe> embed. Direct file links (.mp4, .webm,
 * etc.) render as a native <video>. Works with just `link`, nothing to install.
 */

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function Video({ link, thumbnail, autoPlay = false }) {
  const [started, setStarted] = useState(autoPlay);

  if (!link) return null;

  const youtubeId = extractYouTubeId(link);

  const wrapStyle = {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    background: "#1a1a17",
    overflow: "hidden",
  };

  // ---------- YouTube ----------
  if (youtubeId) {
    const params = new URLSearchParams({
      autoplay: started ? "1" : "0",
      mute: started && autoPlay ? "1" : "0",
      rel: "0",
      modestbranding: "1",
    });
    const embedSrc = `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
    const poster = thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    if (!started) {
      return (
        <div style={wrapStyle}>
          <button
            type="button"
            onClick={() => setStarted(true)}
            aria-label="Play video"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              padding: 0,
              border: "none",
              cursor: "pointer",
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="27" fill="rgba(21,20,15,0.6)" stroke="white" strokeWidth="1.5" />
                <path d="M22 17L39 28L22 39V17Z" fill="white" />
              </svg>
            </span>
          </button>
        </div>
      );
    }

    return (
      <div style={wrapStyle}>
        <iframe
          src={embedSrc}
          title="Video player"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // ---------- direct video file (.mp4, .webm, etc.) ----------
  return (
    <div style={wrapStyle}>
      <video
        key={link}
        controls
        autoPlay={autoPlay}
        muted={autoPlay}
        loop={autoPlay}
        poster={thumbnail}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src={link} />
        Your browser doesn't support embedded video.
      </video>
    </div>
  );
}