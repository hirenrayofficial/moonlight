"use client";

import React from "react";
import Link from "next/link";
import { 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaTruckLoading, 
  FaTools, 
  FaPhoneAlt, 
  FaEnvelope 
} from "react-icons/fa";

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#15140f] pt-32 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="border border-[#b8b5a4] bg-white p-6 md:p-10 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
          <div className="inline-block bg-[#057ff2] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-3">
            Official Policy Document
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#15140f]">
            Cancellation, Refund & Return Policy
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#5a594e] max-w-3xl">
            Effective Date: October 2026 | Applies to all industrial machinery, accessories, dies, and raw materials supplied by Moonlight Machinery.
          </p>
        </div>

        {/* Highlight / Policy Overview Notice */}
        <div className="border-2 border-[#15140f] bg-[#fff] p-6 mb-8 shadow-[4px_4px_0px_0px_#15140f] flex flex-col md:flex-row items-start gap-4">
          <div className="p-3 bg-[#057ff2] text-white text-2xl shrink-0">
            <FaExclamationTriangle />
          </div>
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-[#15140f]">
              Industrial Goods Classification Notice (No General Return Policy)
            </h2>
            <p className="text-sm text-[#5a594e] mt-1 leading-relaxed">
              Moonlight Machinery manufactures and supplies heavy commercial equipment, industrial hydraulic presses, semi/fully-automatic production lines, and custom dies. Due to the high logistical cost, custom fabrication, and specialized freight requirements, <strong>all machinery and product sales are strictly non-refundable and non-returnable once dispatched.</strong>
            </p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <section className="border border-[#b8b5a4] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#15140f] text-white flex items-center justify-center font-mono font-bold text-sm">
                01
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                No Return & No Exchange Terms
              </h2>
            </div>
            <p className="text-sm text-[#5a594e] leading-relaxed mb-4">
              By placing an order on our platform, via phone, or directly through our invoice system, the customer acknowledges and agrees to the following:
            </p>
            <ul className="list-disc pl-5 text-sm text-[#5a594e] space-y-2">
              <li>
                <strong>Made-to-Order & Custom Configured Goods:</strong> Paper plate making machines, lamination units, hydraulic presses, and dies are configured according to custom specifications and are non-resalable as standard goods.
              </li>
              <li>
                <strong>No Change of Mind:</strong> We do not accept returns or offer refunds due to customer error, change of financial plans, site incompatibility, or operational preference changes post-purchase.
              </li>
              <li>
                <strong>Pre-Dispatch Inspection:</strong> Buyers are encouraged to perform physical or video inspection of the machinery at our manufacturing facilities prior to dispatch.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="border border-[#b8b5a4] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#15140f] text-white flex items-center justify-center font-mono font-bold text-sm">
                02
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Order Cancellation Policy
              </h2>
            </div>
            <div className="space-y-4 text-sm text-[#5a594e] leading-relaxed">
              <div className="p-4 bg-[#faf9f5] border-l-4 border-[#057ff2]">
                <h3 className="font-bold text-[#15140f] mb-1">Before Dispatch:</h3>
                <p>
                  Orders can be requested for cancellation within <strong>24 hours</strong> of booking payment, provided production or fabrication has not commenced. Approved cancellations prior to production will incur a <strong>10% administrative processing fee</strong>.
                </p>
              </div>
              <div className="p-4 bg-[#faf9f5] border-l-4 border-red-500">
                <h3 className="font-bold text-[#15140f] mb-1">After Dispatch / Shipment:</h3>
                <p>
                  Once the machinery has been loaded onto transport or handed over to freight/courier logistics, <strong>no order cancellation will be accepted under any circumstances</strong>. Advance deposits or full payments will be non-refundable.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border border-[#b8b5a4] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#15140f] text-white flex items-center justify-center font-mono font-bold text-sm">
                03
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Defective Goods & Transit Damage Verification
              </h2>
            </div>
            <p className="text-sm text-[#5a594e] leading-relaxed mb-4">
              While we enforce a Strict No-Return policy, customer protection in cases of severe transit damage or manufacturing defects is governed under the following protocol:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="border border-[#b8b5a4] p-4 bg-[#faf9f5]">
                <div className="flex items-center gap-2 font-bold text-[#15140f] mb-2">
                  <FaTruckLoading className="text-[#057ff2]" /> 48-Hour Reporting Window
                </div>
                <p className="text-xs text-[#5a594e]">
                  Damage or component defects must be reported within <strong>48 hours of physical delivery</strong> to our official support team.
                </p>
              </div>

              <div className="border border-[#b8b5a4] p-4 bg-[#faf9f5]">
                <div className="flex items-center gap-2 font-bold text-[#15140f] mb-2">
                  <FaShieldAlt className="text-[#057ff2]" /> Mandatory Unboxing Video
                </div>
                <p className="text-xs text-[#5a594e]">
                  Claims MUST be accompanied by an unedited unboxing/unloading video showing the sealed transport condition and the damaged part.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#5a594e] leading-relaxed">
              <strong>Resolution Procedure:</strong> If a defect or transit damage is verified, Moonlight Machinery will, at its sole discretion, replace the damaged spare part, supply free repair components, or dispatch a service engineer. <em>The entire machine will not be replaced or taken back for minor component damage.</em>
            </p>
          </section>

          {/* Section 4 */}
          <section className="border border-[#b8b5a4] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#15140f] text-white flex items-center justify-center font-mono font-bold text-sm">
                04
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Warranty & Repairs (Alternative to Returns)
              </h2>
            </div>
            <p className="text-sm text-[#5a594e] leading-relaxed">
              Industrial products do not qualify for returns, but are backed by our <strong>Standard Manufacturer Warranty Terms</strong>. Motors, hydraulic systems, and core components are repaired or replaced under warranty guidelines without voiding the purchase agreement. Consumable items, wear-and-tear components, and operator-induced electrical damages are excluded from warranty coverage.
            </p>
          </section>

          {/* Section 5 */}
          <section className="border border-[#b8b5a4] bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#15140f] text-white flex items-center justify-center font-mono font-bold text-sm">
                05
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wide">
                Refund Processing (Where Applicable)
              </h2>
            </div>
            <p className="text-sm text-[#5a594e] leading-relaxed">
              In rare situations where a refund is approved in writing by Moonlight Machinery management (e.g., duplicate payment or double transaction error), the amount will be processed back to the original payment source within <strong>7-10 business days</strong> via online bank transfer/NEFT/UPI.
            </p>
          </section>

          {/* Support / Contact Section */}
          <div className="border-2 border-[#15140f] bg-[#15140f] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wide mb-1">
                Questions or Policy Clarification?
              </h3>
              <p className="text-xs text-neutral-400">
                Contact our compliance & customer support team before placing your machine order.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href="tel:+919354327757"
                className="flex items-center justify-center gap-2 bg-[#057ff2] hover:bg-blue-600 text-white font-bold text-xs uppercase px-5 py-3 transition-colors border border-[#057ff2]"
              >
                <FaPhoneAlt /> +91 93543 27757
              </a>
              <a
                href="mailto:support@moonlightmachinery.com"
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-white hover:text-black text-white font-bold text-xs uppercase px-5 py-3 transition-colors border border-white"
              >
                <FaEnvelope /> Email Support
              </a>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}