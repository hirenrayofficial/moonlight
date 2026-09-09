import connectDB from "@/db/mongodb/db";
import Video from "@/db/mongodb/video"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB();
        const videos = await Video.find({}).sort({ createdAt: +1 });
        return NextResponse.json({ success: true, data: videos }, { status: 200 });
    } catch (error) {
        console.error("Database video fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while fetching videos." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { video_url, video_source } = body;

        // Validate payload fields
        if (!video_url || !video_source) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: video_url and video_source." },
                { status: 400 }
            );
        }

        // Upsert or create video entry using video_source as the unique identifier
        const updatedVideo = await Video.findOneAndUpdate(
            { video_source },
            { video_url, video_source },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Video successfully registered in database.",
                data: updatedVideo
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Database video save error:", error);

        // Handle Mongoose duplicate key error specifically if it bypasses upsert logic
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "A video with this unique source already exists." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error while saving video." },
            { status: 500 }
        );
    }
}
// PUT: Update an existing video record by video_source
export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { video_url, video_source } = body;

        if (!video_source) {
            return NextResponse.json(
                { success: false, message: "Missing identifier: video_source is required." },
                { status: 400 }
            );
        }

        const updateData = {};
        if (video_url) updateData.video_url = video_url;

        const existingVideo = await Video.findOneAndUpdate(
            { video_source },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!existingVideo) {
            return NextResponse.json(
                { success: false, message: "Video record not found for update." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Video updated successfully.", data: existingVideo },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database video update error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while updating video." },
            { status: 500 }
        );
    }
}

// DELETE: Remove a video record using video_source from query params (e.g. ?video_source=xyz)
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const video_source = searchParams.get("video_source");

        if (!video_source) {
            return NextResponse.json(
                { success: false, message: "Missing query parameter: video_source is required." },
                { status: 400 }
            );
        }

        const deletedVideo = await Video.findOneAndDelete({ video_source });

        if (!deletedVideo) {
            return NextResponse.json(
                { success: false, message: "Video record not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Video deleted successfully.", data: deletedVideo },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database video deletion error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while deleting video." },
            { status: 500 }
        );
    }
}