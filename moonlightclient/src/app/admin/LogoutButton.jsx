'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/getway');
  }

  return (
    <button
      onClick={handleLogout}
      style={{ padding: '.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}
    >
      Log out
    </button>
  );
}
