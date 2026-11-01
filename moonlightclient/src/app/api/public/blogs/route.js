import { NextResponse } from "next/server";
import { getPublicBlogs } from "@/services/public/BlogService";

export async function GET() {
  try {
    const data = await getPublicBlogs();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Public blog list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}
