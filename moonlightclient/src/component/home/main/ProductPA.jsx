import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ProductPA() {
  return (
    <section className="w-full min-h-[95vh] bg-white flex items-center justify-center p-6">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <span className="text-[#E8794A] font-bold text-xs uppercase tracking-widest">
              Ranking Product
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Our Most Growing Product For You
            </h1>
          </div>

          <p className="text-gray-600 text-lg max-w-md leading-relaxed">
            Discover our latest innovation designed to elevate your business.
            Unlock unmatched potential and gain the competitive edge you
            deserve.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button className="px-8 py-3 cursor-pointer bg-transparent border border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium">
              View More
            </button>
            <button className="w-12 h-12 cursor-pointer flex items-center justify-center bg-[#E8794A] text-white rounded-full hover:bg-[#d66a3d] transition-all duration-300 shadow-lg shadow-orange-200">
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Right Column: Visuals */}
        <div className="product-slide flex justify-center items-center p-0 m-0">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[520px] h-[420px] sm:h-[460px] md:h-[520px]">
            <div className="absolute left-1/2 top-8 w-[220px] sm:w-[240px] md:w-[260px] lg:w-[300px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] -translate-x-1/2 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/p-a.png"
                alt="Product A"
                fill
                sizes="(max-width: 1024px) 100vw, 300px"
                className="object-cover"
              />
              <h4 className="absolute left-4 top-4 text-[#E8794A] bg-white/90 p-2 rounded-full text-sm font-semibold">
                Automatic
              </h4>
            </div>
            <div className="absolute left-0 top-[40%] w-[180px] sm:w-[200px] md:w-[220px] lg:w-[260px] h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden shadow-lg md:left-6 lg:left-10">
              <Image
                src="/p-b.png"
                alt="Product B"
                fill
                sizes="(max-width: 1024px) 100vw, 300px"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[240px] h-[160px] sm:h-[180px] md:h-[220px] lg:h-[260px] rounded-2xl overflow-hidden shadow-lg md:right-6 lg:right-10">
              <Image
                src="/p-c.png"
                alt="Product C"
                fill
                sizes="(max-width: 1024px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
