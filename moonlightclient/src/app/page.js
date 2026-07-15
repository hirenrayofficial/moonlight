"use client"
import React, { useEffect } from 'react'
import Hero from './home/Hero'


export default function page() {
    useEffect(() => {
    fetch('/api/home/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname }),
    });
  }, []);
  return (
    <div>
      <Hero/>

    </div>
  )
}
