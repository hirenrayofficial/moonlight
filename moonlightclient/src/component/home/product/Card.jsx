import Image from "next/image";
import React from "react";

export default function Card({ product }) {
  const handelViewitem = (slug)=>{
    // alert(slug)
    window.location.href = `/home/machines/${slug}` 
  }
  return (
    <div>
      <div className="pl-grid">
        {product?.map((p) => (
          <div className="pl-card" key={p?.name}>
            <div className="pl-image-wrap">
              {p.tag && (
                <span
                  className={`pl-tag ${p?.tag === "Low stock" ? "low" : ""}`}
                >
                  {p?.tag}
                </span>
              )}
              <Image width={500} height={500} alt={p?.name} className="pl-image" src={p?.image} loading="lazy" />

              <button className="pl-quick-add" onClick={(e)=>handelViewitem(p.slug)}>View Details</button>
            </div>
            <div className="pl-info">
              <div className="pl-name">{p?.name.slice(0, 32)}...</div>
              <div className="pl-price pl-mono">₹{p?.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
