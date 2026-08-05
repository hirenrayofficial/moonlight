import Mview from "@/component/machine/Mview";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.moonlightmachinery.com";

// Centralized helper using absolute URL for server-side fetching
async function getProduct(slug) {
  if (!slug) {
    return null; 
  }
  // fsdfsdfsd

  try {
    const res = await fetch(`${SITE_URL}/api/home/product?slug=${slug}`, {
      method: "POST",
      cache: "no-store", // Ensures fresh product data on request
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.item?.[0] || data?.[0] || null;
  } catch (error) {
    console.error("Server-side getProduct error:", error);
    return null;
  }
}

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product | Moonlight Machinery" };
  }

  const url = `${SITE_URL}/home/machines/${slug}`;
  const title = product.pageTitle?.trim() 
  const description =
    product.metaDescription?.trim() ||
    (product.description
      ? product.description.trim().slice(0, 155)
      : `Buy ${product.name} at best price from Moonlight Machinery.`);

  return {
    title,
    description,
    keywords: product.metaKeywords ,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: product.images?.[0] ? [{ url: product.images[0] }] : [] },
  };
}

// Main Page Server Component
export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const product = await getProduct(slug);

  const url = `${SITE_URL}/home/machines/${slug}`;

  // Structured Data (JSON-LD)
  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${url}#product`,
            name: product.name,
            image: product.images || [],
            description: product.description || "",
            sku: product.sku || product.slug,
            brand: { "@type": "Brand", name: "Moonlight Machinery" },
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: "INR",
              price: product.pricing?.basePrice || 0,
              availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Machines", item: `${SITE_URL}/home/machines` },
              { "@type": "ListItem", position: 3, name: product.name, item: url },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="w-full flex justify-center p-2">
        <Mview slug={slug} initialProduct={product} />
      </div>
    </>
  );
}










