"use client"
import Image from "next/image";
import React, { useState } from "react";
import './footer.scss'
/**
 * STOCKROOM — footer
 * Same system as the rest: hairline rules, mono labels, sharp corners.
 * Signature bit: a warehouse "manifest" line (address, hours, next
 * dispatch) instead of a generic newsletter teaser.
 */

const LINK_COLUMNS = [
  {
    title: "Catalog",
    links: ["Manually", "Automatic", "Accessories", "All products"],
  },
  {
    title: "Company",
    links: ["About", "Warehouse tour", "Careers", "Wholesale"],
  },
  {
    title: "Support",
    links: ["Shipping", "Returns", "Track an order", "Contact"],
  },
];

const SOCIALS = ["Instagram", "X", "YouTube"];

function useSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitted

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  return { email, setEmail, status, handleSubmit };
}

export default function Footer() {
  const { email, setEmail, status, handleSubmit } = useSubscribe();
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root">


      <div className="ft-inner">
        <div className="ft-manifest">
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Warehouse</div>
            <div className="ft-manifest-value">Plot -13,Ram Vihar,Dhanwapur Road,Sector-104,Gurgaon-12201</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Hours</div>
            <div className="ft-manifest-value">Mon–Fri, 24hrs</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Next dispatch</div>
            <div className="ft-manifest-value">Today, 3:00pm ET</div>
          </div>
          <div className="ft-manifest-cell">
            <div className="ft-manifest-label ft-mono">Support</div>
            <div className="ft-manifest-value">help@moonlightmachinery.com</div>
          </div>
        </div>

        <div className="ft-grid">
          <div className="ft-brand-col">
            <div className="ft-brand">
              <div className="ft-brand-mark"><Image width={200} height={200} alt="Moonlight Machinery" src="/logo.png" /></div>
              <span className="ft-brand-name">MoonLight Machinery</span>
            </div>
            <p className="ft-tagline">
              100% Natural Areca Leaf Plates Crafted from fallen leaves, these plates are naturally elegant, heat-resistant, and entirely compostable.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div className="ft-sub-col" key={col.title}>
              <div className="ft-col-title ft-mono">{col.title}</div>
              <div className="ft-col-links">
                {col.links.map((l) => (
                  <a className="ft-col-link" href="#" key={l}>{l}</a>
                ))}
              </div>
            </div>
          ))}

          <div className="ft-sub-col">
            <div className="ft-col-title ft-mono">Moonlight alerts</div>
            <p className="ft-sub-desc">
              One email when a sold-out item is back. Nothing else.
            </p>
            {status === "submitted" ? (
              <p className="ft-sub-success ft-mono">You're on the list.</p>
            ) : (
              <form className="ft-sub-form" onSubmit={handleSubmit}>
                <input
                  className="ft-sub-input"
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button className="ft-sub-btn" type="submit">Notify me</button>
              </form>
            )}
            <p className="ft-sub-note ft-mono">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="ft-bottom">
          <a href="iam.hirenray.rest" className="ft-copyright ft-mono cursor-pointer">© {year} Rtech Agency.</a>
          <div className="ft-bottom-links">
            {SOCIALS.map((s) => (
              <a className="ft-bottom-link ft-mono" href="#" key={s}>{s}</a>
            ))}
            <a className="ft-bottom-link ft-mono" href="#">Privacy</a>
            <a className="ft-bottom-link ft-mono" href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}