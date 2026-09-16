import axios from 'axios';
import React from 'react';
import BlogPostPage from '../component/desing/BlogView';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.moonlightmachinery.com";

// Centralized helper using absolute URL for server-side fetching

async function getProduct(slug) {
    if (!slug) {
        return null;
    }

    try {
        // 1st arg: URL, 2nd arg: Request Body (empty object since you use query params), 3rd arg: Config
        const res = await axios.post(`/api/home/blog/get?slug=${slug}`, {});

        // Axios stores parsed response data in res.data
        // Since Supabase .single() returns a single object, item is an object (not an array)
        return res.data?.item || null;
    } catch (error) {
        console.error("Server-side getProduct error:", error?.response?.data || error.message);
        return null;
    }
}

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const product = await getProduct(slug);

    if (!product) {
        return { title: "Blog Machine Details | Moonlight Machinery" };
    }

    const url = `${SITE_URL}/blog/${slug}`;
    const title = product.blog_title?.trim();
    const description =
        product.blog_description?.trim() ||
        (product.blog_description
            ? product.blog_description.trim().slice(0, 155)
            : `${product.blog_title}`);

    return {
        title,
        description,
        keywords: "Paper plate making machine, Paper plate making price, Low price paper plate making machine, Best paper plate making machine",
        alternates: { canonical: url },
        openGraph: { title, description, url, images: product.images?.[0] ? [{ url: product.images[0] }] : "/logo.png" },
    };
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const Blog = await getProduct(slug);

    // Define url here so it's accessible for JSON-LD
    const url = `${SITE_URL}/blog/${slug}`;

    // Structured Data (JSON-LD)
    const jsonLd = Blog
        ? {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@id": `${url}#product`,
                    name: Blog.blog_title,
                    image: Blog.images || [],
                    description: Blog.blog_description || "",
                },
                {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Blogs",
                            item: `${SITE_URL}/home/blog`,
                        },
                        { "@type": "ListItem", position: 3, name: Blog.blog_title, item: url },
                    ],
                },
            ],
        }
        : null;

    return (
        <div>
            {/* Inject JSON-LD Structured Data */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
           <BlogPostPage data={Blog}/>
        </div>
    );
}