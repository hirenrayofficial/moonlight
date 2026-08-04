import axios from "axios";

// Works in browser (relative URL is fine) AND on the server.
// Server-side code needs an absolute URL when using axios.
function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export const getItem = async () => {
  try {
    const res = await axios.get(`${getBaseUrl()}/api/home/product`);
    return res?.data?.item;
  } catch (err) {
    console.error("getItem failed:", err.message);
    return null;
  }
};

export const getspcItem = async (slug) => {
  try {
    const res = await axios.post(
      `${getBaseUrl()}/api/home/product?slug=${slug}`
    );
    return res?.data?.item;
  } catch (err) {
    console.error("getspcItem failed for slug:", slug, err.message);
    return null; // caller already handles falsy -> notFound()
  }
};

export const getRelatedItem = async (type) => {
  try {
    const res = await axios.post(
      `${getBaseUrl()}/api/home/productrelated?type=${type}`
    );
    return res?.data?.item;
  } catch (err) {
    console.error("getRelatedItem failed for type:", type, err.message);
    return null;
  }
};

export const slider = async () => {
  try {
    const res = await axios.get(`${getBaseUrl()}/api/home/product/slider`);
    return res?.data?.item; // note: original had a typo `res.data.itema`
  } catch (err) {
    console.error("slider failed:", err.message);
    return null;
  }
};