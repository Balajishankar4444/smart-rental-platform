// validators/product.schema.ts

import { z } from "zod";

export const sellInfoSchema = z.object({
  sellingPrice: z.number().positive("Selling price must be greater than 0"),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  negotiable: z.boolean(),
  minimumOffer: z.number().positive().optional(),
});

export const rentInfoSchema = z.object({
  pricePerHour: z.number().positive().optional(),
  pricePerDay: z.number().positive().optional(),
  pricePerWeek: z.number().positive().optional(),
  pricePerMonth: z.number().positive().optional(),
  securityDeposit: z.number().min(0, "Security deposit cannot be negative"),
  lateReturnFee: z.number().min(0, "Late return fee cannot be negative"),
  minRentalDuration: z.number().int().positive("Minimum duration must be at least 1"),
  maxRentalDuration: z.number().int().positive("Maximum duration must be positive"),
  availabilityCalendarId: z.string().optional(),
});

export const leaseInfoSchema = z.object({
  monthlyLeasePrice: z.number().positive("Monthly lease price must be positive"),
  leaseDuration: z.number().int().positive("Lease duration in months must be positive"),
  securityDeposit: z.number().min(0),
  maintenanceIncluded: z.boolean(),
  insuranceIncluded: z.boolean(),
  earlyTerminationFee: z.number().min(0),
});

export const productMediaSchema = z.object({
  mainThumbnail: z.string().url("Main thumbnail must be a valid URL"),
  galleryImages: z.array(z.string().url("Gallery images must contain valid URLs")),
  videos: z.array(z.string().url()).optional().default([]),
  threeSixtyImages: z.array(z.string().url()).optional().default([]),
  documents: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      })
    )
    .optional()
    .default([]),
});

export const productLocationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  street: z.string().min(1, "Street is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pickupAvailable: z.boolean(),
  shippingAvailable: z.boolean(),
  shippingCost: z.number().min(0).optional(),
  deliveryRadiusKm: z.number().positive().optional(),
});

export const productSpecificationSchema = z.object({
  attributeName: z.string().min(1),
  attributeValue: z.union([z.string(), z.number(), z.boolean()]),
});

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  shortDescription: z.string().min(10).max(300),
  detailedDescription: z.string().min(20),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  condition: z.enum(["new", "like_new", "good", "fair", "refurbished"]),
  quantity: z.number().int().min(0),
  visibility: z.enum(["public", "private"]),
  purpose: z.array(z.enum(["sell", "rent", "lease"])).min(1, "Select at least one purpose"),
  sellInfo: sellInfoSchema.optional(),
  rentInfo: rentInfoSchema.optional(),
  leaseInfo: leaseInfoSchema.optional(),
  media: productMediaSchema,
  location: productLocationSchema,
  specifications: z.array(productSpecificationSchema),
}).superRefine((data, ctx) => {
  if (data.purpose.includes("sell") && !data.sellInfo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sell information is required when purpose includes 'sell'",
      path: ["sellInfo"],
    });
  }
  if (data.purpose.includes("rent") && !data.rentInfo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Rent information is required when purpose includes 'rent'",
      path: ["rentInfo"],
    });
  }
  if (data.purpose.includes("lease") && !data.leaseInfo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Lease information is required when purpose includes 'lease'",
      path: ["leaseInfo"],
    });
  }
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;