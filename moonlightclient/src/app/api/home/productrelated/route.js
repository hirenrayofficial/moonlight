import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
// import { useParams } from "next/navigation";
import { NextResponse } from "next/server";


// export async function GET(req) {
//     await connectDB()
//     const res = await Product.find()

//     return NextResponse.json({ message: "Product get successfull", item: res })
// }

export async function POST(req) {
    await connectDB()
    const { nextUrl } = req;
    const type = nextUrl.searchParams.get("type")


    const res = await Product.find({ machineType: type }).select("name slug images pricing tag")
    console.log(res)

    return NextResponse.json({ message: "Product get successfull", item: res })
}

