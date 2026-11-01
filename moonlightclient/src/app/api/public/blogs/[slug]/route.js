import { NextResponse } from "next/server";
import { getPublicBlogBySlug } from "@/services/public/BlogService";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const blog = await getPublicBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: blog });
  } catch (error) {
    console.error("Public blog detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch the blog post." },
      { status: 500 }
    );
  }
}
