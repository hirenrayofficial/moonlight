import SectionContact from "@/component/home/main/SectionContact";

import Footer from "@/component/home/fixed/Footer";
import React, { Suspense } from 'react' // Import Suspense here
import ProductShowcase from "@/component/home/main/Listproduct";
import HowItWorks from "@/component/home/main/Howworks";
import BannerCarousel from "@/component/home/main/Crousal";
import Header from "@/component/home/fixed/Header";
import TrustSection from "@/component/home/main/TrustSection";
import BranchRoute from "@/component/home/main/BranchRoute";
import FaqSection from "@/component/home/main/FaqSection";

export default function Hero() {
  return (
    <div className=" w-full flex flex-col mt-[100px]  mx-auto justify-center items-center flex flex-col gap-10">
      <Header />
      <BannerCarousel />
      {/* <UtilitarianHero /> */}

      <Suspense
        fallback={<div className="py-10 text-center">Loading products...</div>}
      >
        <ProductShowcase view={true} limit={8} hide={false} />
      </Suspense>
      <BranchRoute />

      {/* <ProductPage /> */}
      {/* <HeroDesign /> */}
      <HowItWorks />
      {/* <SectionServices /> */}
      {/* <ProductPA /> */}
      {/* <StackScroll /> */}
      <TrustSection />
      {/* <SectionTestimonials /> */}
      <SectionContact />
      <FaqSection />
      <Footer />
    </div>
  );
}
