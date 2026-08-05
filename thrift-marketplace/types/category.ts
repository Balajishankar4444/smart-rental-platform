// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  subcategories: string[];
  productCount: number;
}