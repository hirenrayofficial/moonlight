"use client";
import Image from "next/image";
import React from "react";
import "./header.scss";
import {
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { color, motion } from "framer-motion";
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
    url: "https://wa.me/918178445596",
    icon: <FaWhatsapp />,
  },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Machines", href: "/home/machines" },
  { label: "Blog", href: "/home/blog" },
];

const MOBILE_ACTIONS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/918178445596",
    icon: <FaWhatsapp />,
    color: "green-500",
    bg: "transparent",
  },
  {
    label: "Call",
    href: "tel:+918178445596",
    icon: <FaPhone />,
    color: "orange-500",
    bg: "transparent",
  },
];

export default function Header() {
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
              Best disposable paper plates making machine in India
            </span>
          </span>
        </div>

        <div className="hd-links gap-2 md:gap-8">
          <nav className="hd-nav">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} className="hd-nav-link" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hd-actions">
            <Link className="hd-shop-btn" href="/getway">
              Login
            </Link>
            <a className="hd-shop-btn cal" href="tel:+918178445596">
              Call
            </a>
          </div>
        </div>
      </div>
      {/* <div className="button-links sm:hidden">
        {MOBILE_ACTIONS.map((item) => (
          <a
            key={item.label}
            className={`button-link bg-${item.bg} text-${item.color}`}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <span className={`button-icon`} >
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </div> */}
    </motion.header>
  );
}
