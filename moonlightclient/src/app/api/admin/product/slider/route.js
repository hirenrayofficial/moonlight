import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
import { NextResponse } from "next/server";

export async function PUT(req) {

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');
    const sliderActive = searchParams.get("slider_active");
    const sliderImage = searchParams.get("slider_image") || undefined;

    if (!productId || sliderActive === null) {
        return NextResponse.json(
            { success: false, error: 'Invalid request: productId and payload required' },
            { status: 400 }
        );
    }

    const slider = sliderActive === "true" || sliderActive === "1";
    await connectDB();

    const updatePayload = {
      slider,
    };

    if (sliderImage !== undefined) {
      updatePayload.slider_image = sliderImage;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updatePayload },
        { new: true, runValidators: true }
    );
    if (!updatedProduct) {
        return NextResponse.json(
            { success: false, error: 'Product not found.' },
            { status: 404 }
        );
    }
    return NextResponse.json(
        {
            success: true,
            message: 'Product Slider updated successfully!',
            // data: updatedProduct,
        },
        { status: 200 }
    );
}