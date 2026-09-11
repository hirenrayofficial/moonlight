"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Navigation,
  Building2,
  ExternalLink,
} from "lucide-react";
import "./branchroute.scss";

const BRANCHES = [
  {
    city: "Gurgaon",
    state: "Haryana",
    address: "Plot -13, Ram Vihar, Dhanwapur Road, Sector-104, Gurgaon-12201",
    phone: "+91 9354327757",
    isHQ: true,
    mapQuery: "Plot 13 Ram Vihar Dhanwapur Road Sector 104 Gurgaon Haryana",
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    address: "Delhi NCR",
    phone: "+91 9354327757",
    mapQuery: "Delhi NCR India",
  },
  {
    city: "Siliguri",
    state: "West Bengal",
    address: "Eastern Bypass, PCRA Colony, Siliguri, West Bengal 734001",
    phone: "+91 9354327757",
    mapQuery: "Eastern Bypass PCRA Colony Siliguri West Bengal 734001",
  },
  {
    city: "Guwahati",
    state: "Assam",
    address: "Guwahati, Barpeta Road, Assam",
    phone: "+91 9883500259",
    mapQuery: "Guwahati Assam India",
  },
  {
    city: "Gaziabad",
    state: "Uttar Pradesh",
    address: "Hindon Vihar, Gaziabad, Uttar Pradesh",
    phone: "+91 9907330121",
    mapQuery: "Hindon Vihar Ghaziabad Uttar Pradesh India",
  },
];

function getMapUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&output=embed`;
}

function getDirectionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    query,
  )}`;
}

export default function BranchRoute() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBranch = useMemo(() => BRANCHES[activeIndex], [activeIndex]);

  return (
    <section className="br-root">
      <div className="br-inner">
        {/* HEADER */}
        <motion.div
          className="br-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="br-eyebrow">Our locations</span>

          <h2 className="br-title">
            Find Moonlight Machinery
            <br />
            <span>near you</span>
          </h2>

          <p className="br-subhead">
            Explore our branches across India and find the location closest to
            you.
          </p>
        </motion.div>

        {/* MAP + BRANCHES */}
        <div className="br-showcase">
          {/* MAP */}
          <motion.div
            className="br-map-wrapper"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <iframe
              key={activeBranch.city}
              className="br-map"
              src={getMapUrl(activeBranch.mapQuery)}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={`${activeBranch.city} Moonlight Machinery location`}
            />

            {/* MAP LABEL */}
            <div className="br-map-label">
              <div className="br-map-label-icon">
                <MapPin size={17} />
              </div>

              <div>
                <strong>{activeBranch.city}</strong>
                <span>{activeBranch.state}</span>
              </div>
            </div>

            {/* DIRECTIONS */}
            <a
              href={getDirectionsUrl(activeBranch.mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="br-directions"
            >
              <Navigation size={15} />
              Get directions
              <ExternalLink size={13} />
            </a>
          </motion.div>

          {/* BRANCH LIST */}
          <div className="br-branches">
            <div className="br-list-head">
              <div>
                <span>Locations</span>
                <h3>Our branches</h3>
              </div>

              <div className="br-count">{BRANCHES.length}</div>
            </div>

            <div className="br-list">
              {BRANCHES.map((branch, index) => {
                const active = index === activeIndex;

                return (
                  <motion.button
                    key={branch.city}
                    type="button"
                    className={`br-branch ${active ? "active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                    whileHover={{ x: 3 }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <div className="br-branch-icon">
                      {branch.isHQ ? (
                        <Building2 size={17} />
                      ) : (
                        <MapPin size={17} />
                      )}
                    </div>

                    <div className="br-branch-content">
                      <div className="br-branch-top">
                        <strong>{branch.city}</strong>

                        {branch.isHQ && <span className="br-hq">HQ</span>}
                      </div>

                      <span className="br-branch-state">{branch.state}</span>

                      <span className="br-branch-address">
                        {branch.address}
                      </span>

                      <span className="br-branch-phone">
                        <Phone size={13} />
                        {branch.phone}
                      </span>
                    </div>

                    <div className="br-branch-arrow">
                      <Navigation size={15} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div className="br-bottom">
          <div className="br-bottom-item">
            <MapPin size={17} />
            <span>Serving customers across multiple regions</span>
          </div>

          <div className="br-bottom-item">
            <Phone size={17} />
            <span>Contact your nearest branch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
