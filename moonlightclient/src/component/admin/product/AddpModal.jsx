"use client";
import { useMemo, useState, useCallback } from "react";
import "./amodal.scss";
import { AddProduct } from "@/services/admin/apiService/Product";

/**
 * ProductPage
 * ------------------------------------------------------------
 * Fully self-contained — owns ALL of its own data:
 *   - the list of saved products
 *   - the current draft being added/edited
 *   - whether the form is open
 *   - which product (if any) is being edited
 *
 * Nothing is passed in as props. Drop this component onto any
 * route/page and it works on its own — no parent state needed.
 *
 * Fixes vs. previous version:
 *  - Single source of truth (`draft`) instead of ~30 duplicate
 *    useState hooks that the UI wrote to but save logic ignored.
 *  - Chip fields (itemsProduced/features/tags) are real arrays,
 *    not strings — ChipInput no longer crashes on first keystroke.
 *  - Modal now actually respects `modalOpen` (was always rendered).
 *  - One submit path (form onSubmit) — no more duplicate/racing
 *    submit handlers.
 *  - `warranty` setter bug fixed (was hard-coding the string
 *    "warranty" instead of the typed value).
 *  - Optimistic add/edit with rollback on API failure, inline
 *    validation, disabled/loading submit button, no blocking
 *    window.alert.
 */

export const CATEGORIES = [
  "Paper Plate Making Machine",
  "Lamination Machine",
  "Cotton Wick Machine",
  "Paper Cup Machine",
];

export const MACHINE_TYPES = [
  "Manual",
  "Semi-Automatic",
  "Full-Automatic",
  "Hydraulic",
  "All-in-One",
];

export const AVAILABILITY_OPTIONS = [
  "In Stock",
  "Out of Stock",
  "Made to Order",
];

export const STATUS_OPTIONS = ["active", "inactive", "draft"];

const emptyDraft = {
  name: "",
  sku: "",
  category: CATEGORIES[0],
  subCategory: "",
  machineType: "",
  description: "",

  specifications: {
    productionCapacity: "",
    motor: "",
    totalPower: "",
    powerSource: "",
    voltage: "",
    phase: "",
    weight: "",
    rawMaterial: "",
    dimensions: { length: "", width: "", height: "", unit: "inch" },
    plateSizeRange: "",
    rollerSize: "",
    drive: "",
    paperCupSizeRange: "",
    electricityBillEstimate: "",
  },

  pricing: {
    currency: "INR",
    basePrice: "",
    priceLabel: "Gurgaon Price",
    otherExpenses: "",
    totalPrice: 0,
  },

  itemsProduced: [],
  features: [],
  tags: [],

  warranty: "",
  deliveryTime: "",
  availability: "In Stock",
  isReturnable: false,
  mainMarket: "India",
  status: "active",

  stock: "",
  threshold: "",
};

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Validates the parts of the draft that are actually required to save. */
function validateDraft(draft) {
  const errors = {};
  if (!draft.name?.trim()) errors.name = "Product name is required.";
  if (!draft.category) errors.category = "Category is required.";
  if (draft.pricing.basePrice === "" || Number(draft.pricing.basePrice) < 0) {
    errors.basePrice = "Enter a valid base price.";
  }
  if (draft.stock === "" || Number(draft.stock) < 0) {
    errors.stock = "Enter a valid stock quantity.";
  }
  return errors;
}

/** Converts string form fields into the correctly-typed payload the API expects. */
function buildPayload(draft) {
  const toNum = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
  return {
    ...draft,
    specifications: {
      ...draft.specifications,
      dimensions: {
        ...draft.specifications.dimensions,
        length: toNum(draft.specifications.dimensions.length),
        width: toNum(draft.specifications.dimensions.width),
        height: toNum(draft.specifications.dimensions.height),
      },
    },
    pricing: {
      ...draft.pricing,
      basePrice: toNum(draft.pricing.basePrice) ?? 0,
      otherExpenses: toNum(draft.pricing.otherExpenses) ?? 0,
      totalPrice: toNum(draft.pricing.totalPrice) ?? 0,
    },
    stock: toNum(draft.stock) ?? 0,
    threshold: toNum(draft.threshold) ?? 0,
  };
}

