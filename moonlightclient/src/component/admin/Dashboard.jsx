"use client"
import { AccesLogs } from "@/services/admin/stats/statsApi";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "ray-date-time-format";
import React, { useMemo } from "react";

export default function Dashboard({products,stockStatus,money,RECENT_ORDERS}) {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => stockStatus(p) === "low").length;
    const outOfStock = products.filter((p) => stockStatus(p) === "out").length;
    const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { totalProducts, lowStock, outOfStock, stockValue };
  }, [products]);

    const {data,isLoading,error}=useQuery({
    queryKey: "dt",
    queryFn: AccesLogs
  })
  // console.log(data)


  return (
    <div>
      <>


        <div className="ad-stats bg-transparent">
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Total Views</div>
            <div className="ad-stat-value ad-mono">{data?.total}</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Total stock</div>
            <div
              className={`ad-stat-value ad-mono ${data?.ptotal > 0 ? "warn" : ""}`}
            >
              {data?.ptotal}
            </div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Notification</div>
            <div
              className={`ad-stat-value ad-mono ${data?.ntotal > 0 ? "danger" : ""}`}
            >
              {data?.ntotal}
            </div>
          </div>
          {/* <div className="ad-stat">
            <div className="ad-stat-label ad-mono">Stock value</div>
            <div className="ad-stat-value ad-mono">
              ${money(stats.stockValue)}
            </div>
          </div> */}
        </div>

        <div className="ad-dash-grid">
          <div className="ad-panel">
            <div className="ad-panel-head ad-mono">Recent Visit</div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Os</th>
                  <th>Browser</th>
                  {/* <th>Device</th> */}
                  <th>Event</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.dt.map((o) => (
                  <tr key={o._id}>
                    <td className="ad-mono">{o.os}</td>
                    <td className="ad-mono">{o.browser}</td>
                    {/* <td>{o.userAgent}</td> */}
                    <td className="ad-mono">${o.event}</td>
                    <td>
                      <span className={`ad-badge ${o.createdAt}`}>{formatDate(o.createdAt, "dd/mm/yyyy")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="ad-panel">
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
          </div> */}
        </div>
      </>
    </div>
  );
}
