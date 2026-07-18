"use client";
import React, { useEffect, useState } from "react";
import "./device-info.scss";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DeviceInfo() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch("/api/admin/devices");
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || "Could not load device list.");
        }
        const json = await res.json();
        setDevices(json.devices || []);
      } catch (err) {
        setError(err.message || "Failed to load device list.");
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  return (
    <div className="di-page">
      <div className="di-inner">
        <div className="di-head">
          <h1 className="di-title">Current Access Devices</h1>
          <p className="di-sub">See all devices that have logged in with this admin account.</p>
        </div>

        {loading ? (
          <div className="di-grid">
            <div className="di-card">Loading devices…</div>
          </div>
        ) : error ? (
          <div className="di-grid">
            <div className="di-card">Error: {error}</div>
          </div>
        ) : devices.length === 0 ? (
          <div className="di-grid">
            <div className="di-card">No devices found for this admin.</div>
          </div>
        ) : (
          <div className="di-grid">
            {devices.map((device, index) => (
              <div className="di-card" key={device._id || index}>
                <div className="di-label nt-mono">Browser</div>
                <div className="di-value">{device.browser}</div>
                <div className="di-label nt-mono">Operating System</div>
                <div className="di-value">{device.os}</div>
                <div className="di-label nt-mono">Device Type</div>
                <div className="di-value">{device.deviceType || "Unknown"}</div>
                <div className="di-label nt-mono">IP Address</div>
                <div className="di-value">{device.ipAddress}</div>
                <div className="di-label nt-mono">First Seen</div>
                <div className="di-value">{formatDate(device.firstSeen)}</div>
                <div className="di-label nt-mono">Last Seen</div>
                <div className="di-value">{formatDate(device.lastSeen)}</div>
                <div className="di-label nt-mono">Trusted</div>
                <div className={`di-value ${device.isTrusted ? "active" : ""}`}>
                  {device.isTrusted ? "Yes" : "No"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// export default function DeviceInfo() {
//   return (
//     <div className="di-page">
//       <div className="di-inner">
//         <div className="di-head">
//           <h1 className="di-title">Device Information</h1>
//           <p className="di-sub">System diagnostic and hardware details.</p>
//         </div>

//         <div className="di-grid">
//           {DEVICE_DATA.map((item, idx) => (
//             <div className="di-card" key={idx}>
//               <div className="di-label nt-mono">{item.label}</div>
//               <div className={`di-value ${item.status || ""}`}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>

//         <button className="di-action-btn">Refresh Diagnostics</button>
//       </div>
//     </div>
//   );
// }