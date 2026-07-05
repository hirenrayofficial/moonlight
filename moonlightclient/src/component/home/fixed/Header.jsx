"use client";
import Image from "next/image";
import React from "react";
import "./header.scss";
/**
 * MOONLIGHT — utilitarian header
 * Same system as the Stockroom hero: paper background, hairline rule,
 * monospace nav labels, sharp corners. No blur, no pill button.
 */

export default function Header() {
  const handelCall = (link) => {
    if (link === "machine") {
      window.location.href = "/machines";
    } else if (link === "about") {
      window.location.href = "/about";
    } else if (link === "num") {
      const phoneNumber = "+918178445596"; // replace with your actual number
      window.location.href = `tel:${phoneNumber}`;
    } else return;
  };
  return (
    <header className="hd-root">
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
            <a className="hd-nav-link" href="/machines">
              Machines
            </a>
            <a className="hd-nav-link" href="/blog">
              Blog
            </a>
          </nav>
          <button className="hd-shop-btn" onClick={(e) => handelCall("machine")}>Shop</button>
          <button className="hd-shop-btn cal" onClick={(e) => handelCall("num")}>
            Call
          </button>
        </div>
      </div>
    </header>
  );
}
