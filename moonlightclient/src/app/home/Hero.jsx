import SectionTestimonials from '@/component/home/main/SectionTestimonials'
import SectionContact from '@/component/home/main/SectionContact'

import Footer from '@/component/home/fixed/Footer'
import React from 'react'
import ProductShowcase from '@/component/home/main/Listproduct'
import HowItWorks from '@/component/home/main/Howworks'
import BannerCarousel from '@/component/home/main/Crousal'
import Header from '@/component/home/fixed/Header'
import TrustSection from '@/component/home/main/TrustSection'

export default function Hero() {
  return (
    <div className=' w-full flex flex-col  mx-auto justify-center items-center flex flex-col gap-10'>
     <Header/>
     <BannerCarousel/>
      {/* <UtilitarianHero /> */}

      <ProductShowcase view={{show:true}}/>

      {/* <ProductPage /> */}
      {/* <HeroDesign /> */}
      <HowItWorks/>
      {/* <SectionServices /> */}
      {/* <ProductPA /> */}
      {/* <StackScroll /> */}
      <TrustSection/>
      {/* <SectionTestimonials /> */}
      <SectionContact />
      <Footer/>
    </div>
  )
}
