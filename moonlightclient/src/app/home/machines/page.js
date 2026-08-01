import ProductShowcase from '@/component/home/main/Listproduct'
import Mview from '@/component/machine/Mview'
import React from 'react'

export const metadata = {
  title: "Machines | Moonlight Machinery",
  description: "Leading manufacturer of eco-friendly areca leaf plates & disposable paper plates in India. 100% biodegradable, bulk orders, PAN-India & export shipping. Get a quote today.",
  alternates: {
    canonical: 'www.moonlightmachinery.com/home/machines',
  },
};
export default function page() {
  const show = false
  return (
    <div className='w-full flex justify-center py-16'>
      <ProductShowcase view={show}/>
    </div>
  )
}
