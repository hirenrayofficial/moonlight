import MainBlog from "./component/MainBlog";
import { getPublicBlogs } from "@/services/public/BlogService";

const SITE_URL = "https://www.moonlightmachinery.com";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Machinery Business Guides & News | Moonlight Machinery Blog",
  description:
    "Explore practical guides, business tips, and the latest insights about paper plate making machines and the manufacturing industry.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    title: "Machinery Business Guides & News | Moonlight Machinery Blog",
    description:
      "Practical guides and industry insights from Moonlight Machinery.",
    url: `${SITE_URL}/blog`,
    siteName: "Moonlight Machinery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonlight Machinery Blog",
    description:
      "Practical guides and industry insights from Moonlight Machinery.",
  },
};

export default async function BlogPage() {
  const posts = await getPublicBlogs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Moonlight Machinery Blog",
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.blog_title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.created_at,
      image: post.image_url || undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MainBlog posts={posts} />
    </>
  );
}
