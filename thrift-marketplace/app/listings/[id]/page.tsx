// app/list-item/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { Zap, ShieldCheck, Plus, Trash2 } from "lucide-react";

export default function ListItemPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    productName: "",
    category: "Cameras",
    subcategory: "Mirrorless",
    brand: "",
    model: "",
    condition: "Like New",
    age: "",
    dailyPrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    securityDeposit: "",
    lateReturnFee: "",
    city: "",
    state: "",
    address: "",
    instantBooking: true,
    description: "",
    usageInstructions: "",
    weight: "",
    color: "",
    dimensions: "",
    warranty: true,
    pickupTime: "Flexible",
    deliveryAvailable: true,
    accessoriesInput: "",
  });

  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        userId: user.id,
        ...formData,
        images,
        accessoriesIncluded: formData.accessoriesInput,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/auth/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to create listing");
      }

      router.push(`/listings/${result.data.id}`);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-[#2563EB] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-[800px] mx-auto w-full space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
            List an Item for Rent
          </h1>
          <p className="text-xs text-slate-500">
            Share your gear securely on RentIt, set your pricing, and start earning.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-heading">Basic Information</h2>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Product Title</label>
              <input
                type="text"
                name="productName"
                required
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Sony Alpha 7IV Mirrorless Camera"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="Cameras">Cameras</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Drones">Drones</option>
                  <option value="Audio">Audio</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Sony"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Description</label>
              <textarea
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe features, usage, and condition details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB] resize-none"
              />
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-heading">Pricing & Security Deposit</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Daily Price (₹)</label>
                <input
                  type="number"
                  name="dailyPrice"
                  required
                  value={formData.dailyPrice}
                  onChange={handleChange}
                  placeholder="850"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Weekly Price (₹)</label>
                <input
                  type="number"
                  name="weeklyPrice"
                  value={formData.weeklyPrice}
                  onChange={handleChange}
                  placeholder="4800"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Security Deposit (₹)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  required
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="3000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Location & Pickup */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-heading">Location & Pickup</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">City / Region</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, KA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Area / Landmark</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Indiranagar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-heading">Images</h2>
            
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Publishing listing..." : "Publish Listing"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}