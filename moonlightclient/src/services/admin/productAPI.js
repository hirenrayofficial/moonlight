// /**
//  * Product API Service
//  * Handles all product-related API calls with proper error handling,
//  * validation, and request formatting
//  */

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
// const PRODUCT_ENDPOINT = `${API_BASE}/api/admin/product`;

// export class ProductAPIError extends Error {
//   constructor(message, status, details) {
//     super(message);
//     this.name = 'ProductAPIError';
//     this.status = status;
//     this.details = details;
//   }
// }

// /**
//  * Fetch products with optional filters
//  */
// export async function fetchProducts(options = {}) {
//   try {
//     const { category, status, limit = 50, skip = 0 } = options;
    
//     const params = new URLSearchParams();
//     if (category) params.append('category', category);
//     if (status) params.append('status', status);
//     params.append('limit', limit);
//     params.append('skip', skip);

//     const response = await fetch(`${PRODUCT_ENDPOINT}?${params.toString()}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new ProductAPIError(\n        error.error || 'Failed to fetch products',\n        response.status,\n        error.details\n      );\n    }

//     return await response.json();\n  } catch (error) {\n    if (error instanceof ProductAPIError) throw error;\n    throw new ProductAPIError('Network error fetching products', 500, error.message);\n  }\n}\n\n/**\n * Create a new product\n */\nexport async function createProduct(productData) {\n  try {\n    if (!productData.name || !productData.sku) {\n      throw new ProductAPIError(\n        'Product name and SKU are required',\n        400,\n        { name: !productData.name && 'Name required', sku: !productData.sku && 'SKU required' }\n      );\n    }\n\n    const response = await fetch(PRODUCT_ENDPOINT, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': `Bearer ${getAuthToken()}`,\n      },\n      body: JSON.stringify({\n        rawPayload: productData,\n      }),\n    });\n\n    const result = await response.json();\n\n    if (!response.ok) {\n      throw new ProductAPIError(\n        result.error || 'Failed to create product',\n        response.status,\n        result.details || result.errors\n      );\n    }\n\n    return result;\n  } catch (error) {\n    if (error instanceof ProductAPIError) throw error;\n    throw new ProductAPIError('Network error creating product', 500, error.message);\n  }\n}\n\n/**\n * Update an existing product\n */\nexport async function updateProduct(productId, productData) {\n  try {\n    if (!productId) {\n      throw new ProductAPIError('Product ID is required', 400);\n    }\n\n    const response = await fetch(PRODUCT_ENDPOINT, {\n      method: 'PUT',\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': `Bearer ${getAuthToken()}`,\n      },\n      body: JSON.stringify({\n        productId,\n        rawPayload: productData,\n      }),\n    });\n\n    const result = await response.json();\n\n    if (!response.ok) {\n      throw new ProductAPIError(\n        result.error || 'Failed to update product',\n        response.status,\n        result.details || result.errors\n      );\n    }\n\n    return result;\n  } catch (error) {\n    if (error instanceof ProductAPIError) throw error;\n    throw new ProductAPIError('Network error updating product', 500, error.message);\n  }\n}\n\n/**\n * Delete a product\n */\nexport async function deleteProduct(productId) {\n  try {\n    if (!productId) {\n      throw new ProductAPIError('Product ID is required', 400);\n    }\n\n    const response = await fetch(`${PRODUCT_ENDPOINT}?id=${productId}`, {\n      method: 'DELETE',\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': `Bearer ${getAuthToken()}`,\n      },\n    });\n\n    const result = await response.json();\n\n    if (!response.ok) {\n      throw new ProductAPIError(\n        result.error || 'Failed to delete product',\n        response.status\n      );\n    }\n\n    return result;\n  } catch (error) {\n    if (error instanceof ProductAPIError) throw error;\n    throw new ProductAPIError('Network error deleting product', 500, error.message);\n  }\n}\n\n/**\n * Get authentication token from session\n */\nfunction getAuthToken() {\n  // TODO: Implement your session/auth logic here\n  // This could fetch from sessionStorage, localStorage, or cookies\n  if (typeof window !== 'undefined') {\n    const token = localStorage.getItem('authToken');\n    return token || '';\n  }\n  return '';\n}
