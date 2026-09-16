import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function GET() {
    const { data, error } = await supabase
        .from("moonlightblogs")
        .select("blog_title ,blog_description,slug")
        .order("created_at", { ascending: false })
        .limit(8)

    if (error) {
        console.error("Supabase Database Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts from database." },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
}

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        // 2. Validate that the slug was provided
        if (!slug) {
            return NextResponse.json(
                { message: "Please provide a valid slug to access the blog." },
                { status: 400 }
            );
        }

        // 3. Query Supabase for the specific blog post matching the slug
        const { data, error } = await supabase
            .from("moonlightblogs")
            .select()
            .eq("slug", slug)
            .single(); // Use .single() since a slug should return only one record

        if (error) {
            console.error("Supabase Database Error:", error);
            return NextResponse.json(
                { error: "Failed to fetch the blog post from the database." },
                { status: 500 }
            );
        }

        // Handle case where no blog post matches the slug
        if (!data) {
            return NextResponse.json(
                { error: "Blog post not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, item:data }, { status: 200 });

    } catch (err) {
        console.error("Request Parsing Error:", err);
        return NextResponse.json(
            { error: "Invalid request body." },
            { status: 400 }
        );
    }
}