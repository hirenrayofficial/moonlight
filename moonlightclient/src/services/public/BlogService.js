import { supabase } from "@/lib/supabase";

const BLOG_CARD_FIELDS =
  "blog_title, blog_description, slug, image_url, created_at";

export async function getPublicBlogs() {
  const { data, error } = await supabase
    .from("moonlightblogs")
    .select(BLOG_CARD_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch public blog posts: ${error.message}`);
  }

  return data || [];
}

export async function getPublicBlogBySlug(slug) {
  if (!slug) {
    return null;
  }

  const { data, error } = await supabase
    .from("moonlightblogs")
    .select(`${BLOG_CARD_FIELDS}, content`)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch public blog post: ${error.message}`);
  }

  return data;
}
