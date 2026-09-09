import { NextResponse } from "next/server";
import Review from "@/db/mongodb/review";
import connectDB from "@/db/mongodb/db";



// GET: Fetch all reviews or query by ID
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const review = await Review.findById(id);
            if (!review) {
                return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: review }, { status: 200 });
        }

        const reviews = await Review.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reviews }, { status: 200 });
    } catch (error) {
        console.error("Database fetch reviews error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while fetching reviews." },
            { status: 500 }
        );
    }
}