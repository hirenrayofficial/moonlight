"use client";
import React, { useState } from "react";
import "./contact.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

/**
 * MOONLIGHT MACHINERY — contact page
 * Same paper/ink/accent system as the rest of the site. Leads with the
 * Call/WhatsApp pattern already used on the product page, since that's
 * how most machinery enquiries actually happen, then a fuller form
 * underneath for people who'd rather write everything out at once.
 */

const MACHINE_INTEREST = [
    "Paper Plate Making Machine",
    "Lamination Machine",
    "Cotton Wick Machine",
    "Paper Cup Machine",
    "Not sure yet",
];

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 8178445596";
const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+918178445596";

function useContactForm() {
    const [values, setValues] = useState({
        name: "",
        phone: "",
        email: "",
        machine: MACHINE_INTEREST[0],
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | submitting | submitted | error

    function update(field, value) {
        setValues((v) => ({ ...v, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!values.name.trim() || !values.phone.trim()) return;

        setStatus("submitting");
        try {
            const response = await axios.post("/api/home/enquery", values);
            if (response.data.success) {
                setStatus("submitted");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            setStatus("error");
        }
    }

    return { values, update, status, handleSubmit };
}

export default function Contact() {
    const { values, update, status, handleSubmit } = useContactForm();
    const pathname = usePathname();
    const segments = pathname.split("/").filter((s) => s !== "");

    function callNow() {
        window.location.href = `tel:${BUSINESS_PHONE}`;
    }

    function openWhatsApp() {
        const message = "Hi, I'd like to enquire about your machines.";
        const url = `https://wa.me/${WHATSAPP_PHONE.replace(/[^\d+]/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    }

    return (
        <div className="ct-root py-24 w-full max-w-[1200px] mx-auto">
            {/* <div className="ct-crumb ct-mono flex hidden md:flex">
        <Link href="/">Home</Link>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          return (
            <div key={href} className="flex gap-2">
              <span>/</span>
              <Link href={href} className="capitalize text-gray-500">
                {segment.replace(/-/g, " ")}
              </Link>
            </div>
          );
        })}
      </div> */}

            <div className="ct-head">
                <div className="ct-eyebrow ct-mono">Contact</div>
                <h1 className="ct-title">Talk to us about your machine</h1>
                <p className="ct-subhead">
                    Call, message us on WhatsApp, or send the form below — whichever's
                    fastest for you. We reply to enquiries the same business day.
                </p>

                <div className="ct-quick-row">
                    <button className="ct-quick-btn" onClick={callNow}>
                        ☎️ Call now
                    </button>
                    <button className="ct-quick-btn whatsapp" onClick={openWhatsApp}>
                        💬 WhatsApp us
                    </button>
                </div>
            </div>

            <div className="ct-layout">
                <div className="ct-form-col">
                    {status === "submitted" ? (
                        <div className="ct-success">
                            <span className="ct-success-title ct-mono">Enquiry received.</span>
                            <p className="ct-success-desc">
                                Thanks, {values.name || "there"} — we'll call or WhatsApp you at{" "}
                                {values.phone} shortly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="ct-row2">
                                <div className="ct-field">
                                    <label className="ct-label ct-mono" htmlFor="ct-name">Name</label>
                                    <input
                                        id="ct-name"
                                        className="ct-input"
                                        type="text"
                                        required
                                        placeholder="Your name"
                                        value={values.name}
                                        onChange={(e) => update("name", e.target.value)}
                                    />
                                </div>
                                <div className="ct-field">
                                    <label className="ct-label ct-mono" htmlFor="ct-phone">Phone</label>
                                    <input
                                        id="ct-phone"
                                        className="ct-input"
                                        type="tel"
                                        required
                                        placeholder="+91 00000 00000"
                                        value={values.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="ct-row2">
                                <div className="ct-field">
                                    <label className="ct-label ct-mono" htmlFor="ct-email">Email (optional)</label>
                                    <input
                                        id="ct-email"
                                        className="ct-input"
                                        type="email"
                                        placeholder="you@email.com"
                                        value={values.email}
                                        onChange={(e) => update("email", e.target.value)}
                                    />
                                </div>
                                <div className="ct-field">
                                    <label className="ct-label ct-mono" htmlFor="ct-machine">Machine of interest</label>
                                    <select
                                        id="ct-machine"
                                        className="ct-select"
                                        value={values.machine}
                                        onChange={(e) => update("machine", e.target.value)}
                                    >
                                        {MACHINE_INTEREST.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="ct-field">
                                <label className="ct-label ct-mono" htmlFor="ct-message">Message</label>
                                <textarea
                                    id="ct-message"
                                    className="ct-textarea"
                                    placeholder="Production capacity you need, budget, timeline — anything that helps us recommend the right machine."
                                    value={values.message}
                                    onChange={(e) => update("message", e.target.value)}
                                />
                            </div>

                            {status === "error" && (
                                <p className="ct-error ct-mono">Something went wrong — please call or WhatsApp us instead.</p>
                            )}

                            <button className="ct-submit-btn" type="submit" disabled={status === "submitting"}>
                                {status === "submitting" ? "Sending…" : "Send enquiry"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="ct-panel-col">
                    <div className="ct-panel-title ct-mono">Direct lines</div>
                    <div className="ct-manifest">
                        <div className="ct-manifest-row">
                            <span className="ct-manifest-label ct-mono">Sales</span>
                            <span className="ct-manifest-value">{BUSINESS_PHONE},+91 9354327757, +91 9883500259, +91 9907330121</span>
                        </div>
                        <div className="ct-manifest-row">
                            <span className="ct-manifest-label ct-mono">WhatsApp</span>
                            <span className="ct-manifest-value">{WHATSAPP_PHONE}</span>
                        </div>
                        <div className="ct-manifest-row">
                            <span className="ct-manifest-label ct-mono">Email</span>
                            <span className="ct-manifest-value">sales@moonlightmachinery.com</span>
                        </div>
                        <div className="ct-manifest-row">
                            <span className="ct-manifest-label ct-mono">Hours</span>
                            <span className="ct-manifest-value">Mon–Sat, 9am–7pm IST</span>
                        </div>
                    </div>

                    <div className="ct-faq-title">Before you call</div>
                    <a className="ct-faq-link" href="#">Do you offer installation & training?</a>
                    <a className="ct-faq-link" href="#">What's the warranty on machines?</a>
                    <a className="ct-faq-link" href="#">Do you ship pan-India?</a>
                    <a className="ct-faq-link" href="#">Can I see a live demo first?</a>
                </div>
            </div>
        </div>
    );
}