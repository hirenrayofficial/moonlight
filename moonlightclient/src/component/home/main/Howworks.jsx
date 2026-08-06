"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Video from "./Video";
import useYouTubeMeta from "./useYouTubeMeta";
import './working.scss';

/**
 * STOCKROOM — how it works + trust videos
 * Fixed version: the playable URL now lives in `src` (what actually gets
 * passed to ReactPlayer). `poster` was renamed `thumbnail` and is passed
 * to Video's `light` prop, since react-player has no `poster` prop.
 */

const STEPS = [
  { n: "01", title: "See the product", desc: "A full walkthrough of what it actually is, what it does, and who it's for — before you spend anything." },
  { n: "02", title: "Know the real price", desc: "Exact cost breakdown, no hidden fees or bundled upsells hiding the real number." },
  { n: "03", title: "See how it earns", desc: "The actual day-to-day method — what you do, how often, and what it realistically pays." },
  { n: "04", title: "Try it yourself", desc: "Everything you need to start today, laid out step by step, no guesswork." },
];


const VIDEOS = [
  {
    duration: "2:14",
    src: "https://www.youtube.com/watch?v=dvi_CI2-xDI",
    desc: "A walkthrough of where your order actually sits before it ships.",
  },
  {
    duration: "1:48",
    src: "https://www.youtube.com/watch?v=U-2XoKMIy90",
    desc: "Start to finish: pick ticket to sealed box, no cuts.",
  },
  {
    duration: "3:02",
    src: "https://youtu.be/7K7ZxO2hJIg?si=FDRj-ZVGhGpF8Vgs",
    desc: "The seven people who pack, ship, and answer your emails.",
  },
];

// --- animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function isYouTubeUrl(url) {
  return typeof url === "string" && /youtube\.com|youtu\.be/.test(url);
}

function VideoCard({ video, active, onClick }) {
  const meta = useYouTubeMeta(isYouTubeUrl(video.src) ? video.src : null);
  const title = video.title || meta.title || "Untitled";
  const thumbnail = video.thumbnail || meta.thumbnail;

  return (
    <motion.button
      className={`hw-card ${active ? "active" : ""}`}
      onClick={onClick}
      variants={staggerItem}
    >
      <div className="hw-thumb-wrap">
        {thumbnail && <img className="hw-thumb" src={thumbnail} alt={title} />}
        <span className="hw-thumb-duration hw-mono">{video.duration}</span>
        <span className="hw-play-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="15" fill="rgba(21,20,15,0.55)" stroke="white" strokeWidth="1" />
            <path d="M13 10.5L22 16L13 21.5V10.5Z" fill="white" />
          </svg>
        </span>
      </div>
      <div className="hw-card-info">
        <div className="hw-card-title">{title}</div>
        <div className="hw-card-desc">{video.desc}</div>
      </div>
    </motion.button>
  );
}

export default function HowItWorks() {
  const [activeVideo, setActiveVideo] = useState(0);
  const current = VIDEOS[activeVideo];
  const currentMeta = useYouTubeMeta(isYouTubeUrl(current.src) ? current.src : null);
  const currentTitle = current.title || currentMeta.title || "Loading title…";
  const currentThumbnail = current.thumbnail || currentMeta.thumbnail;

  return (
    <section className="hw-root">


      <div className="hw-inner">
        <motion.div
          className="hw-eyebrow hw-mono"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          How it works
        </motion.div>

        <motion.h2
          className="hw-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          From warehouse to your door, on camera
        </motion.h2>

        <div className="hw-layout">
          <motion.div
            className="hw-player-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Video link={current.src} thumbnail={currentThumbnail} />
              </motion.div>
            </AnimatePresence>
            <div className="hw-player-meta">
              <span className="hw-player-title">{currentTitle}</span>
              <span className="hw-player-duration hw-mono">{current.duration}</span>
            </div>
          </motion.div>

          <motion.div
            className="hw-steps"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {STEPS.map((s) => (
              <motion.div className="hw-step" key={s.n} variants={staggerItem}>
                <span className="hw-step-num hw-mono">{s.n}</span>
                <div>
                  <div className="hw-step-title">{s.title}</div>
                  <p className="hw-step-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hw-trust-head hw-mono"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          More from inside the warehouse
        </motion.div>

        <motion.div
          className="hw-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {VIDEOS.map((v, i) => (
            <VideoCard
              key={v.src}
              video={v}
              active={i === activeVideo}
              onClick={() => setActiveVideo(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}