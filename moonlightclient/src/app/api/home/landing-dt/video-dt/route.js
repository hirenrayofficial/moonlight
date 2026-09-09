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