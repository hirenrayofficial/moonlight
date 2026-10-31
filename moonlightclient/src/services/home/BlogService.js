import axios from "axios";
const SITE_URL =  "https://www.moonlightmachinery.com";

export async function getProduct(slug) {
    // console.log(slug)
    if (!slug) {
        return null;
    }

    try {
        // 1st arg: URL, 2nd arg: Request Body (empty object since you use query params), 3rd arg: Config
        const res = await axios.post(`${SITE_URL}/api/home/blog/get?slug=${slug}`, {});

        // Axios stores parsed response data in res.data
        // Since Supabase .single() returns a single object, item is an object (not an array)
        return res.data?.item || null;
    } catch (error) {
        console.error("Server-side getProduct error:", error?.response?.data || error.message);
        return null;
    }
}