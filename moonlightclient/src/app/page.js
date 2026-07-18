"use client"
import React, { useEffect, useState } from 'react'
import Hero from './home/Hero'


export default function page() {
  const [csrfToken, setCsrfToken] = useState(null);
  const [formRenderedAt, setFormRenderedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/home/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname }),
    });
  }, []);
  useEffect(() => {
    fetch("/api/getway/session/init")
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
        setFormRenderedAt(data.formRenderedAt);
      })
      .catch(() =>
        setError("Could not start a secure session. Please refresh the page."),
      )
      .finally();
  }, []);
  return (
    <div>
      <Hero />

    </div>
  )
}
