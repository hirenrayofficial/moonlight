"use client";
import Image from "next/image";
import React from "react";
import "./header.scss";
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
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="14.6" cy="5.4" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@moonlightmachinery6670?si=1W37CtkGFkI7vX7A",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <rect x="1.5" y="4.5" width="17" height="11" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.2 7.6L12.4 10L8.2 12.4V7.6Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com/profile.php?id=100068148668790",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 6.5H10.5C9.7 6.5 9 7.2 9 8V10H12L11.6 12H9V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/918178445596",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M4 16.5L5 13.2C4.2 11.9 3.9 10.4 4.3 9C5 6.2 7.7 4.3 10.6 4.8C13.1 5.2 15 7.5 14.9 10.1C14.8 13 12.3 15.3 9.4 15.1C8.4 15 7.5 14.7 6.7 14.1L4 16.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
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
    if (link === "machine") {
      window.location.href = "/getway";
    } else if (link === "about") {
      window.location.href = "/about";
    } else if (link === "num") {
      const phoneNumber = "+918178445596"; // replace with your actual number
      window.location.href = `tel:${phoneNumber}`;
    } else return;
  };

  return (
    <header className="hd-root">
      <div className="hd-topbar">
        <span className="hd-topbar-msg">Genuine machine parts, shipped pan-India</span>
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

      <div className="hd-inner">
        <div className="hd-brand">
          <div className="hd-brand-mark ">
            <Image
              width={50}
              height={200}
              alt="Moonlight Machinery "
              src="/logo.png"
              loading="lazy"
              // className="h-50"
            />
          </div>
          <span className="hd-brand-name hidden sm:flex md:flex">
            Moonlight Machinery
          </span>
        </div>
        <div className="hd-links">
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
          <button className="hd-shop-btn" onClick={(e) => handelCall("machine")}>Login</button>
          <button className="hd-shop-btn cal" onClick={(e) => handelCall("num")}>
            Call
          </button>
        </div>
      </div>
    </header>
  );
}