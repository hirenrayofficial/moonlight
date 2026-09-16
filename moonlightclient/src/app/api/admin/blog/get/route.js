import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("moonlightblogs")
        .select("blog_title ,blog_description")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase Database Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts from database." },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
} 