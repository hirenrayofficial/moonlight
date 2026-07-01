import Image from "next/image";
import React from "react";
import "./hero.scss";

const companies = [
  { name: "Company One", logo: "/next.svg" },
  { name: "Company Two", logo: "/next.svg" },
  { name: "Company Three", logo: "/next.svg" },
  { name: "Company Four", logo: "/next.svg" },
  // { name: "Company Five", logo: "/next.svg" },
];

export default function HeroDesign() {
  return (
    <div className="flex  flex-col items-center justify-center w-full max-w-[1200px] mx-auto  px-4 sm:px-6 lg:px-0 min-h-[70vh] sm:min-h-screen">
      {/* <hr className="bg-[#4F9D9D] hidden md:flex border-transparent w-full h-[2px]" /> */}

      <div className="hero-main w-full flex flex-col md:flex-row gap-8 md:gap-4 justify-between items-center md:items-stretch">
        {/* Left column */}
        <div className="hero-l w-full md:max-w-[650px] flex flex-col gap-6 py-10">
          <h1
            className="text-3xl sm:text-4xl lg:text-6xl leading-tight text-[#252323]"
            style={{ fontFamily: "'DM Serif Text',system-ui" }}
          >
            Turning Your<p style={{fontFamily: "'DM text',serif"}} className="m-0 p-0 text-[#E8794A]">Vision</p>Into Market-Ready 
          </h1>

          <h2 className="text-sm md:text-xl lg:text-md text-[#70798c] font-normal leading-relaxed">
            We provide the best tools to launch your startup or new business and
            earn money at any age, giving you the chance to build your life
            through our product.
          </h2>

          <div style={{fontFamily: "'Sniglet', system-ui ",}} className="click-option flex flex-wrap gap-4 font-bold text-sm md:text-md lg:text-md">
            <button className="bg-[#E8794A] cursor-pointer p-3 px-6 rounded-4xl text-[#f5f1ed] hover:opacity-90 transition-opacity">
              Consult now
            </button>
            <button className="bg-[#ffffff00] p-2 px-4 cursor-pointer rounded-4xl hover:opacity-90 transition-opacity border border-[#000000]">
              Download brochure
            </button>
          </div>
        </div>

        <hr className="bg-[#4F9D9D] hidden md:flex w-[2px] self-stretch" />

        {/* Right column */}
        <div className="hero-r w-full md:max-w-[650px] flex flex-col gap-4 py-10">
          <div className="relative w-full aspect-[10/9] sm:aspect-square md:aspect-[4/3]">
            {/* <div className="some-ad-c-a absolute top-3 left-3 z-10 flex flex-wrap gap-2 max-w-[90%]">
              <p className="p-rt bg-[#dad2bc] w-fit py-1 px-4 rounded-2xl text-[#252323] m-0 text-xs sm:text-sm">
                Advanced
              </p>
              <p className="p-rt bg-[#a99985] w-fit py-1 px-4 rounded-2xl text-[#ffffff] m-0 text-xs sm:text-sm">
                Automatic
              </p>
              <p className="p-rt bg-[#ffc629] w-fit py-1 px-4 rounded-2xl text-[#030303] m-0 text-xs sm:text-sm">
                Machine
              </p>
            </div> */}

            <Image
              src="/automatic-p-as.png"
              alt="Product showcase"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="a-p rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <section className="w-full pt-8  border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          {/* <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Trusted by growing businesses
          </p> */}

          {/* Logo Grid */}
          <div className="flex  justify-center items-center gap-8 md:gap-16">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ease-in-out cursor-pointer"
              >
                {/* You can replace <img> with next/image for better performance */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <hr className="bg-[#4F9D9D] hidden md:flex border-transparent w-full h-[2px]" /> */}
    </div>
  );
}
