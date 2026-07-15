import axios from "axios";

const PRODUCT_ENDPOINT = "/api/admin/product";

async function request(fn) {
  try {
    const res = await fn();
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Network error';
    throw new Error(message);
  }
}

export async function findProducts() {
  return await request(() => axios.get(PRODUCT_ENDPOINT));
}

export async function createProduct(productData) {
  return await request(() =>
    axios.post(PRODUCT_ENDPOINT, {
      rawPayload: productData,
    }),
  );
}

export async function updateProduct(productId, productData) {
  return await request(() =>
    axios.put(PRODUCT_ENDPOINT, {
      productId,
      rawPayload: productData,
    }),
  );
}

export async function deleteProduct(productId) {
  return await request(() => axios.delete(`${PRODUCT_ENDPOINT}?id=${productId}`));
}
