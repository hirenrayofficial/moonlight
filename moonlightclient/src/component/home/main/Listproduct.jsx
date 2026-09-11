"use client";
import React, { useEffect, useState } from "react";
import "./listproduct.scss";
import Card from "../product/Card";
import { getItem } from "@/services/home/GetProduct";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

export default function ProductShowcase({ hide, view, query: initialQuery, Subcategory: initialSub, Pricategory: initialPrice }) {
  const router = useRouter();
  const pathname = usePathname() || "/home/machines";
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Check both variations for safety
  const urlQuery = searchParams.get("query");
  const urlPrice = searchParams.get("p-catagory") || searchParams.get("Pcatagory");
  const urlSub = searchParams.get("s-catagory") || searchParams.get("Scatagory");

  const activeQuery = urlQuery !== null ? urlQuery : initialQuery;
  const activePrice = urlPrice !== null ? urlPrice : initialPrice;
  const activeSub = urlSub !== null ? urlSub : initialSub;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item", activeQuery, activePrice, activeSub],
    queryFn: () =>
      getItem({
        query: activeQuery,
        pCategory: activePrice,
        sCategory: activeSub,
      }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (catQuery) => {
    // Preserve existing search parameters using URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    if (catQuery) {
      params.set("query", catQuery);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
            <h2 className="pl-title">In Stock</h2>
          </motion.div>
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
          <Card product={safeData} key={activeQuery || activePrice || "all"} />
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