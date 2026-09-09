"use client";
import Image from "next/image";
import React, { useState } from "react";
import "./header.scss";
import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaYoutube,
  FaChevronDown,
} from "react-icons/fa";
import { color, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * MOONLIGHT — utilitarian header
 * Same system as the Stockroom hero: paper background, hairline rule,
 * monospace nav labels, sharp corners. No blur, no pill button.
 * A thin social strip sits above the main nav row.
 */

const SOCIALS = [
  {
    name: "Instagram",
    url: "https://instagram.com/moonlightmachinery",
    icon: <FaInstagram />,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@moonlightmachinery6670?si=1W37CtkGFkI7vX7A",
    icon: <FaYoutube />,
  },
  {
    name: "Facebook",
    url: "https://facebook.com/profile.php?id=100068148668790",
    icon: <FaFacebook />,
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/919354327757",
    icon: <FaWhatsapp />,
  },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Machines", href: "/home/machines" },
  { label: "Blog", href: "/home/blog" },
];

const PRODUCT_CATEGORIES = [
  { label: "Full Automatic", href: "/home/machines?query=full-automatic" },
  { label: "Semi Automatic", href: "/home/machines?query=Semi-automatic" },
  { label: "Hydraulic", href: "/home/machines?query=hydraulic" },
  { label: "Manual", href: "/home/machines?query=manual" },
  { label: "Lamination Machines", href: "/home/machines?query=lamination" },
];

const MOBILE_ACTIONS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/919354327757",
    icon: <FaWhatsapp />,
    color: "green-500",
    bg: "transparent",
  },
  {
    label: "Call",
    href: "tel:+919354327757",
    icon: <FaPhone />,
    color: "orange-500",
    bg: "transparent",
  },
];

const handelHome = () => {
  window.location.href = "/";
};

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.header
      className="hd-root"
      initial={{ y: -40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="hd-topbar">
        <span className="hd-topbar-msg">
          Genuine machine , shipped pan-India
        </span>
        <div className="hd-social">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              className="hd-social-link"
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Moonlight Machinery on ${s.name}`}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="hd-inner cursor-pointer">
        <div className="hd-brand" onClick={(e) => handelHome()}>
          <div className="hd-brand-mark w-12.5 h-12.5 md:w-20 md:h-20">
            <Image
              width={500}
              height={70}
              alt="Moonlight Machinery"
              src="/logo.png"
              priority
              className="hd-brand-logo w-12.5 h-12.5 md:w-20 md:h-20"
            />
          </div>
          <span className="grid leading-tight ">
            <span className="hd-brand-name text-[16px] md:text-[20px]">
              Moonlight Machinery
            </span>
            <span className="hd-brand-tagline hidden md:block text-[12px] md:text-[14px]">
              We Promise Quality Never Compromised
            </span>
          </span>
        </div>

        <div className="hd-links gap-2 md:gap-8">
          <nav className="hd-nav flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} className="hd-nav-link" href={item.href}>
                {item.label}
              </Link>
            ))}

            {/* Product Category Dropdown Menu */}
            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="hd-nav-link flex items-center gap-1.5 select-none">
                <span>Product Category</span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px]"
                >
                  <FaChevronDown />
                </motion.span>
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-200 shadow-lg py-2 z-50 rounded-none"
                  >
                    {PRODUCT_CATEGORIES.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="block px-4 py-2.5 text-sm text-neutral-800 hover:bg-neutral-100 transition-colors font-mono"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
          <div className="hd-actions">
            <Link className="hd-shop-btn" href="/getway">
              Login
            </Link>
            <a className="hd-shop-btn cal" href="tel:+919354327757">
              Call
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
