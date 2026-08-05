// services/searchService.ts
import { Product } from "../types/product";
import { PRODUCTS } from "../data/products";

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  rating?: number;
}

export const searchService = {
  async searchProducts(filters: SearchFilters): Promise<Product[]> {
    await new Promise((res) => setTimeout(res, 300));
    return PRODUCTS.filter((p) => {
      if (filters.query && !p.title.toLowerCase().includes(filters.query.toLowerCase()) && !p.description.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }
      if (filters.category && p.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
      if (filters.city && p.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
      if (filters.minPrice && p.pricePerDay < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && p.pricePerDay > filters.maxPrice) {
        return false;
      }
      if (filters.condition && p.condition !== filters.condition) {
        return false;
      }
      if (filters.rating && p.rating < filters.rating) {
        return false;
      }
      return true;
    });
  },
};