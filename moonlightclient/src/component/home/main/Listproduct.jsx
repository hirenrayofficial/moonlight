"use client";
import React, { useEffect, useState } from "react";
import "./listproduct.scss";
import Card from "../product/Card";
import { getItem } from "@/services/home/GetProduct";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * STOCKROOM — product list / showcase section
 */

const CATEGORIES = [
  { label: "All", query: undefined },
  { label: "Full Automatic", query: "full-automatic" },
  { label: "Semi Automatic", query: "semi-automatic" },
  { label: "Hydraulic", query: "hydraulic" },
  { label: "Manual", query: "manual" },
];

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

export default function ProductShowcase({ view, query: initialQuery }) {
  const router = useRouter();
  const pathname = usePathname() || "/home/machines";
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Safely grab query from URL search params or fallback to prop
  const urlQuery = searchParams.get("query");
  const activeQuery = urlQuery !== null ? urlQuery : initialQuery;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item", activeQuery || "all"],
    queryFn: () => getItem(activeQuery),
    // Fixes the caching lockup bug when switching rapidly between categories
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (catQuery) => {
    if (catQuery) {
      router.push(`${pathname}?query=${catQuery}`, { scroll: false });
    } else {
      router.push(pathname, { scroll: false });
    }
  };

  const safeData = data || [];

  return (
    <section className="pl-root mt-16">
      <div className="pl-inner">
        <div className="pl-head">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="pl-title">In the warehouse now</h2>
          </motion.div>
          <div
            className="pl-tabs"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => {
              const isActive =
                cat.query === undefined
                  ? !activeQuery
                  : activeQuery === cat.query;
              return (
                <button
                  key={cat.label}
                  role="tab"
                  aria-selected={isActive}
                  className={`pl-tab pl-mono ${isActive ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat.query)}
                  disabled={mounted ? isLoading : false}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && !safeData.length ? (
          <SkeletonGrid />
        ) : isError ? (
          <div className="pl-empty pl-mono">
            Couldn't load products{error?.message ? ` — ${error.message}` : ""}.
          </div>
        ) : safeData?.length === 0 ? (
          <div className="pl-empty pl-mono">Nothing stocked here yet.</div>
        ) : (
          <Card product={safeData} key={activeQuery || "all"} />
        )}
        {view && (
          <div className="pl-footer">
            <button
              className="pl-view-all"
              onClick={() => (window.location.href = "/home/machines")}
            >
              View full catalog
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
