import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
// import { useParams } from "next/navigation";
import { NextResponse } from "next/server";


export async function GET(req) {
    await connectDB()
    const res = await Product.find()

    return NextResponse.json({ message: "Product get successfull", item: res })
}



export async function POST(req) {
    await connectDB();

    // Access searchParams directly from req.nextUrl
    const { nextUrl } = req;
    const slug = nextUrl.searchParams.get("slug");

    const res = await Product.find({ slug: slug })
    // console.log(res);

    return NextResponse.json({ message: "Product get successful", item: res });
}

