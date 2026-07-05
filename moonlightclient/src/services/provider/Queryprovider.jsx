"use client"


import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Children, useState } from 'react'

export default function Queryprovider({children}) {
    const [queryClient]= useState(()=>new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
