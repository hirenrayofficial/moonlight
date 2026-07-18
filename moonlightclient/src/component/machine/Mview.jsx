"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./style/mview.scss";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRelatedItem, getspcItem } from "@/services/home/GetProduct";
import Link from "next/link";
import { MessageCircleMore, PhoneCall } from "lucide-react";
/**
 * STOCKROOM — product page
 * Same system as the hero + header: paper background, hairline rules,
 * mono data, sharp corners. Signature element here is a spec sheet
 * instead of marketing copy — the product argues for itself with numbers.
 */

function money(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function GallerySkeleton() {
  return (
    <div className="pd-gallery">
      <div className="pd-image-main pd-skel-block" />
      <div className="pd-thumbs">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="pd-thumb pd-skel-block" key={i} />
        ))}
      </div>
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="pd-info">
      <div className="pd-skel-line pd-skel-eyebrow" />
      <div className="pd-skel-line pd-skel-title" />
      <div className="pd-skel-line pd-skel-sku" />
      <div className="pd-skel-line pd-skel-price" />
      <div className="pd-skel-line pd-skel-desc" />
      <div className="pd-skel-line pd-skel-desc short" />
      <div className="pd-skel-block pd-skel-btn" />
    </div>
  );
}

function RelatedSkeleton() {
  return (
    <div className="pd-related">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="pd-related-card" key={i}>
          <div className="pd-related-image pd-skel-block" />
          <div className="pd-related-info">
            <div className="pd-skel-line pd-skel-line-name" />
            <div className="pd-skel-line pd-skel-line-price" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Mview({ slug }) {
  const [activeImage, setActiveImage] = useState(0);

  const pathname = usePathname();

  // 1. Split the path and filter out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["item", slug], // Included slug here (best practice)
    queryFn: () => getspcItem(slug), // Use an arrow function wrapper
  });

  const product = data?.[0];

  // Always call the hook, but control execution with 'enabled'
  const { data: relatedData, isLoading: isRelatedLoading } = useQuery({
    queryKey: ["relatedItem", product?.machineType],
    queryFn: () => getRelatedItem(product.machineType),
    // The query will only run if machineType is truthy
    enabled: !!product?.machineType,
  });

  // Reset the active thumbnail whenever a different product loads, so we
  // never end up pointing at an index that belongs to the previous item.
  React.useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  function handleEnquiry() {
    // Call the business phone number
    if (product?.name) {
      window.location.href = `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+918178445596"}`;
    }
  }

  function handleWhatsApp() {
    // Send WhatsApp message with product details
    const businessPhone =
      process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+918178445596";
    const productDetails = `
*Product Enquiry*

*Name:* ${product?.name}
*SKU:* ${product?.sku}
*Price:* ₹${money(product?.pricing?.basePrice || 0)}
*Stock Available:* ${product?.stock}

*Description:* ${product?.description}

Please provide more information about this product.
    `.trim();

    const encodedMessage = encodeURIComponent(productDetails);
    const whatsappUrl = `https://wa.me/${businessPhone.replace(/[^\d+]/g, "")}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  }

  const crumb = (
    <div className="pd-crumb pd-mono flex hidden md:flex">
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        return (
          <div key={href} className="flex gap-2">
            <span>/</span>
            <Link href={href} className="capitalize bold text-gray-500">
              {segment.replace(/-/g, " ")}
            </Link>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="pd-root py-32 w-full max-w-[1200px]">
        {crumb}
        <section className="pd-main">
          <GallerySkeleton />
          <InfoSkeleton />
        </section>
        <div className="pd-related-head pd-mono">Also in stock</div>
        <RelatedSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pd-root py-32 w-full max-w-[1200px]">
        {crumb}
        <div className="pd-error pd-mono">
          Couldn't load this product
          {error?.message ? ` — ${error.message}` : ""}.
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-root py-32 w-full max-w-[1200px]">
        {crumb}
        <div className="pd-error pd-mono">Product not found.</div>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="pd-root py-32 w-full max-w-[1200px]">
      {crumb}

      <section className="pd-main">
        <div className="pd-gallery">
          {/* FIX: this was hardcoded to images[0] and never read
              activeImage, so clicking a thumbnail updated state but the
              big image never changed. Now it follows activeImage. */}
          <Image
            width={400}
            height={400}
            className="pd-image-main"
            src={images[activeImage] || images[0]}
            alt={product.name || "Product image"}
            // priority
            loading="lazy"
          />
          <div className="pd-thumbs">
            {images.map((src, i) => (
              <button
                key={src + i}
                className={`pd-thumb ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={product.name ? `${product.name} thumbnail ${i + 1}` : "Product thumbnail"}
                  width={80}
                  height={80}
                  className="pd-thumb-image"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info p-8 md:p-0">
          <div className="pd-eyebrow pd-mono">
            <span className="pd-dot" aria-hidden="true" />
            In stock — {product.stock} available
          </div>

          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-sku pd-mono">SKU {product.sku}</div>

          <div className="pd-price pd-mono">
            ₹{money(product.pricing?.basePrice || 0)}
          </div>
          {/* add extra delivery cost */}
          {product.pricing?.otherExpenses && (
            <div className="pd-delivery-cost pd-mono">
              + ₹{money(product.pricing?.otherExpenses || 0)} Other Expenses
            </div>
          )}

          <p className="pd-desc">{product.description}</p>

          <div className="pd-buy-row">
            <button className="pd-add-btn py-2 flex items-center justify-center gap-4" onClick={handleEnquiry} title="Call us">
              <PhoneCall width={15} /> Call Now
            </button>
            <button className="pd-add-btna py-2 flex items-center justify-center gap-4 bg-green-600" onClick={handleWhatsApp} title="Send WhatsApp message">
              <MessageCircleMore width={15} /> WhatsApp
            </button>
          </div>

          <p className="pd-meta pd-mono">
            Ships from stock — most orders same day. Flat $6 shipping.
          </p>
        </div>
      </section>

      <section className="pd-specs-section">
        <div className="pd-specs-title pd-mono">Specification</div>
          {/* // add this field productionCapacity,motor, totalPower, voltage ,phase , weight,rawMaterial ,dimensions[length, width, height,unit],plateSizeRange,rollerSize,drive,paperCupSizeRange,electricityBillEstimate// */}

          {product.specifications?.productionCapacity && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Production Capacity</span>
              <span className="pd-spec-value">
                {product.specifications?.productionCapacity}
              </span>
            </div>
          )}
          {product.specifications?.motor && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Motor</span>
              <span className="pd-spec-value">
                {product.specifications?.motor}
              </span>
            </div>
          )}
          {product.specifications?.totalPower && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Total Power</span>
              <span className="pd-spec-value">
                {product.specifications?.totalPower}
              </span>
            </div>
          )}
          {product.specifications?.voltage && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Voltage</span>
              <span className="pd-spec-value">
                {product.specifications?.voltage}
              </span>
            </div>
          )}
          {product.specifications?.phase && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Phase</span>
              <span className="pd-spec-value">
                {product.specifications?.phase}
              </span>
            </div>
          )}
          {product.specifications?.weight && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Weight</span>
              <span className="pd-spec-value">
                {product.specifications?.weight}
              </span>
            </div>
          )}
          {product.specifications?.rawMaterial && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Raw Material</span>
              <span className="pd-spec-value">
                {product.specifications?.rawMaterial}
              </span>
            </div>
          )}
          {product.specifications?.dimensions && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Dimensions</span>
              <span className="pd-spec-value">
                {product.specifications?.dimensions?.length} x{" "}
                {product.specifications?.dimensions?.width} x{" "}
                {product.specifications?.dimensions?.height}{" "}
                {product.specifications?.dimensions?.unit}
              </span>
            </div>
          )}
          {product.specifications?.plateSizeRange && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Plate Size Range</span>
              <span className="pd-spec-value">
                {product.specifications?.plateSizeRange}
              </span>
            </div>
          )}
          {product.specifications?.rollerSize && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Roller Size</span>
              <span className="pd-spec-value">
                {product.specifications?.rollerSize}
              </span>
            </div>
          )}
          {product.specifications?.drive && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Drive</span>
              <span className="pd-spec-value">
                {product.specifications?.drive}
              </span>
            </div>
          )}
          {product.specifications?.paperCupSizeRange && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">
                Paper Cup Size Range
              </span>
              <span className="pd-spec-value">
                {product.specifications?.paperCupSizeRange}
              </span>
            </div>
          )}
          {product.specifications?.electricityBillEstimate && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">
                Electricity Bill Estimate
              </span>
              <span className="pd-spec-value">
                {product.specifications?.electricityBillEstimate}
              </span>
            </div>
          )}
          <div className="pd-specs-title pd-mono">Delivery</div>
          {product.deliveryTime && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Delivery</span>
              <span className="pd-spec-value">{product.deliveryTime}</span>
            </div>
          )}
          {product.isReturnable !== undefined && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Returnable</span>
              <span className="pd-spec-value">
                {product.isReturnable ? "Yes" : "No"}
              </span>
            </div>
          )}
          {product.mainMarket && (
            <div className="pd-spec-row">
              <span className="pd-spec-label pd-mono">Market</span>
              <span className="pd-spec-value">{product.mainMarket}</span>
            </div>
          )}
        </section>

      <div className="pd-related-head pd-mono">Also in stock</div>
      {isRelatedLoading ? (
        <RelatedSkeleton />
      ) : (
        <div className="pd-related">
          {relatedData?.map((p) => (
            <Link href={`/home/machines/${p?.slug}`} key={p?.name}>
              <div className="pd-related-card">
                {p?.images?.[0] ? (
                  <Image
                    className="pd-related-image"
                    src={p.images[0]}
                    alt={p?.name || "Related product"}
                    width={160}
                    height={120}
                    loading="lazy"
                  />
                ) : (
                  <div className="pd-related-image pd-image-placeholder" />
                )}
                <div className="pd-related-info">
                  <div className="pd-related-name">{p?.name}</div>
                  <div className="pd-related-price pd-mono">
                    ₹{money(p?.pricing?.basePrice || 0)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
