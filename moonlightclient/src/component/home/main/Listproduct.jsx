"use client";
import React, { useState } from "react";
import "./listproduct.scss";
import Card from "../product/Card";
/**
 * STOCKROOM — product list / showcase section
 * A landing-page catalog block: filterable grid, hairline dividers,
 * quick-add on hover. Same system as the hero and product page.
 */

const CATEGORIES = ["All", "Manually", "Automatic"];

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
  {
    name: "HYDRAULIC DOUBLE CYLINDER WITH PANEL PAPER PLATE MAKING MACHINE",
    price: 50000.0,
    category: "Manually",
    image: "/HYDRAULICDOUBLECYLINDER.png",
    tag: "In stock",
  },
  {
    name: "ALL IN ONE PAPER PLATE MAKING MACHINE",
    price: 95000.0,
    category: "Automatic",
    image: "/ALLINONEPAPERPLATEMAKINGMACHINE.png",
  },
  {
    name: "LAMINATION WITH ONLINE SLITTING.png",
    price: 400000.0,
    category: "Automatic",
    image: "/LAMINATION WITH ONLINE SLITTING.png",
  },
];

function money(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ProductShowcase() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <section className="pl-root">
      <div className="pl-inner">
        <div className="pl-head">
          <div>
            <div className="pl-eyebrow pl-mono">Product No. 014</div>
            <h2 className="pl-title">In the warehouse now</h2>
          </div>

          <div
            className="pl-tabs"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                className={`pl-tab pl-mono ${active === c ? "active" : ""}`}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="pl-empty pl-mono">Nothing stocked here yet.</div>
        ) : (
          <Card product={visible} />
        )}

        <div className="pl-footer">
          <button className="pl-view-all">View full catalog</button>
        </div>
      </div>
    </section>
  );
}
