"use client"
import AdminDashboard from '@/component/admin/DashboardLayout';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function page() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/adminAutorizetion');
        if (!res.ok) {
          router.replace('/getway');
          return;
        }

        const data = await res.json();
        if (!data?.isAuthenticated) {
          router.replace('/getway');
          return;
        }

        setAuthorized(true);
      } catch (err) {
        router.replace('/getway');
      } finally {
        setAuthChecked(true);
      }
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

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
  }, [authorized]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authorization…</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
