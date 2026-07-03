import React from "react";

export default function Card({ product }) {
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
              <img className="pl-image" src={p?.image} alt={p.name} />
              <button className="pl-quick-add">Quick add</button>
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
