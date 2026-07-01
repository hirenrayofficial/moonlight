"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import styles from "./slide.module.scss";
import ProductPA from "./ProductPA";
import ProductMannege from "../product/ProductMannege";
import HowItWorks from "./Howworks";
import SectionServices from "./SectionServices";
import Testimonials from "./SectionTestimonials";
import ContactPage from "./SectionContact";

gsap.registerPlugin(ScrollTrigger);

export default function StackScroll() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const cardsContent = [
    { id: 1, title: "1", color: "#000000" },
    { id: 2, title: "2", color: "#ff0000" },
    { id: 3, title: "3", color: "#33ff00" },
    // { id: 4, title: "4", color: "#00d9ff" },
  ];

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, index) => {
        // ✅ proper stacking order
        gsap.set(card, {
          zIndex: index + 1,
          // marginTop: "10px", // sadece ilk kart normal, diğerleri üst üste
        });

        // ✅ pin every card
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: "+=100%", // ek full screen scroll
          pin: true,
          pinSpacing: false,
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.stackContainer}>
      {cardsContent.map((card, i) => (
        <section
          key={i}
          ref={(el) => (cardsRef.current[i] = el)}
          className={styles.cardWrapper}
        >
          <div className={styles.card}>
            {/* {card.title === "1" && <HowItWorks />} */}
            {card.title === "1" && <Testimonials />}
            {card.title === "2" && <ContactPage />}
          </div>
        </section>
      ))}
    </div>
  );
}
