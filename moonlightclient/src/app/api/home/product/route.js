import connectDB from "@/db/mongodb/db";
import Product from "@/db/mongodb/product/productModule_fixed";
import { Reggae_One } from "next/font/google";
// import { useParams } from "next/navigation";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const query = searchParams.get("query[query]");
        const pCategory = searchParams.get("query[pCategory]");
        const mType = searchParams.get("query[sCategory]");

        let filter = {};

        function escapeRegex(value) {
            return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        /*
         * CATEGORY + MACHINE TYPE FILTER
         */
        if (pCategory || mType) {
            const conditions = [];

            // -------------------------
            // CATEGORY
            // -------------------------
            if (pCategory) {
                const categoryValue = pCategory
                    .trim()
                    .replace(/-/g, " ")
                    .replace(/\s+/g, " ");

                const escapedCategory = escapeRegex(categoryValue);

                conditions.push({
                    category: {
                        $regex: `^${escapedCategory}$`,
                        $options: "i",
                    },
                });
            }

            // -------------------------
            // MACHINE TYPE
            // -------------------------
            if (mType) {
                const machineTypeValue = mType
                    .trim()
                    .split(/[-\s]+/)
                    .map(escapeRegex)
                    .join("[-\\s]+");

                conditions.push({
                    machineType: {
                        $regex: `^${machineTypeValue}$`,
                        $options: "i",
                    },
                });
            }

            filter = {
                $and: conditions,
            };
        }

        /*
         * GENERAL SEARCH
         */
        else if (query) {
            const searchTerm = query
                .trim()
                .replace(/-/g, " ")
                .replace(/\s+/g, " ");

            const escapedSearch = escapeRegex(searchTerm);

            const regex = new RegExp(escapedSearch, "i");

            filter = {
                $or: [
                    {
                        name: {
                            $regex: regex,
                        },
                    },
                    {
                        category: {
                            $regex: regex,
                        },
                    },
                    {
                        machineType: {
                            $regex: regex,
                        },
                    },
                ],
            };
        }

        console.log("FILTER:");
        console.log(JSON.stringify(filter, null, 2));

        const products = await Product.find(filter)
            .select({
                name: 1,
                slug: 1,
                sku: 1,
                pricing: 1,
                images: 1,
                category: 1,
                machineType: 1,
            })
            .lean();

        console.log("Query Results Count:", products.length);

        return NextResponse.json({
            success: true,
            message:
                products.length > 0
                    ? "Products fetched successfully"
                    : "No products found",
            item: products,
        });
    } catch (error) {
        console.error("Product API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
                error: error.message,
                item: [],
            },
            {
                status: 500,
            }
        );
    }
}
export async function POST(req) {
    await connectDB();

    // Access searchParams directly from req.nextUrl
    const { nextUrl } = req;
    const slug = nextUrl.searchParams.get("slug");

    const res = await Product.find({ slug: slug })

    return NextResponse.json({ message: "Product get successful", item: res });
}

