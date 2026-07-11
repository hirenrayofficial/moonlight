// "use client"
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import { getDb } from '@/lib/mongodb';
import LogoutButton from './LogoutButton';

const IDLE_TIMEOUT_MS = 1 * 60 * 1000; // 20 minutes of inactivity

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  const lastActivity = session.lastActivity || session.loginAt;
  if (lastActivity && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
    session.destroy();
    redirect('/login');
  }

//   session.lastActivity = Date.now();
//   await session.save();

//   const db = await connect();
//   const logs = await db
//     .collection('accessLogs')
//     .find({})
//     .sort({ createdAt: -1 })
//     .limit(25)
//     .toArray();

//   const devices = await db
//     .collection('trustedDevices')
//     .find({ userId: session.userId })
//     .sort({ lastSeen: -1 })
//     .toArray();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem', background: '#f8fafc' }}>
      <h1>Welcome, {session.username}</h1>

      {session.newDeviceFlag && (
        <div style={{ background: '#fef3c7', padding: '.75rem 1rem', borderRadius: 6, marginBottom: '1rem' }}>
          ⚠️ This is a new device/IP for your account. If this wasn&apos;t you, change your password immediately.
        </div>
      )}

      <LogoutButton />

      <h2>Your Known Devices</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Fingerprint</th>
            <th style={thStyle}>IP</th>
            <th style={thStyle}>First Seen</th>
            <th style={thStyle}>Last Seen</th>
            <th style={thStyle}>Trusted</th>
          </tr>
        </thead>
        {/* <tbody>
          {devices.map((d) => (
            <tr key={d._id.toString()}>
              <td style={tdStyle}>{d.deviceFingerprint.slice(0, 12)}...</td>
              <td style={tdStyle}>{d.ipAddress}</td>
              <td style={tdStyle}>{new Date(d.firstSeen).toLocaleString()}</td>
              <td style={tdStyle}>{new Date(d.lastSeen).toLocaleString()}</td>
              <td style={tdStyle}>{d.isTrusted ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody> */}
      </table>

      <h2>Recent Access Log (last 25)</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>IP</th>
            <th style={thStyle}>Browser / OS</th>
            <th style={thStyle}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {/* {logs.map((l) => (
            <tr key={l._id.toString()}>
              <td style={tdStyle}>{new Date(l.createdAt).toLocaleString()}</td>
              <td style={tdStyle}>{l.event}</td>
              <td style={tdStyle}>{l.usernameAttempted || ''}</td>
              <td style={tdStyle}>{l.ipAddress}</td>
              <td style={tdStyle}>{l.browser} / {l.os}</td>
              <td style={tdStyle}>{l.reason || ''}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = { borderCollapse: 'collapse', width: '100%', marginBottom: '2rem', background: '#fff' };
const thStyle = { border: '1px solid #e2e8f0', padding: '.5rem .75rem', fontSize: '.85rem', textAlign: 'left', background: '#0f172a', color: '#fff' };
const tdStyle = { border: '1px solid #e2e8f0', padding: '.5rem .75rem', fontSize: '.85rem', textAlign: 'left' };