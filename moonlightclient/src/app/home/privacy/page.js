"use client";
import React, { useEffect, useRef, useState } from "react";
import './privacy.scss'
/**
 * STOCKROOM — privacy policy page
 * TEMPLATE ONLY. Every [bracketed] value and every section needs review
 * against what your site actually does before this goes live — this is
 * the layout/structure, not a substitute for legal advice.
 */

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "collect", label: "Information we collect" },
  { id: "use", label: "How we use it" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "sharing", label: "Sharing your information" },
  { id: "retention", label: "Data retention" },
  { id: "rights", label: "Your rights" },
  { id: "children", label: "Children's privacy" },
  { id: "security", label: "Data security" },
  { id: "transfers", label: "International transfers" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
];

export default function PrivacyPolicy() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pv-root">


      <div className="pv-head">
        <div className="pv-eyebrow pv-mono">Legal</div>
        <h1 className="pv-title">Privacy policy</h1>
        <p className="pv-updated pv-mono">Last updated: <span className="pv-placeholder">[Month DD, YYYY]</span></p>
      </div>

      <div className="pv-layout">
        <nav className="pv-toc" aria-label="Table of contents">
          <div className="pv-toc-title pv-mono">On this page</div>
          <div className="pv-toc-list">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`pv-toc-link ${activeId === s.id ? "active" : ""}`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="pv-content">
          <section className="pv-section" id="intro">
            <h2 className="pv-section-title">Introduction</h2>
            <p>
              <span className="pv-placeholder">Moonlight Machinery</span> ("we," "us," or "our") operates{" "}
              <span className="pv-placeholder">moonlightmachinery.com</span> (the "Site"). This policy explains
              what information we collect, why we collect it, and what choices you have. By using the
              Site, you agree to the collection and use of information as described here.
            </p>
            <p>
              This policy applies to visitors, registered users, and customers of the Site. It does not
              apply to third-party websites linked from our Site, which have their own privacy practices.
            </p>
          </section>

          <section className="pv-section" id="collect">
            <h2 className="pv-section-title">Information we collect</h2>
            <div className="pv-subhead">Information you give us</div>
            <ul>
              <li>Name, email address, phone number, and shipping/billing address</li>
              <li>Account credentials, if you create an account</li>
              {/* <li>Order and payment details (payment card data is processed by <span className="pv-placeholder">[payment processor name]</span>, not stored on our servers)</li> */}
              <li>Messages you send through contact forms, WhatsApp, or email</li>
            </ul>
            <div className="pv-subhead">Information collected automatically</div>
            <ul>
              <li>IP address, browser type, device type, and operating system</li>
              <li>Pages visited, time spent, and referring/exit pages</li>
              <li>Cookies and similar tracking technologies (see below)</li>
            </ul>
          </section>

          <section className="pv-section" id="use">
            <h2 className="pv-section-title">How we use it</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill orders, and communicate with you about them</li>
              <li>Respond to enquiries submitted via forms, phone, or WhatsApp</li>
              <li>Improve the Site, our products, and our customer service</li>
              <li>Send order updates and, where you've opted in, marketing communications</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="pv-section" id="cookies">
            <h2 className="pv-section-title">Cookies & tracking</h2>
            <p>
              We use cookies and similar technologies for essential site function, to remember your
              preferences, and — only with your consent — for analytics and marketing.
            </p>
            <table className="pv-table">
              <thead>
                <tr><th>Category</th><th>Purpose</th><th>Consent required</th></tr>
              </thead>
              <tbody>
                <tr><td>Necessary</td><td>Login, cart, security</td><td>No — always active</td></tr>
                <tr><td>Functional</td><td>Preferences, recently viewed</td><td>Yes</td></tr>
                <tr><td>Analytics</td><td>Understand site usage</td><td>Yes</td></tr>
                <tr><td>Marketing</td><td>Ad targeting, campaign measurement</td><td>Yes</td></tr>
              </tbody>
            </table>
            <div className="pv-cookie-note">
              <strong>Managing your preferences:</strong> you can change your cookie choices anytime via
              the "Cookie settings" control on the site, or by clearing cookies in your browser.
            </div>
          </section>

          <section className="pv-section" id="sharing">
            <h2 className="pv-section-title">Sharing your information</h2>
            <p>We do not sell your personal information. We share it only with:</p>
            <ul>
              {/* <li><strong>Service providers</strong> — payment processing (<span className="pv-placeholder">[processor]</span>), shipping/logistics (<span className="pv-placeholder">[carrier]</span>), hosting, and analytics providers, bound by contract to protect your data</li> */}
              <li><strong>Legal requirements</strong> — where required by law, court order, or to protect our rights and safety</li>
              <li><strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of assets, with notice to you</li>
            </ul>
          </section>

          <section className="pv-section" id="retention">
            <h2 className="pv-section-title">Data retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes described in
              this policy, including to satisfy legal, accounting, or reporting requirements. Order records
              are typically retained for <span className="pv-placeholder">[X years]</span>; account data is
              retained until you request deletion or close your account.
            </p>
          </section>

          <section className="pv-section" id="rights">
            <h2 className="pv-section-title">Your rights</h2>
            <p>Depending on where you live, you may have some or all of the following rights:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the personal information we hold about you</li>
              <li><strong>Correction</strong> — ask us to correct inaccurate or incomplete information</li>
              <li><strong>Deletion</strong> — request that we delete your personal information, subject to legal exceptions</li>
              <li><strong>Portability</strong> — request your data in a portable format</li>
              <li><strong>Objection / opt-out</strong> — object to processing, or opt out of marketing and (where applicable) sale/sharing of information</li>
              <li><strong>Withdraw consent</strong> — where processing is based on consent (e.g., marketing cookies), withdraw it at any time</li>
            </ul>
            <p>
              To exercise any of these rights, contact us using the details below. We may need to verify
              your identity before processing certain requests.
            </p>
          </section>

          <section className="pv-section" id="children">
            <h2 className="pv-section-title">Children's privacy</h2>
            <p>
              The Site is not directed at children under <span className="pv-placeholder">[13 / 16]</span>,
              and we do not knowingly collect personal information from children. If you believe a child has
              provided us with personal information, contact us and we will take steps to delete it.
            </p>
          </section>

          <section className="pv-section" id="security">
            <h2 className="pv-section-title">Data security</h2>
            <p>
              We use reasonable technical and organizational measures — including encryption in transit,
              access controls, and regular review of our systems — to protect your information. No method
              of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="pv-section" id="transfers">
            <h2 className="pv-section-title">International transfers</h2>
            <p>
              Your information may be transferred to, and processed in, countries other than your own,
              including <span className="pv-placeholder">[country where servers/providers are located]</span>.
              Where required, we rely on appropriate safeguards (such as standard contractual clauses) for
              such transfers.
            </p>
          </section>

          <section className="pv-section" id="changes">
            <h2 className="pv-section-title">Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be indicated by updating
              the "Last updated" date above, and — where required by law — we will provide additional notice
              or seek renewed consent.
            </p>
          </section>

          <section className="pv-section" id="contact">
            <h2 className="pv-section-title">Contact us</h2>
            <p>Questions about this policy or your data can be directed to:</p>
            <div className="pv-contact-box">
              <div className="pv-contact-row">
                <span className="pv-contact-label pv-mono">Email</span>
                <span className="pv-contact-value pv-mono">privacy@<span className="pv-placeholder">yourdomain.com</span></span>
              </div>
              <div className="pv-contact-row">
                <span className="pv-contact-label pv-mono">Phone</span>
                <span className="pv-contact-value pv-mono"><span className="pv-placeholder">[business phone]</span></span>
              </div>
              <div className="pv-contact-row">
                <span className="pv-contact-label pv-mono">Address</span>
                <span className="pv-contact-value"><span className="pv-placeholder">[registered business address]</span></span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}