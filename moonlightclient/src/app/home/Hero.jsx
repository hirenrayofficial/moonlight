import HeroDesign from '@/component/home/main/HeroDesign'
import ProductPA from '@/component/home/main/ProductPA'
import SectionServices from '@/component/home/main/SectionServices'
import SectionTestimonials from '@/component/home/main/SectionTestimonials'
import SectionContact from '@/component/home/main/SectionContact'
import StackScroll from '@/component/home/main/Sliderpage'
import Footer from '@/component/home/fixed/Footer'
import React from 'react'
import UtilitarianHero from '@/component/home/main/TempHero'
import ProductPage from '@/component/home/main/ProductList'
import ProductShowcase from '@/component/home/main/Listproduct'
import HowItWorks from '@/component/home/main/Howworks'
import BannerCarousel from '@/component/home/main/Crousal'
import Header from '@/component/home/fixed/Header'

export default function Hero() {
  return (
    <div className='py-24  w-full flex flex-col  mx-auto justify-center items-center flex flex-col gap-10'>
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
      <SectionTestimonials />
      <SectionContact />
      <Footer/>
    </div>
  )
}
