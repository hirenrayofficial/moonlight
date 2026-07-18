"use client";
import React, { useMemo, useState } from "react";
import "./notifi.scss";
import { useQuery } from "@tanstack/react-query";
import {
  getNotification,
  deleteFucntion,
} from "@/services/admin/apiService/Notification";
import { markAllRead } from "@/services/admin/apiService/Notification";

/**
 * STOCKROOM ADMIN — notifications page
 * Same dark control-panel system as the dashboard/login. Filterable,
 * markable, deletable — not just a static list.
 */

const FILTERS = ["All", "Unread", ];

const TYPE_META = {
  "low-stock": { label: "Low stock", filter: "Low stock" },
  "out-of-stock": { label: "Out of stock", filter: "Low stock" },
  order: { label: "Order", filter: "Orders" },
  system: { label: "System", filter: "System" },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "low-stock",
    message: "Canvas work apron is running low (14 left).",
    time: "9:41 AM",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    type: "order",
    message: "New order #08221 placed by R. Okafor — $76.00.",
    time: "9:12 AM",
    date: "Today",
    read: false,
  },
  {
    id: 3,
    type: "out-of-stock",
    message: "Work boots, steel toe is now out of stock.",
    time: "8:55 AM",
    date: "Today",
    read: false,
  },
  {
    id: 4,
    type: "system",
    message: "Added Waxed canvas tool roll to inventory.",
    time: "8:30 AM",
    date: "Today",
    read: true,
  },
  {
    id: 5,
    type: "order",
    message: "Order #08220 marked as shipped.",
    time: "6:02 PM",
    date: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "low-stock",
    message: "Waxed canvas tool roll is running low (6 left).",
    time: "4:47 PM",
    date: "Yesterday",
    read: true,
  },
  {
    id: 7,
    type: "system",
    message: "Price updated for Cast-iron skillet, 10in.",
    time: "2:15 PM",
    date: "Yesterday",
    read: true,
  },
  {
    id: 8,
    type: "order",
    message: "New order #08217 placed by D. Novak — $118.00.",
    time: "11:30 AM",
    date: "Yesterday",
    read: true,
  },
  {
    id: 9,
    type: "system",
    message: "Dashboard initialized.",
    time: "8:00 AM",
    date: "2 days ago",
    read: true,
  },
];

function typeDotClass(type) {
  if (type === "low-stock") return "warn";
  if (type === "out-of-stock") return "danger";
  if (type === "order") return "accent";
  return "faint";
}

export default function Notification() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => !n.read);
    return notifications.filter(
      (n) => TYPE_META[n.type]?.filter === activeFilter,
    );
  }, [notifications, activeFilter]);

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function remove(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function clearAll() {
    setNotifications([]);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotification,
  });
  if (isLoading) {
    return <div>Loading notifications...</div>;
  }
  if (error) {
    console.error("Error fetching notifications:", error);
  } else if (data) {
    console.log("Fetched notifications:", data);
  }

  const unreadNotifications = data.filter((n) => !n.read);

  const undreadHandelclick = () => {
    if (unreadNotifications.length > 0) {
      markAllRead()
        .then(() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        })
        .catch((err) => {
          console.error("Error marking all as read:", err);
        });
    }
  };

  const handelDelete = (options,id, ) => {
    deleteFucntion(id, options);
  };

  return (
    <div className="nt-page">
      <div className="nt-inner">
        <div className="nt-head">
          <div className="nt-head-row">
            <div className="nt-title-wrap">
              <h1 className="nt-title">Notifications</h1>
              {data.length > 0 && (
                <span className="nt-unread-badge nt-mono">
                  {unreadNotifications.length} new
                </span>
              )}
            </div>
            <div className="nt-head-actions">
              <button
                className="nt-action-btn"
                onClick={undreadHandelclick}
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
              <button
                className="nt-action-btn danger"
                onClick={() => handelDelete(null, "all")}
                disabled={notifications.length === 0}
              >
                Clear all
              </button>
            </div>
          </div>

          <div
            className="nt-tabs"
            role="tablist"
            aria-label="Filter notifications"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                className={`nt-tab ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="nt-empty">
            <div className="nt-empty-title nt-mono">Nothing here</div>
            <div className="nt-empty-sub">
              {data.length === 0
                ? "You're fully caught up."
                : "No notifications match this filter."}
            </div>
          </div>
        ) : (
          <div className="nt-list">
            {data.map((n) => (
              <div className={`nt-item ${n.read ? "" : "unread"}`} key={n.id}>
                <span className={`nt-dot ${typeDotClass(n.type)}`} />
                <div className="nt-item-body">
                  <div className="nt-item-type nt-mono">{n.title}</div>
                  <div className="nt-item-message">{n.body}</div>
                  <div className="nt-item-meta nt-mono">
                    {n.createdAt} · {n.time}
                  </div>
                </div>
                <div className="nt-item-actions">
                  {!n.read && (
                    <button
                      className="nt-icon-btn"
                      onClick={() => markRead(n.id)}
                      aria-label="Mark as read"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          fill="none"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className="nt-icon-btn danger"
                    onClick={() => handelDelete({ id: n._id }, "single")}
                    aria-label="Delete notification"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 3H10M4.5 3V1.8H7.5V3M3 3L3.5 10H8.5L9 3"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
