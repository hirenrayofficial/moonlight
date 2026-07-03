"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import './temphero.scss'

/**
 * STOCKROOM — utilitarian hero section, shopping edition
 * Design thesis: a plain, gridded product showcase — real photos, real
 * prices, hairline dividers, zero lifestyle staging.
 */

const PRODUCTS = [
  {
    name: "FULL AUTOMATIC SINGLE DIE PAPER PLATE MAKING MACHINE",
    price: 35000.0,
    category: "Automatic",
    image: "/p-d.png",
    tag: "In stock",
  },
  {
    name: "Fully Automatic Paper Cup Machine",
    price: 60000.0,
    category: "Automatic",
    image: "/p-a.png",
  },
  {
    name: "FULL AUTOMATIC DOUBLE DIE PAPER PLATE MAKING MACHINE",
    price: 73000.0,
    category: "Automatic",
    image: "/doubledie.png",
  },
  {
    name: "HYDRAULIC SINGLE CYLINDER WITH PANEL BOARD PAPER PLATE MAKING MACHINE",
    price: 70000.0,
    category: "Manually",
    image: "/HYDRAULICSINGLECYLINDER.png",
    tag: "Low stock",
  },

];

const LEDGER = [
  { label: "Pricing", value: "Cost always Contact Based" },
  { label: "Shipping", value: "Contact Based" },
  { label: "Returns", value: "Contact Based" },
  { label: "Sourcing", value: "Own factories" },
];

function money(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function useLiveStock() {
  const [stock, setStock] = useState(1240);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const iv = setInterval(() => {
      setStock((n) => Math.max(1180, n - Math.floor(Math.random() * 3)));
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  return stock;
}

export default function ShoppingUtilitarianHero() {
  const stock = useLiveStock();

  return (
    <div className="sr-root">


      {/* <nav className="sr-nav">
        <div className="sr-logo">
          <div className="sr-logo-mark">S</div>
          <span className="sr-wordmark">Stockroom</span>
        </div>
        <div className="sr-nav-links">
          <a className="sr-nav-link" href="#catalog">Catalog</a>
          <a className="sr-nav-link" href="#pricing">Pricing</a>
          <a className="sr-nav-link" href="#about">About</a>
          <a className="sr-nav-link" href="#account">Account</a>
          <button className="sr-nav-cta">Shop now</button>
        </div>
      </nav> */}

      <section className="sr-hero">
        <div className="sr-hero-left">
          <div className="sr-eyebrow sr-mono">
            Product No. 014 — {stock.toLocaleString("en-US")} items in stock
          </div>

          <h1 className="sr-headline">
            India's  
            <br />
            <mark> Trusted</mark> Manufacturer of Areca Leaf & Disposable Plates
          </h1>

          <p className="sr-subhead">
            At Moonlight Machinery, We provide high-quality, eco-friendly dining solutions designed for the conscious consumer and professional business. Our products offer a premium, sustainable alternative to traditional disposables, ensuring you never have to compromise on durability or safety
          </p>

          <div className="sr-cta-row">
            <button className="sr-btn-primary">Browse the Product</button>
            <button className="sr-btn-secondary">See how pricing works</button>
          </div>

          <p className="sr-meta sr-mono">Ships from stock — most orders same day.</p>
        </div>

        <div className="sr-hero-right">
          <div className="sr-showcase">
            {PRODUCTS.map((p, i) => (
              <div className="sr-product-card" key={p.name}>
                {i === 0 && <span className="sr-product-tag sr-mono">In stock</span>}
                <Image width={300} height={300} className="sr-product-image" src={p.image} alt={p.name} />
                <div className="sr-product-info">
                  <div className="sr-product-name">{p.name}</div>
                  <div className="sr-product-price sr-mono">₹{money(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-ledger">
        {LEDGER.map((l) => (
          <div className="sr-ledger-cell" key={l.label}>
            <div className="sr-ledger-label sr-mono">{l.label}</div>
            <div className="sr-ledger-value">{l.value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}