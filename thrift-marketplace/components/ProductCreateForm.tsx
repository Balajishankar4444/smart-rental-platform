// components/ProductCreateForm.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ProductCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [subcategory, setSubcategory] = useState("Cameras");
  const [tagsInput, setTagsInput] = useState("camera, sony, 4k");
  const [condition, setCondition] = useState<"new" | "like_new" | "good" | "fair" | "refurbished">("like_new");
  const [quantity, setQuantity] = useState(1);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [purposes, setPurposes] = useState<("sell" | "rent" | "lease")[]>(["sell", "rent"]);

  // Pricing States
  const [sellingPrice, setSellingPrice] = useState(2400);
  const [pricePerDay, setPricePerDay] = useState(45);
  const [securityDeposit, setSecurityDeposit] = useState(150);
  const [monthlyLeasePrice, setMonthlyLeasePrice] = useState(180);

  // Media
  const [thumbnail, setThumbnail] = useState("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80");
  const [galleryUrl, setGalleryUrl] = useState("https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80");

  // Location
  const [city, setCity] = useState("Stuttgart");
  const [state, setState] = useState("Baden-Württemberg");
  const [country, setCountry] = useState("Germany");

  const handlePurposeToggle = (p: "sell" | "rent" | "lease") => {
    if (purposes.includes(p)) {
      if (purposes.length === 1) return; // Keep at least one
      setPurposes(purposes.filter((item) => item !== p));
    } else {
      setPurposes([...purposes, p]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      title,
      shortDescription,
      detailedDescription,
      brand,
      model,
      sku,
      category,
      subcategory,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      condition,
      quantity: Number(quantity),
      visibility,
      purpose: purposes,
      sellInfo: purposes.includes("sell") ? { sellingPrice: Number(sellingPrice), negotiable: true } : undefined,
      rentInfo: purposes.includes("rent") ? { pricePerDay: Number(pricePerDay), securityDeposit: Number(securityDeposit), lateReturnFee: 30, minRentalDuration: 1, maxRentalDuration: 30 } : undefined,
      leaseInfo: purposes.includes("lease") ? { monthlyLeasePrice: Number(monthlyLeasePrice), leaseDuration: 12, securityDeposit: Number(securityDeposit), maintenanceIncluded: true, insuranceIncluded: false, earlyTerminationFee: 150 } : undefined,
      media: {
        mainThumbnail: thumbnail,
        galleryImages: [galleryUrl],
        videos: [],
        documents: [],
      },
      location: {
        country,
        state,
        city,
        postalCode: "70173",
        street: "Königstraße 1",
        latitude: 48.7758,
        longitude: 9.1829,
        pickupAvailable: true,
        shippingAvailable: true,
      },
      specifications: [
        { attributeName: "Condition", attributeValue: condition },
      ],
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "user_stuttgart_01",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create listing");
      }

      setSuccess(`Listing successfully published! ID: ${data.data.id}`);
      setTimeout(() => {
        router.push(`/product/${data.data.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-950 font-sans py-12 px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB] font-heading mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Multi-Model Marketplace
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading sm:text-3xl">
            List a New Product (Sell / Rent / Lease)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Fill out the attributes below to publish your item across the platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Purpose Selector */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-700 font-heading">
              Select Business Purpose (Supports Multiple)
            </label>
            <div className="flex gap-3">
              {(["sell", "rent", "lease"] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePurposeToggle(p)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition cursor-pointer border ${
                    purposes.includes(p)
                      ? "bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-500/20"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-heading">Basic Information</h3>
            
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony Alpha a7 IV Mirrorless Camera"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Brand</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Sony"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Model</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="a7 IV"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">SKU</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SNY-A7IV"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Short Description</label>
              <input
                type="text"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="Comprehensive description of the item, accessories included, etc."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Conditional Pricing Blocks */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading">Pricing & Business Terms</h3>

            {purposes.includes("sell") && (
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <label className="mb-1 block text-xs font-bold text-[#2563EB]">Selling Price (€)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            {purposes.includes("rent") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-indigo-700">Price Per Day (€)</label>
                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-indigo-700">Security Deposit (€)</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            )}

            {purposes.includes("lease") && (
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                <label className="mb-1 block text-xs font-bold text-sky-700">Monthly Lease Price (€)</label>
                <input
                  type="number"
                  value={monthlyLeasePrice}
                  onChange={(e) => setMonthlyLeasePrice(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 outline-none focus:border-sky-600"
                />
              </div>
            )}
          </div>

          {/* Media & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading">Media & Location</h3>
            
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Thumbnail Image URL</label>
              <input
                type="url"
                required
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl cursor-pointer font-heading tracking-wide"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>Publish Product Listing</span>
          </button>

        </form>

      </div>
    </main>
  );
}