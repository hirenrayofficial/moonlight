"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DeviceInfo from '@/component/admin/currentDeviceacces/CurrentDevice';

export default function AdminDevicesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/adminAutorizetion');
        const data = await res.json();
        if (!res.ok || !data?.isAuthenticated) {
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

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authorization…</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div>
      <DeviceInfo />
    </div>
  );
}