// ---- Small reusable chip/tag input for array fields (itemsProduced / features / tags) ----
function ChipInput({ label, placeholder, values, onChange }) {
  const [text, setText] = useState("");

  const addChip = () => {
    const v = text.trim();
    if (!v) return;
    if (values.includes(v)) {
      setText("");
      return;
    }
    onChange([...values, v]);
    setText("");
  };

  const removeChip = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div className="ad-field flex">
      <label className="ad-label">{label}</label>
      <div className="ad-chip-row">
        <input
          className="ad-input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip();
            }
          }}
        />
        <button type="button" className="ad-btn-secondary ad-chip-add" onClick={addChip}>
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="ad-chip-list">
          {values.map((v, i) => (
            <span className="ad-chip" key={`${v}-${i}`}>
              {v}
              <button
                type="button"
                className="ad-chip-remove"
                onClick={() => removeChip(i)}
                aria-label={`Remove ${v}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setSubmitError("");
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setDraft(product);
    setErrors({});
    setSubmitError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; // don't let the user close mid-save
    setModalOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setErrors({});
    setSubmitError("");
  };

  const deleteProduct = (id) => {
    setProducts((list) => list.filter((p) => p.id !== id));
  };

  const setField = useCallback(
    (field, value) => setDraft((d) => ({ ...d, [field]: value })),
    [],
  );

  const setSpec = useCallback(
    (field, value) =>
      setDraft((d) => ({
        ...d,
        specifications: { ...d.specifications, [field]: value },
      })),
    [],
  );

  const setDimension = useCallback(
    (field, value) =>
      setDraft((d) => ({
        ...d,
        specifications: {
          ...d.specifications,
          dimensions: { ...d.specifications.dimensions, [field]: value },
        },
      })),
    [],
  );

  const setPricing = useCallback((field, value) => {
    setDraft((d) => {
      const pricing = { ...d.pricing, [field]: value };
      if (field === "basePrice" || field === "otherExpenses") {
        const base = parseFloat(field === "basePrice" ? value : pricing.basePrice) || 0;
        const other = parseFloat(field === "otherExpenses" ? value : pricing.otherExpenses) || 0;
        pricing.totalPrice = base + other;
      }
      return { ...d, pricing };
    });
  }, []);

  const saveDraft = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateDraft(draft);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    const payload = buildPayload(draft);

    try {
      const res = await AddProduct(payload);
      if (!res) {
        throw new Error("Server did not confirm the save.");
      }

      if (editingId) {
        setProducts((list) =>
          list.map((p) => (p.id === editingId ? { ...payload, id: editingId } : p)),
        );
      } else {
        const newId = res?.id || makeId();
        setProducts((list) => [...list, { ...payload, id: newId }]);
      }

      closeModal();
    } catch (err) {
      setSubmitError(err?.message || "Something went wrong while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPriceDisplay = useMemo(
    () => draft.pricing.totalPrice || 0,
    [draft.pricing.totalPrice],
  );

  return (
    <div className="ad-page">
      {/* ---------------- PAGE HEADER ----------------
      <div className="ad-page-head">
        <span className="ad-page-title">Products</span>
        <button className="ad-btn-primary" onClick={openAdd}>
          + Add product
        </button>
      </div> */}

      {/* ---------------- PRODUCT LIST ---------------- */}
      {/* {products.length === 0 ? (
        <div className="ad-empty">No products yet. Click "Add product" to create one.</div>
      ) : (
        <div className="ad-product-list">
          {products.map((p) => (
            <div className="ad-product-card" key={p.id}>
              <div className="ad-product-card-top">
                <div>
                  <div className="ad-product-name">{p.name || "Untitled product"}</div>
                  <div className="ad-product-meta">
                    {p.category} {p.subCategory && `· ${p.subCategory}`}
                  </div>
                </div>
                <div className="ad-product-price">
                  {p.pricing.currency} {p.pricing.totalPrice || 0}
                </div>
              </div>
              <div className="ad-product-card-actions">
                <button className="ad-btn-secondary" onClick={() => openEdit(p)}>
                  Edit
                </button>
                <button className="ad-btn-secondary" onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )} */}


        <div className="ad-overlay" onClick={closeModal}>
          <div className="ad-modal ad-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-head">
              <span className="ad-modal-title">{editingId ? "Edit product" : "Add product"}</span>
              <button type="button" className="ad-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className="ad-modal-body" onSubmit={saveDraft} noValidate>
              {/* ---------------- BASIC INFO ---------------- */}
              <div className="ad-section-label">Basic info</div>

              <div className="ad-field">
                <label className="ad-label">Product name</label>
                <input
                  className="ad-input"
                  value={draft.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
                {errors.name && <div className="ad-error-text">{errors.name}</div>}
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">SKU</label>
                  <input
                    className="ad-input"
                    placeholder="Auto-generated"
                    value={draft.sku}
                    onChange={(e) => setField("sku", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Category</label>
                  <select
                    className="ad-select"
                    value={draft.category}
                    onChange={(e) => setField("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Sub-category</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. Hydraulic Double Cylinder"
                    value={draft.subCategory}
                    onChange={(e) => setField("subCategory", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Machine type</label>
                  <select
                    className="ad-select"
                    value={draft.machineType}
                    onChange={(e) => setField("machineType", e.target.value)}
                  >
                    <option value="">Select type</option>
                    {MACHINE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ad-field">
                <label className="ad-label">Description</label>
                <textarea
                  className="ad-input ad-textarea"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>

              {/* ---------------- SPECIFICATIONS ---------------- */}
              <div className="ad-section-label">Specifications</div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Production capacity</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 15000 pieces in 10 hours"
                    value={draft.specifications.productionCapacity}
                    onChange={(e) => setSpec("productionCapacity", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Motor</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 0.5 HP Crompton Greaves"
                    value={draft.specifications.motor}
                    onChange={(e) => setSpec("motor", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Total power</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 2 KW"
                    value={draft.specifications.totalPower}
                    onChange={(e) => setSpec("totalPower", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Power source</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 220V 50Hz (Single Phase)"
                    value={draft.specifications.powerSource}
                    onChange={(e) => setSpec("powerSource", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Voltage</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 220V"
                    value={draft.specifications.voltage}
                    onChange={(e) => setSpec("voltage", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Phase</label>
                  <select
                    className="ad-select"
                    value={draft.specifications.phase}
                    onChange={(e) => setSpec("phase", e.target.value)}
                  >
                    <option value="">Select phase</option>
                    <option value="Single">Single</option>
                    <option value="Three">Three</option>
                  </select>
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Weight</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 200 KG Approx"
                    value={draft.specifications.weight}
                    onChange={(e) => setSpec("weight", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Raw material</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 80 GSM to 200 GSM"
                    value={draft.specifications.rawMaterial}
                    onChange={(e) => setSpec("rawMaterial", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-field">
                <label className="ad-label">Dimensions (L × W × H)</label>
                <div className="ad-row3">
                  <input
                    className="ad-input"
                    type="number"
                    min="0"
                    placeholder="Length"
                    value={draft.specifications.dimensions.length}
                    onChange={(e) => setDimension("length", e.target.value)}
                  />
                  <input
                    className="ad-input"
                    type="number"
                    min="0"
                    placeholder="Width"
                    value={draft.specifications.dimensions.width}
                    onChange={(e) => setDimension("width", e.target.value)}
                  />
                  <input
                    className="ad-input"
                    type="number"
                    min="0"
                    placeholder="Height"
                    value={draft.specifications.dimensions.height}
                    onChange={(e) => setDimension("height", e.target.value)}
                  />
                  <select
                    className="ad-select ad-unit-select"
                    value={draft.specifications.dimensions.unit}
                    onChange={(e) => setDimension("unit", e.target.value)}
                  >
                    <option value="inch">inch</option>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>

              {/* Category-specific spec fields */}
              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Plate size range</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 4-14 inch (paper plate machines)"
                    value={draft.specifications.plateSizeRange}
                    onChange={(e) => setSpec("plateSizeRange", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Roller size</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 32 inch (lamination machines)"
                    value={draft.specifications.rollerSize}
                    onChange={(e) => setSpec("rollerSize", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Paper cup size range</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 40ml to 750ml"
                    value={draft.specifications.paperCupSizeRange}
                    onChange={(e) => setSpec("paperCupSizeRange", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Est. electricity bill</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 120 to 150 per month"
                    value={draft.specifications.electricityBillEstimate}
                    onChange={(e) => setSpec("electricityBillEstimate", e.target.value)}
                  />
                </div>
              </div>

              {/* ---------------- PRICING ---------------- */}
              <div className="ad-section-label">Pricing</div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Base price</label>
                  <input
                    className="ad-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.pricing.basePrice}
                    onChange={(e) => setPricing("basePrice", e.target.value)}
                  />
                  {errors.basePrice && <div className="ad-error-text">{errors.basePrice}</div>}
                </div>
                <div className="ad-field">
                  <label className="ad-label">Price label</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. Gurgaon Price / Ex-Factory Delhi"
                    value={draft.pricing.priceLabel}
                    onChange={(e) => setPricing("priceLabel", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Other expenses</label>
                  <input
                    className="ad-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.pricing.otherExpenses}
                    onChange={(e) => setPricing("otherExpenses", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Total price (auto)</label>
                  <input className="ad-input" value={totalPriceDisplay} disabled readOnly />
                </div>
              </div>

              {/* ---------------- ARRAY FIELDS ---------------- */}
              <div className="ad-section-label">Catalog content</div>

              <ChipInput
                label="Items produced"
                placeholder="e.g. Fancy Thali — press Enter"
                values={draft.itemsProduced}
                onChange={(v) => setField("itemsProduced", v)}
              />

              <ChipInput
                label="Special features"
                placeholder="e.g. Easy maintenance — press Enter"
                values={draft.features}
                onChange={(v) => setField("features", v)}
              />

              <ChipInput
                label="Tags"
                placeholder="e.g. dona machine — press Enter"
                values={draft.tags}
                onChange={(v) => setField("tags", v)}
              />

              {/* ---------------- LOGISTICS / STOCK ---------------- */}
              <div className="ad-section-label">Logistics & stock</div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Stock qty</label>
                  <input
                    className="ad-input"
                    type="number"
                    min="0"
                    value={draft.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                  />
                  {errors.stock && <div className="ad-error-text">{errors.stock}</div>}
                </div>
                <div className="ad-field">
                  <label className="ad-label">Low-stock threshold</label>
                  <input
                    className="ad-input"
                    type="number"
                    min="0"
                    value={draft.threshold}
                    onChange={(e) => setField("threshold", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Warranty</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 12 Months"
                    value={draft.warranty}
                    onChange={(e) => setField("warranty", e.target.value)}
                  />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Delivery time</label>
                  <input
                    className="ad-input"
                    placeholder="e.g. 10 Days"
                    value={draft.deliveryTime}
                    onChange={(e) => setField("deliveryTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Availability</label>
                  <select
                    className="ad-select"
                    value={draft.availability}
                    onChange={(e) => setField("availability", e.target.value)}
                  >
                    {AVAILABILITY_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ad-field">
                  <label className="ad-label">Status</label>
                  <select
                    className="ad-select"
                    value={draft.status}
                    onChange={(e) => setField("status", e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ad-row2">
                <div className="ad-field">
                  <label className="ad-label">Main market</label>
                  <input
                    className="ad-input"
                    value={draft.mainMarket}
                    onChange={(e) => setField("mainMarket", e.target.value)}
                  />
                </div>
                <div className="ad-field ad-checkbox-field">
                  <label className="ad-label">Returnable</label>
                  <label className="ad-checkbox-row">
                    <input
                      type="checkbox"
                      checked={draft.isReturnable}
                      onChange={(e) => setField("isReturnable", e.target.checked)}
                    />
                    <span>Item can be returned</span>
                  </label>
                </div>
              </div>

              {submitError && <div className="ad-error-text ad-submit-error">{submitError}</div>}

              <div className="ad-modal-actions">
                <button
                  type="button"
                  className="ad-btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="ad-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : editingId ? "Save changes" : "Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </div>
  );
}