import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        
        // Fetch only products where slider is explicitly true
        const products = await Product.find({ slider: true }).select({
            name: 1,
            slug: 1,
            sku: 1,
            pricing: 1,
            images: 1,
            description: 1,
            slider: 1
        });

        return NextResponse.json({ 
            success: true, 
            itema: products 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch slider products", item: [] }, 
            { status: 500 }
        );
    }
}