"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./admindash.scss";
import Dashboard from "./Dashboard";
import DeviceInfo from "./currentDeviceacces/CurrentDevice";
import ProductAdmin, { SearchBox } from "./product/ProductAdmin";
import Notification from "@/component/admin/notification/Notification";


/**
 * STOCKROOM ADMIN — dashboard
 * Dark control-panel system (matches AdminLogin). Real state, not a
 * static mockup: add/edit/delete products, quick stock +/-, search,
 * and notifications that actually generate from inventory changes.
 */

const CATEGORIES = ["All", "Manually", "Automatic"];

const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Cast-iron skillet, 10in",
    sku: "SR-0142",
    category: "Kitchen",
    price: 34.0,
    stock: 86,
    threshold: 20,
  },
  {
    id: "p2",
    name: "Canvas work apron",
    sku: "SR-0201",
    category: "Workwear",
    price: 42.0,
    stock: 14,
    threshold: 20,
  },
  {
    id: "p3",
    name: "Stainless prep bowls, set/3",
    sku: "SR-0118",
    category: "Kitchen",
    price: 28.0,
    stock: 54,
    threshold: 15,
  },
  {
    id: "p4",
    name: "Waxed canvas tool roll",
    sku: "SR-0330",
    category: "Tools",
    price: 56.0,
    stock: 6,
    threshold: 15,
  },
  {
    id: "p5",
    name: "Work boots, steel toe",
    sku: "SR-0287",
    category: "Workwear",
    price: 118.0,
    stock: 0,
    threshold: 10,
  },
  {
    id: "p6",
    name: "Hex key set, 9-piece",
    sku: "SR-0075",
    category: "Tools",
    price: 19.0,
    stock: 132,
    threshold: 25,
  },
];

const RECENT_ORDERS = [
  { id: "#08221", customer: "R. Okafor", total: 76.0, status: "Packed" },
  { id: "#08220", customer: "M. Alvarez", total: 42.0, status: "Shipped" },
  { id: "#08219", customer: "T. Whitfield", total: 118.0, status: "Pending" },
  { id: "#08218", customer: "S. Kapoor", total: 64.0, status: "Shipped" },
];

