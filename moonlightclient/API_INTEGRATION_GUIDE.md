/**
 * Example Usage Guide - ProductAPI Integration
 * 
 * This shows how to integrate the new productAPI.js service
 * into your AddpModal.jsx component
 */

// ============================================
// STEP 1: Import the API service
// ============================================
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  ProductAPIError
} from '@/services/admin/productAPI';

// ============================================
// STEP 2: Use in your component
// ============================================

/**
 * EXAMPLE: In your AddpModal component's saveDraft function
 */
async function saveDraft(e) {
  e.preventDefault();
  
  try {
    setIsSubmitting(true);
    setSubmitError('');
    
    // Build the payload
    const payload = buildPayload(draft);
    
    // CREATE or UPDATE
    let response;
    if (editingId) {
      // UPDATE existing product
      response = await updateProduct(editingId, payload);
      
      // Update products list optimistically
      setProducts(prev =>
        prev.map(p => p._id === editingId ? response.data : p)
      );
    } else {
      // CREATE new product
      response = await createProduct(payload);
      
      // Add new product optimistically
      setProducts(prev => [...prev, { ...payload, _id: response.productId }]);
    }
    
    // Success!
    setModalOpen(false);
    setDraft(emptyDraft);
    setEditingId(null);
    
  } catch (error) {
    if (error instanceof ProductAPIError) {
      // Handle API errors with details
      console.error('API Error:', error.status, error.details);
      
      if (error.status === 401) {
        setSubmitError('You are not authorized to perform this action');
      } else if (error.status === 400) {
        // Show validation errors
        const errorMessages = Array.isArray(error.details)
          ? error.details.join(', ')
          : error.details || error.message;
        setSubmitError(errorMessages);
      } else if (error.status === 409) {
        setSubmitError('A product with this SKU already exists');
      } else {
        setSubmitError(error.message || 'Failed to save product');
      }\n    } else {\n      // Network or other error\n      console.error('Unexpected error:', error);\n      setSubmitError('An unexpected error occurred. Please try again.');\n    }\n  } finally {\n    setIsSubmitting(false);\n  }\n}\n\n/**\n * EXAMPLE: Load products on component mount\n */\nfunction useEffect(() => {\n  async function loadProducts() {\n    try {\n      const result = await fetchProducts({\n        status: 'active',\n        limit: 50\n      });\n      setProducts(result.data);\n    } catch (error) {\n      console.error('Failed to load products:', error);\n    }\n  }\n  \n  loadProducts();\n}, []);\n\n/**\n * EXAMPLE: Delete a product\n */\nasync function handleDelete(productId) {\n  if (!confirm('Are you sure?')) return;\n  \n  try {\n    await deleteProduct(productId);\n    setProducts(prev => prev.filter(p => p._id !== productId));\n  } catch (error) {\n    if (error instanceof ProductAPIError) {\n      console.error('Delete failed:', error.message);\n    }\n  }\n}\n\n/**\n * EXAMPLE: Search/filter products\n */\nasync function handleFilter(category, status) {\n  try {\n    const result = await fetchProducts({\n      category,\n      status,\n      limit: 50\n    });\n    setProducts(result.data);\n  } catch (error) {\n    console.error('Failed to filter products:', error);\n  }\n}\n\n// ============================================\n// IMPORTANT: Authentication Setup\n// ============================================\n\n/**\n * Before using the API, implement getAuthToken() in productAPI.js\n * \n * Option 1: Using localStorage\n */\nfunction getAuthToken() {\n  if (typeof window !== 'undefined') {\n    return localStorage.getItem('authToken') || '';\n  }\n  return '';\n}\n\n/**\n * Option 2: Using cookies (more secure)\n */\nfunction getAuthToken() {\n  if (typeof document !== 'undefined') {\n    const cookies = document.cookie.split(';');\n    const authCookie = cookies.find(c => c.trim().startsWith('authToken='));\n    return authCookie ? authCookie.split('=')[1] : '';\n  }\n  return '';\n}\n\n/**\n * Option 3: Using Next.js getSession\n */\nimport { getSession } from 'next-auth/react';\n\nasync function getAuthToken() {\n  const session = await getSession();\n  return session?.accessToken || '';\n}\n\n// ============================================\n// ERROR HANDLING BEST PRACTICES\n// ============================================\n\n/**\n * Global error handler\n */\nfunction handleAPIError(error) {\n  if (!(error instanceof ProductAPIError)) {\n    return { message: 'An unexpected error occurred', showUser: false };\n  }\n  \n  switch (error.status) {\n    case 400:\n      // Validation error - show to user\n      return {\n        message: Array.isArray(error.details)\n          ? error.details.join(', ')\n          : error.message,\n        showUser: true\n      };\n    \n    case 401:\n      // Auth error\n      return {\n        message: 'Your session has expired. Please log in again.',\n        showUser: true,\n        action: () => redirectToLogin()\n      };\n    \n    case 404:\n      // Not found\n      return {\n        message: 'The item you\\'re looking for was not found',\n        showUser: true\n      };\n    \n    case 409:\n      // Conflict (e.g., duplicate SKU)\n      return {\n        message: error.message,\n        showUser: true\n      };\n    \n    case 500:\n      // Server error\n      return {\n        message: 'Server error. Our team has been notified.',\n        showUser: true,\n        logLevel: 'error'\n      };\n    \n    default:\n      // Other errors\n      return {\n        message: error.message || 'Something went wrong',\n        showUser: true\n      };\n  }\n}\n\n// ============================================\n// RETRY LOGIC (Optional but Recommended)\n// ============================================\n\n/**\n * Retry failed requests with exponential backoff\n */\nasync function retryWithBackoff(\n  fn,\n  maxRetries = 3,\n  baseDelay = 1000\n) {\n  for (let i = 0; i < maxRetries; i++) {\n    try {\n      return await fn();\n    } catch (error) {\n      if (i === maxRetries - 1) throw error;\n      \n      // Network errors are worth retrying\n      if (error instanceof ProductAPIError && error.status >= 500) {\n        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;\n        await new Promise(resolve => setTimeout(resolve, delay));\n      } else {\n        throw error; // Don't retry client errors\n      }\n    }\n  }\n}\n\n// Usage:\nawait retryWithBackoff(() => createProduct(payload));\n\n// ============================================\n// OPTIMIZATION: Batch Operations\n// ============================================\n\n/**\n * Delete multiple products at once\n */\nasync function deleteMultiple(productIds) {\n  const promises = productIds.map(id => \n    deleteProduct(id).catch(err => ({\n      productId: id,\n      error: err\n    }))\n  );\n  \n  const results = await Promise.allSettled(promises);\n  \n  const successful = results\n    .filter(r => r.status === 'fulfilled')\n    .map((r, i) => productIds[i]);\n  \n  const failed = results\n    .filter(r => r.status === 'rejected')\n    .map((r, i) => ({\n      productId: productIds[i],\n      error: r.reason\n    }));\n  \n  return { successful, failed };\n}\n\n// ============================================\n// TESTING\n// ============================================\n\n/**\n * Unit test example\n */\nimport { describe, it, expect, vi } from 'vitest';\n\ndescribe('ProductAPI', () => {\n  it('should create a product', async () => {\n    const mockFetch = vi.fn();\n    global.fetch = mockFetch;\n    \n    mockFetch.mockResolvedValueOnce({\n      ok: true,\n      json: () => Promise.resolve({\n        success: true,\n        productId: 'new-id'\n      })\n    });\n    \n    const result = await createProduct({\n      name: 'Test Product',\n      sku: 'TEST-001',\n      category: 'Paper Plate Making Machine',\n      basePrice: 1000,\n      stock: 50\n    });\n    \n    expect(result.success).toBe(true);\n  });\n});\n"}