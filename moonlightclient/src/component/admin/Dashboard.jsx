"use client"
import React, { useMemo } from "react";

export default function Dashboard({products,stockStatus,money,RECENT_ORDERS}) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => stockStatus(p) === "low").length;
    const outOfStock = products.filter((p) => stockStatus(p) === "out").length;
    const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { totalProducts, lowStock, outOfStock, stockValue };
  }, [products]);
  return (
    <div>
      <>
        <h1 className="ad-page-title">Dashboard</h1>
        <p className="ad-page-sub">
          Live snapshot of inventory and today's orders.
        </p>

        <div className="ad-stats">
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Total products</div>
            <div className="ad-stat-value ad-mono">{stats.totalProducts}</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Low stock</div>
            <div
              className={`ad-stat-value ad-mono ${stats.lowStock > 0 ? "warn" : ""}`}
            >
              {stats.lowStock}
            </div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Out of stock</div>
            <div
              className={`ad-stat-value ad-mono ${stats.outOfStock > 0 ? "danger" : ""}`}
            >
              {stats.outOfStock}
            </div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Stock value</div>
            <div className="ad-stat-value ad-mono">
              ${money(stats.stockValue)}
            </div>
          </div>
        </div>

        <div className="ad-dash-grid">
          <div className="ad-panel">
            <div className="ad-panel-head ad-mono">Recent orders</div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td className="ad-mono">{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="ad-mono">${money(o.total)}</td>
                    <td>
                      <span className={`ad-badge ${o.status}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ad-panel">
            <div className="ad-panel-head ad-mono">Needs attention</div>
            <div className="ad-low-list">
              {products.filter((p) => stockStatus(p) !== "ok").length === 0 ? (
                <div className="ad-notif-empty">
                  All products are well stocked.
                </div>
              ) : (
                products
                  .filter((p) => stockStatus(p) !== "ok")
                  .map((p) => (
                    <div className="ad-low-row" key={p.id}>
                      <span className="ad-low-name">{p.name}</span>
                      <span className={`ad-badge ${stockStatus(p)}`}>
                        {p.stock} left
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
