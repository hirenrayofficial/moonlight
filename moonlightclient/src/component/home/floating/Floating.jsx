"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Plus, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";

const SOCIALS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/918178445596",
    Icon: FaWhatsapp,
    color: "#22c55e",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/moonlightmachinery",
    Icon: FaInstagram ,
    color: "#ec4899",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCCGAoZpF0h1MD-iwWThGEZg",
    Icon: FaYoutube,
    color: "#ef4444",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://facebook.com/moonlightmachinery",
    Icon: FaFacebook,
    color: "#3b82f6",
  },
];

// tracks whether the viewport is "mobile" (< breakpoint) so we can switch
// between the always-visible desktop rail and the mobile drawer/FAB
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export default function Floating() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // close mobile drawer automatically if the viewport grows to desktop
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const itemVariantsDesktop = {
    hidden: { opacity: 0, x: -24, scale: 0.6 },
    show: { opacity: 1, x: 0, scale: 1 },
  };

  const itemVariantsMobile = {
    hidden: { opacity: 0, y: 16, scale: 0.6 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <>
      {/* ---------- DESKTOP: always-visible vertical rail ---------- */}
      {!isMobile && (
        <motion.div
          className="fixed left-0 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-r-2xl bg-white/90 p-2 shadow-lg backdrop-blur"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {SOCIALS.map(({ key, label, href, Icon, color }) => (
            <motion.a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              variants={itemVariantsDesktop}
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-11 w-11 items-center justify-center rounded-full"
            >
              <Icon size={26} color={color} strokeWidth={2} />
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* ---------- MOBILE: FAB + drawer ---------- */}
      {isMobile && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
          <AnimatePresence>
            {open && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="flex flex-col items-center gap-3"
              >
                {SOCIALS.map(({ key, label, href, Icon, color }) => (
                  <motion.a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    variants={itemVariantsMobile}
                    exit={{ opacity: 0, y: 16, scale: 0.6 }}
                    whileTap={{ scale: 0.85 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md"
                  >
                    <Icon size={24} color={color} strokeWidth={2} />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            aria-label={open ? "Close social links" : "Open social links"}
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: open ? 45 : 0 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg"
          >
            {open ? <X size={24} /> : <CiViewBoard size={24} />}
          </motion.button>
        </div>
      )}
    </>
  );
}