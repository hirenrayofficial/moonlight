import ProductShowcase from '@/component/home/main/Listproduct'
import Mview from '@/component/machine/Mview'
import React from 'react'

export default function page() {
  const show = false
  return (
    <div className='w-full flex justify-center py-16'>
      <ProductShowcase view={show}/>
    </div>
  )
}