function money(n) {
  // If n is undefined, null, or not a number, fallback to 0
  const priceAsNumber = Number(n) || 0;

  return priceAsNumber.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function stockStatus(p) {
  if (p.stock <= 0) return "out";
  if (p.stock <= p.threshold) return "low";
  return "ok";
}

function timeNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let notifId = 100;
function makeNotif(type, message) {
  notifId += 1;
  return { id: notifId, type, message, time: timeNow(), read: false };
}

const emptyDraft = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  price: "",
  stock: "",
  threshold: "10",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState("dashboard"); // dashboard | inventory
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [notifications, setNotifications] = useState([
    makeNotif("system", "Dashboard initialized."),
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menusOpen, setMenusOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function pushNotif(type, message) {
    setNotifications((prev) =>
      [makeNotif(type, message), ...prev].slice(0, 30),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, categoryFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => stockStatus(p) === "low").length;
    const outOfStock = products.filter((p) => stockStatus(p) === "out").length;
    const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { totalProducts, lowStock, outOfStock, stockValue };
  }, [products]);

  function openAddModal() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEditModal(p) {
    setEditingId(p.id);
    setDraft({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      threshold: String(p.threshold),
    });
    setModalOpen(true);
  }

  // function closeModal() {
  //   setModalOpen(false);
  //   setEditingId(null);
  //   setDraft(emptyDraft);
  // }

  function saveDraft(e) {
    e.preventDefault();
    const parsed = {
      name: draft.name.trim(),
      sku: draft.sku.trim() || `SR-${Math.floor(1000 + Math.random() * 9000)}`,
      category: draft.category,
      price: parseFloat(draft.price) || 0,
      stock: parseInt(draft.stock, 10) || 0,
      threshold: parseInt(draft.threshold, 10) || 10,
    };
    if (!parsed.name) return;

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== editingId) return p;
          const updated = { ...p, ...parsed };
          if (stockStatus(updated) === "low" && stockStatus(p) !== "low") {
            pushNotif(
              "low-stock",
              `${updated.name} is running low (${updated.stock} left).`,
            );
          }
          if (stockStatus(updated) === "out" && stockStatus(p) !== "out") {
            pushNotif("out-of-stock", `${updated.name} is now out of stock.`);
          }
          return updated;
        }),
      );
      pushNotif("system", `Updated ${parsed.name}.`);
    } else {
      const newProduct = { id: `p${Date.now()}`, ...parsed };
      setProducts((prev) => [newProduct, ...prev]);
      pushNotif("system", `Added ${parsed.name} to inventory.`);
      if (stockStatus(newProduct) === "low") {
        pushNotif(
          "low-stock",
          `${newProduct.name} started below its stock threshold.`,
        );
      }
    }
    // closeModal();
  }

  function adjustStock(id, delta) {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStock = Math.max(0, p.stock + delta);
        const updated = { ...p, stock: newStock };
        if (stockStatus(updated) === "low" && stockStatus(p) === "ok") {
          pushNotif(
            "low-stock",
            `${updated.name} is running low (${newStock} left).`,
          );
        }
        if (stockStatus(updated) === "out" && stockStatus(p) !== "out") {
          pushNotif("out-of-stock", `${updated.name} is now out of stock.`);
        }
        return updated;
      }),
    );
  }

  function confirmDelete(id) {
    setConfirmDeleteId(id);
  }

  function performDelete() {
    const p = products.find((pr) => pr.id === confirmDeleteId);
    setProducts((prev) => prev.filter((pr) => pr.id !== confirmDeleteId));
    if (p) pushNotif("system", `Removed ${p.name} from inventory.`);
    setConfirmDeleteId(null);
  }


  return (
    <div className="ad-root">
      {/* ---------- sidebar ---------- */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-brand-mark ">M</div>
          <span className="ad-brand-name hidden md:flex">MoonlightPanel</span>
        </div>
        <nav className="ad-nav">
          <button
            className={`ad-nav-item ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`ad-nav-item ${view === "products" ? "active" : ""}`}
            onClick={() => setView("products")}
          >
            Products
          </button>
          <button
            className={`ad-nav-item ${view === "notification" ? "active" : ""}`}
            onClick={() => setView("notification")}
          >
            Notification
          </button>
          <button
            className={`ad-nav-item ${view === "device" ? "active" : ""}`}
            onClick={() => setView("device")}
          >
            Device Info
          </button>

        </nav>
        <div className="ad-sidebar-foot ad-mono">v1.0 · admin</div>
      </aside>

      {/* ---------- main ---------- */}
      <div className="ad-main">
        <div className="ad-topbar">
          {/* <SearchBox searchQuery={query} setSearchQuery={setQuery} /> */}
          <div>
                              <h1 className="ad-page-title">Dashboard</h1>
        <p className="ad-page-sub">
          Live snapshot of inventory and today's orders.
        </p>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-user" onClick={(e) => setMenusOpen((o) => !o)}>
              <div className="ad-avatar ad-mono">AD</div>
              <span className="ad-user-name">Admin</span>
              {menusOpen && (
                <div className="ad-notif-panel w-full max-w-[200px] mt-7">
                  <div className="ad-notif-head">
                    <span className="ad-notif-title ad-mono">Menus</span>
                  </div>
                  <div className="ad-notif-list">
                    {notifications.length === 0 ? (
                      <div className="ad-notif-empty">
                        You're all caught up.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          className={`ad-notif-item ${n.read ? "" : "unread"}`}
                          key={n.id}
                        >
                          <span className={`ad-notif-dot ${n.type}`} />
                          <div>
                            <div className="ad-notif-text">{n.message}</div>
                            <div className="ad-notif-time ad-mono">
                              {n.time}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ad-content">
          {view === "dashboard" && (
            <Dashboard
              products={products}
              stockStatus={stockStatus}
              money={money}
            />
          )}
          {view === "products" && <ProductAdmin compact />}
          {view === "notification" && <Notification  />}
          {view === "device" && <DeviceInfo  />}
        </div>
      </div>

      {/* ---------- delete confirm ---------- */}
      {confirmDeleteId && (
        <div className="ad-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <span className="ad-modal-title">Remove product?</span>
              <button
                className="ad-modal-close"
                onClick={() => setConfirmDeleteId(null)}
              >
                ✕
              </button>
            </div>
            <div className="ad-modal-body">
              <p className="ad-confirm-text">
                This removes{" "}
                {products.find((p) => p.id === confirmDeleteId)?.name} from the
                catalog. This can't be undone here.
              </p>
              <div className="ad-modal-actions">
                <button
                  className="ad-btn-secondary"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="ad-btn-primary"
                  style={{
                    background: "var(--danger)",
                    borderColor: "var(--danger)",
                    color: "#fff",
                  }}
                  onClick={performDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
