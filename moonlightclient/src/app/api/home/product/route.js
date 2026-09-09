import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
import { Reggae_One } from "next/font/google";
// import { useParams } from "next/navigation";
import { NextResponse } from "next/server";


export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let filter = {};

    if (query) {
        // Keep the hyphen and create a case-insensitive regex
        const searchTerm = query.trim();
        const regex = new RegExp(searchTerm, "i");

        filter = {
            machineType: { $regex: regex }
        };

        console.log(regex); // Will output: /full-automatic/i
    }

    const res = await Product.find(filter).select({
        name: 1,
        slug: 1,
        sku: 1,
        pricing: 1,
        images: 1,
        machineType: 1,
    });

    if (query && res.length === 0) {
        return NextResponse.json({
            message: "No products found for this machine type",
            item: []
        });
    }

    return NextResponse.json({
        message: "Products fetched successfully",
        item: res
    });
}
export async function POST(req) {
    await connectDB();

    // Access searchParams directly from req.nextUrl
    const { nextUrl } = req;
    const slug = nextUrl.searchParams.get("slug");

    const res = await Product.find({ slug: slug })

    return NextResponse.json({ message: "Product get successful", item: res });
}

