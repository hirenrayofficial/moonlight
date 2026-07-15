"use client"
import AdminDashboard from '@/component/admin/DashboardLayout';

import React, { useEffect } from 'react'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function page() {


    useEffect(() => {
    async function subscribe() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

      const reg = await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BALi_sJ5bAV8rAXH1OAg8LN68D5t4FWs9jO2r8StLpGJGKcMGC4-7QI2PONkWgOuxs-wWfzTG60nTgbriRWTEd4"
        ),
      });

      await fetch('/api/admin/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
    }
    subscribe();
  }, []);

  return (
    <div>
      {/* <ProductAdmin /> */}
      <AdminDashboard/>
    </div>
  );
}
