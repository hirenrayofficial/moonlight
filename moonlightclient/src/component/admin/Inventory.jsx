"use client";
import { useModal } from "@/contaxt/admin/ContaxtApi"; // Note: verify if 'contaxt' is a typo in your folder path
import { findProduct } from "@/services/admin/apiService/Product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Inventory({
  filtered,
  categoryFilter, // Driven by parent component
  setCategoryFilter, // Added this prop to update the state
  money,
  openAddModal,
  CATEGORIES,
  confirmDelete,
  openEditModal,
  stockStatus,
  setView,
  adjustStock, // Ensure this function is passed as a prop since it's used below
}) {
  const { modalOpen } = useModal();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["data"],
    queryFn: findProduct,
  });

  const handelAddproduct = () => {
    router.push("/admin/add");
  };

  // 1. Safely handle undefined/loading states with a fallback array []
  // 2. Use categoryFilter (the prop) instead of local 'active' state
// 1. Safe fallback to an empty array if data or data.products doesn't exist yet
const productList = data?.products || data?.data || []; 

// 2. Now filter the actual array safely
const visible =
  categoryFilter === "All"
    ? productList
    : productList.filter((p) => p.category === categoryFilter);

  // Show a loading state instead of crashing/showing empty table
  if (isLoading) {
    return <div className="p-4 text-center">Loading inventory...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading data.</div>;
  }

  return (
    <div>
      <>
        <h1 className="ad-page-title">Inventory</h1>
        <p className="ad-page-sub">
          Add, update, and track stock across the catalog.
        </p>

        <div className="ad-toolbar">
          <div className="ad-toolbar-left">
            <select
              className="ad-filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All categories</option>
              {CATEGORIES?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setView("inventory")}
            className={`ad-add-btn `}
          >
            + Add product
          </button>
        </div>

        <div className="ad-panel">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr className="ad-empty-row">
                  <td colSpan={7}>No products match your search.</td>
                </tr>
              ) : (
                visible.map((p) => (
                  <tr key={p.id || p.sku}>
                    <td>{p.name}</td>
                    <td className="ad-mono">{p.sku}</td>
                    <td>{p.category}</td>
                    <td className="ad-mono">₹{money ? money(p.pricing.totalPrice) : p.pricing.totalPrice}</td>
                    <td>
                      <div className="ad-qty-cell">
                        <button
                          className="ad-qty-btn"
                          onClick={() => adjustStock && adjustStock(p.id, -1)}
                          aria-label="Decrease stock"
                        >
                          −
                        </button>
                        <span className="ad-qty-val">{p.stock}</span>
                        <button
                          className="ad-qty-btn"
                          onClick={() => adjustStock && adjustStock(p.id, 1)}
                          aria-label="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`ad-badge ${stockStatus ? stockStatus(p) : ""}`}>
                        {stockStatus && stockStatus(p) === "ok"
                          ? "In stock"
                          : stockStatus && stockStatus(p) === "low"
                            ? "Low"
                            : "Out"}
                      </span>
                    </td>
                    <td>
                      <div className="ad-row-actions">
                        <button
                          className="ad-icon-btn"
                          onClick={() => openEditModal(p)}
                          aria-label="Edit product"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13">
                            <path
                              d="M8.5 1.5L11.5 4.5L4 12H1V9L8.5 1.5Z"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                        </button>
                        <button
                          className="ad-icon-btn danger"
                          onClick={() => confirmDelete(p.id)}
                          aria-label="Delete product"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13">
                            <path
                              d="M2 3.5H11M5 3.5V2H8V3.5M3.5 3.5L4 11H9L9.5 3.5"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
}