"use client"
import Mview from '@/component/machine/Mview'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

export default function page() {
    const searchPrams = useParams()
    const slug = searchPrams.slug
  return (
    <div className='w-full flex justify-center'>
      <Mview slug={slug}/>
    </div>
  )
}
