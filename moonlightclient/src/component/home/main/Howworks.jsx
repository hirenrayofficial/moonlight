"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Video from "./Video";
import useYouTubeMeta from "./useYouTubeMeta";

const STEPS = [
  { 
    n: "01", 
    title: "See the product", 
    desc: "A full walkthrough of what it actually is, what it does, and who it's for — before you spend anything.",
    videoIndex: 0
  },
  { 
    n: "02", 
    title: "Know the real price", 
    desc: "Exact cost breakdown, no hidden fees or bundled upsells hiding the real number.",
    videoIndex: 1
  },
  { 
    n: "03", 
    title: "See how it earns", 
    desc: "The actual day-to-day method — what you do, how often, and what it realistically pays.",
    videoIndex: 2
  },
  { 
    n: "04", 
    title: "Try it yourself", 
    desc: "Everything you need to start today, laid out step by step, no guesswork.",
    videoIndex: 0
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function isYouTubeUrl(url) {
  return typeof url === "string" && /youtube\.com|youtu\.be/.test(url);
}

export default function HowItWorks() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/home/landing-dt/video-dt");
        if (response?.data?.success) {
          setVideos(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load video feeds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const fallbackVideos = [
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

  const displayVideos = videos.length > 0 ? videos : fallbackVideos;
  const current = displayVideos[activeVideo] || displayVideos[0] || {};
  const currentSrc = current.src || current.video_url || "";
  
  const currentMeta = useYouTubeMeta(isYouTubeUrl(currentSrc) ? currentSrc : null);
  const currentTitle = current.title || currentMeta.title || "Loading feed…";
  const currentThumbnail = current.thumbnail || currentMeta.thumbnail;
  const currentDuration = current.duration || "2:00";

  return (
    <section className="py-0 px-6 bg-transparent text-blue-100 flex justify-center selection:bg-blue-100 selection:text-blue-950">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Minimalist Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-blue-800 pb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500-900/40 border border-blue-800 w-fit  text-[11px] uppercase tracking-widest text-gray-400 font-medium rounded-none"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></span>
              Operations Log 2026
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black leading-[1.08]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.05 }}
            >
              Absolute visibility. Zero blind spots.
            </motion.h2>
          </div>

          <motion.p 
            className="text-blue-400 text-base max-w-sm leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            Explore our end-to-end framework through live camera feeds, complete data visibility, and audited processing steps.
          </motion.p>
        </div>

        {/* Square Layout Model: Sticky Viewport + Interactive Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          
          {/* Left Column: Square Interactive Timeline */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {STEPS.map((step, index) => {
              const isActive = activeVideo === step.videoIndex;
              return (
                <motion.div
                  key={step.n}
                  onClick={() => setActiveVideo(step.videoIndex)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`group relative flex flex-col gap-4 p-6 sm:p-8 rounded-none transition-all duration-300 cursor-pointer border ${
                    isActive 
                      ? "bg-blue-900/80 border-blue-600 " 
                      : "bg-transparent border-blue-800/80 hover:bg-blue-900/40 hover:border-blue-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={` text-xs font-semibold px-3 py-1.5 border rounded-none ${
                      isActive ? "bg-blue-800 text-white border-blue-600" : "bg-blue-900 text-blue-400 border-blue-800"
                    }`}>
                      Stage {step.n}
                    </span>
                    <span className=" text-xs text-blue-500 group-hover:text-blue-300 transition-colors">
                      {isActive ? "Feed Active →" : "Click to load feed"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className={`"text-xl font-semibold tracking-tight " ${isActive ? "text-white": "text-blue-500"}`}>{step.title}</h3>
                    <p className={`"text-sm  leading-relaxed font-normal" ${isActive ? "text-blue-300":"text-black"}`}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Square Sticky Media Viewport Deck */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 flex flex-col gap-6">
            <motion.div
              className="flex flex-col gap-4  border border-blue-800 rounded-none p-5 sm:p-6 "
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full aspect-video rounded-none overflow-hidden bg-blue-500 shadow-inner relative border border-blue-800">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center  text-xs text-blue-400">
                    LOADING FEED TELEMETRY...
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSrc}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      <Video link={currentSrc} thumbnail={currentThumbnail} />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-xs  text-blue-900 uppercase tracking-widest">Active Stream</span>
                  <span className="text-sm font-medium text-black tracking-tight line-clamp-1">{currentTitle}</span>
                </div>
                <span className=" text-xs font-medium bg-blue-800 text-blue-300 px-3 py-1.5 rounded-none border border-blue-700/60">
                  {currentDuration}
                </span>
              </div>
            </motion.div>

            {/* Square Quick Selector Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {displayVideos.map((v, i) => (
                <button
                  key={v.src || v.video_url || i}
                  onClick={() => setActiveVideo(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-none  text-xs transition-all whitespace-nowrap border ${
                    i === activeVideo 
                      ? "bg-blue-100 text-blue-950 border-blue-100 font-semibold " 
                      : "bg-blue-900 text-blue-00 border-blue-800 hover:bg-blue-900 hover:text-blue-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-none ${i === activeVideo ? "bg-emerald-600" : "bg-blue-600"}`} />
                  Feed 0{i + 1}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}