"use client"
import Image from "next/image";
import React from "react";
import "./header.scss";
/**
 * MOONLIGHT — utilitarian header
 * Same system as the Stockroom hero: paper background, hairline rule,
 * monospace nav labels, sharp corners. No blur, no pill button.
 */

export default function Header() {
  const handelCall = () => {
    alert("hii")
    const phoneNumber = "+918178445596"; // replace with your actual number

    window.location.href = `tel:${phoneNumber}`;
  };
  return (
    <header className="hd-root">
      <div className="hd-inner">
        <div className="hd-brand">
          <div className="hd-brand-mark">
            <Image
              width={200}
              height={200}
              alt="Moonlight Machinery "
              src="/logo.png"
            />
          </div>
          <span className="hd-brand-name">Moonlight Machinery</span>
        </div>

        <div className="hd-links">
          <nav className="hd-nav">
            <a className="hd-nav-link" href="#home">
              Home
            </a>
            <a className="hd-nav-link" href="#product">
              Product
            </a>
            <a className="hd-nav-link" href="#blog">
              Blog
            </a>
          </nav>
          <button className="hd-shop-btn">Shop</button>
          <button className="hd-shop-btn cal" onClick={(e) => handelCall()}>
            Call
          </button>
        </div>
      </div>
    </header>
  );
}
