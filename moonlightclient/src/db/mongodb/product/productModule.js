import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true, // Optimized for search/lookups
    },
    slug: { 
      type: String, 
      unique: true, 
      index: true // Critical for ultra-fast fetching in Next.js dynamic routes (/products/[slug])
    },
    sku: {
      type: String,
      unique: true, // Ensures uniqueness if provided
      sparse: true, // Allows multiple documents to have an empty/null SKU without conflict
      trim: true,
    },
    category: {
      type: String,
      default: '',
      trim: true,
      index: true, // Fast filtering by category
    },
    subCategory: {
      type: String,
      default: '',
      trim: true,
    },
    machineType: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    length: { // Fixed casing
      type: String, 
      default: '',
    },
    productionCapacity: { // Fixed casing
      type: String, 
      default: '',
    },
    availability: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number, 
      default: 0,
      index: true, // Fast sorting by price (low to high / high to low)
    },
    currentStock: { // Normalized key name
      type: Number,
      default: 0,
    },
    deliveryTime: { // Fixed typo 'delavieryTime'
      type: String, 
      default: '',
    },
    etcBill: { // Fixed casing
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    itemProduced: {
      type: String,
      default: '',
    },
    itemFeature: { // Fixed casing
      type: String,
      default: '',
    },
    market: {
      type: String,
      default: '',
    },
    motor: {
      type: String,
      default: '',
    },
    otherExpenses: {
      type: String,
      default: '',
    },
    paperCupSizeRange: {
      type: String,
      default: '',
    },
    phase: {
      type: String,
      default: '',
    },
    plateSizeRange: {
      type: String,
      default: '',
    },
    priceLabel: {
      type: String,
      default: '',
    },
    rawMaterial: { // Fixed typo 'rawMatirial'
      type: String, 
      default: '',
    },
    returnable: {
      type: Boolean, // Converted to Boolean for faster logic checks
      default: false,
    },
    rollerSize: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'out_of_stock', 'archived'], // Limits inputs to valid states
      default: 'active', 
      index: true, // Crucial: You will almost always filter by status: 'active'
    },
    stock: {
      type: Number, 
      default: 0,
    },
    tags: {
      type: [String], // Converted to an Array of strings for tag-filtering capabilities
      default: [],
    },
    totalPower: {
      type: String,
      default: '',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '',
    },
    voltage: {
      type: String,
      default: '',
    },
    warranty: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
  }
);

// Compound Index: Optimizes performance when users filter by category AND status simultaneously
ProductSchema.index({ category: 1, status: 1 });

// Text Index: Allows fast keyword searches across Name, Description, and Tags
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;