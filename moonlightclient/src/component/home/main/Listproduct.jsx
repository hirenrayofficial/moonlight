"use client";
import React, { useEffect, useState } from "react";
import "./listproduct.scss";
import Card from "../product/Card";
import { getItem } from "@/services/home/GetProduct";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
/**
 * STOCKROOM — product list / showcase section
 * A landing-page catalog block: filterable grid, hairline dividers,
 * quick-add on hover. Same system as the hero and product page.
 */

const CATEGORIES = ["All",];
const SKELETON_COUNT = 8;

function SkeletonCard() {
  return (
    <div className="pl-card pl-skeleton-card" aria-hidden="true">
      <div className="pl-image pl-skel-block" />
      <div className="pl-info">
        <div className="pl-skel-line pl-skel-line-name" />
        <div className="pl-skel-line pl-skel-line-name short" />
        <div className="pl-skel-line pl-skel-line-price" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="pl-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function ProductShowcase({ view }) {
  const [active, setActive] = useState("All");
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item"],
    queryFn: getItem,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname() || "";

  // 1. Split the path and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // guard against `data` being undefined while the query is still loading —
  // filtering undefined was throwing the moment a category tab was clicked
  // before the first fetch resolved.
  const safeData = data || [];
  const visible = active === "All" ? safeData : safeData.filter((p) => p.category === active);

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
                disabled={mounted ? isLoading : false}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : isError ? (
          <div className="pl-empty pl-mono">
            Couldn't load products{error?.message ? ` — ${error.message}` : ""}.
          </div>
        ) : visible?.length === 0 ? (
          <div className="pl-empty pl-mono">Nothing stocked here yet.</div>
        ) : (
          <Card product={visible} />
        )}
        {view && (
          <div className="pl-footer">
            <button className="pl-view-all"onClick={(e)=> window.location.href = "/home/machines"} >View full catalog</button>
          </div>
        )}
      </div>
    </section>
  );
}