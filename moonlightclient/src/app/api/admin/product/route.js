
import connectDB from '@/db/mongodb/db';
import Product from '@/db/mongodb/product/productModule_fixed';
import { NextResponse } from 'next/server';

// Verify admin session/authentication
async function verifyAdminAuth(req) {
  try {
    const session = req.headers.get('authorization');
    if (!session || !session.startsWith('Bearer ')) {
      return null;
    }
    return true; // Replace with actual session verification
  } catch (error) {
    return null;
  }
}

// Helper function to scrub empty strings and format numbers safely
const cleanPayload = (data) => {
  const cleaned = {};
  const numericFields = ['basePrice', 'currentStock', 'stock', 'totalPrice', 'length', 'width', 'height', 'weight', 'otherExpenses'];

  for (const [key, value] of Object.entries(data)) {
    if (value === "" || value === null || value === undefined) {
      cleaned[key] = null;
    } else if (numericFields.includes(key) && !isNaN(value)) {
      cleaned[key] = Number(value);
    } else if (Array.isArray(value)) {
      cleaned[key] = value.filter(v => v); // Remove empty array items
    } else {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return cleaned;
};

// Validation schema
const validateProduct = (data) => {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Product name is required');
  }
  if (!data.sku || !data.sku.trim()) {
    errors.push('SKU is required');
  }
  if (!data.category || !data.category.trim()) {
    errors.push('Category is required');
  }
  // if (data.basePrice === null || data.basePrice === undefined) {
  //   errors.push('Base price must be a valid positive number');
  // }
  if (data.stock === null || data.stock === undefined || Number(data.stock) < 0) {
    errors.push('Stock must be a valid positive number');
  }
  if (data.name && data.name.length > 200) {
    errors.push('Product name must be less than 200 characters');
  }

  return errors;
};

export async function POST(req) {
  try {
    // Verify admin authentication
    // const isAdmin = await verifyAdminAuth(req);
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized access' },
    //     { status: 401 }
    //   );
    // }

    // Parse and validate request
    const body = await req.json();
    const { rawPayload } = body;
    console.log(rawPayload)

    if (!rawPayload) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    // Clean and validate payload
    const sanitizedData = cleanPayload(rawPayload);
    const validationErrors = validateProduct(sanitizedData);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check for duplicate SKU
    const existingSku = await Product.findOne({ sku: sanitizedData.sku });
    if (existingSku) {
      return NextResponse.json(
        { success: false, error: 'A product with this SKU already exists.' },
        { status: 409 }
      );
    }


    const newProduct = new Product(rawPayload)

    await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Product saved successfully!',
        productId: newProduct._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Product creation error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: messages },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A product with this SKU already exists.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save product data.' },
      { status: 500 }
    );
  }
}

// GET - Retrieve products
// export async function GET(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const category = searchParams.get('category');
//     const status = searchParams.get('status');
//     const limit = parseInt(searchParams.get('limit') || '50', 10);
//     const skip = parseInt(searchParams.get('skip') || '0', 10);

//     const query = {};
//     if (category) query.category = category;
//     if (status) query.status = status;

//     const products = await Product.find(query)
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .skip(skip);

//     const total = await Product.countDocuments(query);

//     return NextResponse.json(
//       {
//         success: true,
//         data: products,
//         pagination: { total, limit, skip },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Product retrieval error:', error.message);
//     return NextResponse.json(
//       { success: false, error: 'Failed to retrieve products.' },
//       { status: 500 }
//     );
//   }
// }
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: { total, limit, skip },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product retrieval error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products.' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(req) {
  try {
    const isAdmin = await verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId, rawPayload } = body;

    if (!productId || !rawPayload) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: productId and payload required' },
        { status: 400 }
      );
    }

    const sanitizedData = cleanPayload(rawPayload);
    const validationErrors = validateProduct(sanitizedData);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      sanitizedData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product updated successfully!',
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product update error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to update product.' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product
export async function DELETE(req) {
  try {
    const isAdmin = await verifyAdminAuth(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product deletion error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product.' },
      { status: 500 }
    );
  }
}