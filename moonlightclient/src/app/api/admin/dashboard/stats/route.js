//totoal user visit //

import Logs from '@/db/mongodb/authbase/accesslog'
import Notification from '@/db/mongodb/notification'
import Product from '@/db/mongodb/product/productModule_fixed'
import { NextResponse } from 'next/server'
import { verifyAdminSession, unauthorizedJson } from '@/lib/adminAuth'





export async function GET(req) {
    if (!(await verifyAdminSession())) {
      return unauthorizedJson();
    }

    const res = await Logs.find().limit(7).sort({ createdAt: -1 }).select("os browser event createdAt")
    const total = await Logs.find().sort({ createdAt: -1 })
    const totals = await Product.find().sort({ createdAt: -1 })
    const totaln = await Notification.find().sort({ createdAt: -1 })
    return NextResponse.json({ message: "here is all logs ", dt: res, total: total.length, ptotal: totals.length, ntotal: totaln.length })
}