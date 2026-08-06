"use client";
import Image from "next/image";
import React from "react";
import "./header.scss";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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
  // {
  //   name: "LinkedIn",
  //   url: "https://linkedin.com/company/moonlightmachinery",
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
  //       <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
  //       <circle cx="6.3" cy="6.5" r="0.9" fill="currentColor" />
  //       <path d="M6.3 9V14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  //       <path d="M9.3 14.5V11C9.3 9.8 10.1 9 11.2 9C12.3 9 13 9.8 13 11V14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  //     </svg>
  //   ),
  // },
];

export default function Header() {
  const handelCall = (link) => {
    console.log(link);
    if (link === "about") {
      window.location.href = "/about";
    } else if (link === "num") {
      const phoneNumber = "+918178445596"; // replace with your actual number
      window.location.href = `tel:${phoneNumber}`;
    } else return;
  };
  const handelLogin = () => {
    window.location.href = "/getway";
  };
  const handelHome = () => {
    window.location.href = "/";
  };

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

      <div  className="hd-inner cursor-pointer">
        <div className="hd-brand" onClick={(e) => handelHome()}>
          <div className="hd-brand-mark w-[50px] h-[50px] md:w-[80px] md:h-[80px]">
            <Image
              width={500}
              height={70}
              alt="Moonlight Machinery"
              src="/logo.png"
              priority
              className="hd-brand-logo w-[50px] h-[50px] md:w-[80px] md:h-[80px]"
            />
          </div>
          <span className="grid leading-6">
            <span className="hd-brand-name text-[16px] md:text-[20px]">
              Moonlight Machinery
            </span>
            <span className="hd-brand-tagline hidden md:block text-[12px] md:text-[14px]">
              Best disposable paper plates making machine in India
            </span>
          </span>
        </div>

        <div className="hd-links gap-2 md:gap-[32px]">
          <nav className="hd-nav">
            <a className="hd-nav-link" href="/">
              Home
            </a>
            <a className="hd-nav-link" href="/home/machines">
              Machines
            </a>
            <a className="hd-nav-link" href="/home/blog">
              Blog
            </a>
          </nav>
          <Link className="hd-shop-btn" href={"/getway"}>
            Login
          </Link>
          <button
            className="hd-shop-btn cal"
            onClick={(e) => handelCall("num")}
          >
            Call
          </button>
        </div>
      </div>
    </motion.header>
  );
}
