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

// POST: Create a new review record
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { person_name, feedback, star, location, review_type } = body;

        if (!person_name || !feedback || !star || !location || !review_type) {
            return NextResponse.json(
                { success: false, message: "All fields (person_name, feedback, star, location, review_type) are mandatory." },
                { status: 400 }
            );
        }

        const newReview = await Review.create({
            person_name,
            feedback,
            star: Number(star),
            location,
            review_type,
        });

        return NextResponse.json(
            { success: true, message: "Review successfully published.", data: newReview },
            { status: 201 }
        );
    } catch (error) {
        console.error("Database create review error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while saving review." },
            { status: 500 }
        );
    }
}

// PUT: Update an existing review record by ID
export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { id, person_name, feedback, star, location, review_type } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing review identifier: id is required." },
                { status: 400 }
            );
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { person_name, feedback, star: Number(star), location, review_type },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return NextResponse.json(
                { success: false, message: "Review record not found for update." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Review updated successfully.", data: updatedReview },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database update review error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while updating review." },
            { status: 500 }
        );
    }
}

// DELETE: Remove a review record using id query param
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing query parameter: id is required." },
                { status: 400 }
            );
        }

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return NextResponse.json(
                { success: false, message: "Review record not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Review deleted successfully.", data: deletedReview },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database delete review error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while deleting review." },
            { status: 500 }
        );
    }
}