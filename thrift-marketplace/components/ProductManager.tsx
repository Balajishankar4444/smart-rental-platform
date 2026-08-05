// components/ProductManager.tsx

"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProductManager() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [createdProductId, setCreatedProductId] = useState("");

  // Sample payload for creating a multi-purpose product (Sell, Rent, Lease)
  const sampleProductPayload = {
    title: "Professional Sony Alpha a7 IV Kit",
    shortDescription: "Full-frame mirrorless camera for photo and video production.",
    detailedDescription: "This professional kit includes the Sony Alpha a7 IV camera body, 24-70mm f/2.8 GM lens, dual SD card slots, extra batteries, and a rugged transport case.",
    brand: "Sony",
    model: "a7 IV",
    sku: "SNY-A7IV-2470",
    category: "Electronics",
    subcategory: "Cameras",
    tags: ["camera", "sony", "mirrorless", "video"],
    condition: "like_new",
    quantity: 1,
    visibility: "public",
    purpose: ["sell", "rent", "lease"],
    sellInfo: {
      sellingPrice: 2400,
      discount: 100,
      tax: 19,
      negotiable: true,
      minimumOffer: 2200,
    },
    rentInfo: {
      pricePerDay: 45,
      pricePerWeek: 250,
      securityDeposit: 150,
      lateReturnFee: 30,
      minRentalDuration: 2,
      maxRentalDuration: 30,
    },
    leaseInfo: {
      monthlyLeasePrice: 180,
      leaseDuration: 12,
      securityDeposit: 300,
      maintenanceIncluded: true,
      insuranceIncluded: false,
      earlyTerminationFee: 200,
    },
    media: {
      mainThumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80"
      ],
      videos: [],
      documents: [],
    },
    location: {
      country: "Germany",
      state: "Baden-Württemberg",
      city: "Stuttgart",
      postalCode: "70173",
      street: "Königstraße 1",
      latitude: 48.7758,
      longitude: 9.1829,
      pickupAvailable: true,
      shippingAvailable: true,
      shippingCost: 15,
      deliveryRadiusKm: 50,
    },
    specifications: [
      { attributeName: "Sensor Resolution", attributeValue: "33 Megapixels" },
      { attributeName: "Lens Mount", attributeValue: "Sony E" },
      { attributeName: "Weight", attributeValue: "658g" },
    ],
  };

  const handleAddProduct = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user_stuttgart_01",
        },
        body: JSON.stringify(sampleProductPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create product");
      }

      setCreatedProductId(data.data.id);
      setSuccessMsg(`Product successfully created with ID: ${data.data.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during creation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!createdProductId) {
      setErrorMsg("No active product ID to delete. Please add a product first.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch(`/api/products/${createdProductId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": "user_stuttgart_01",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      setSuccessMsg(`Product ${createdProductId} deleted successfully (soft-deleted).`);
      setCreatedProductId("");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during deletion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-extrabold text-slate-950 font-heading mb-2">
        Product Lifecycle Manager (Add & Delete)
      </h2>
      <p className="text-xs text-slate-500 mb-6">
        Test the enterprise product creation route (with Zod validation for Sell, Rent, and Lease) and soft-deletion route.
      </p>

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer font-heading"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          <span>Create Sample Product</span>
        </button>

        <button
          onClick={handleDeleteProduct}
          disabled={loading || !createdProductId}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer font-heading"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span>Delete Created Product</span>
        </button>
      </div>

      {createdProductId && (
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
          <span className="font-bold text-slate-900">Current Session Product ID:</span>{" "}
          <code className="text-[#2563EB] font-mono">{createdProductId}</code>
        </div>
      )}
    </div>
  );
}