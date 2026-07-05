"use client";
import React, { useState } from "react";
import "./listproduct.scss";
import Card from "../product/Card";
import axios from "axios";
import { getItem } from "@/services/home/GetProduct";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
/**
 * STOCKROOM — product list / showcase section
 * A landing-page catalog block: filterable grid, hairline dividers,
 * quick-add on hover. Same system as the hero and product page.
 */

const CATEGORIES = ["All", "Manually", "Automatic"];

function money(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ProductShowcase({ view }) {
  const [active, setActive] = useState("All");
  const { data, isLoading, error } = useQuery({
    queryKey: ["item"],
    queryFn: getItem,
  });

  const visible =
    active === "All" ? data : data.filter((p) => p.category === active);
  const pathname = usePathname();

  // 1. Split the path and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <section className="pl-root">
      <div className="pl-inner">
        <div className="pl-eyebrow pl-mono flex">
          <Link href="/">Home</Link>
          {segments.map((segment, index) => {
            // Build the path up to this segment
            const href = `/${segments.slice(0, index + 1).join("/")}`;

            return (
              <div key={href} className="flex gap-2">
                <span>/</span>
                <Link href={href} className="capitalize bold text-gray-500">
                  {segment.replace(/-/g, " ")}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="pl-head">
          <div>
            {/* <div className="pl-eyebrow pl-mono">Product No. 014</div> */}
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

        {visible?.length === 0 ? (
          <div className="pl-empty pl-mono">Nothing stocked here yet.</div>
        ) : (
          <Card product={visible} />
        )}
        {view && (
          <div className="pl-footer">
            <button className="pl-view-all">View full catalog</button>
          </div>
        )}
      </div>
    </section>
  );
}
