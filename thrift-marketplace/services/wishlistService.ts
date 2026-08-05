// services/wishlistService.ts
import { WISHLIST } from "../data/wishlist";
import { Product } from "../types/product";
import { PRODUCTS } from "../data/products";

export const wishlistService = {
  async getWishlist(userId: string): Promise<Product[]> {
    await new Promise((res) => setTimeout(res, 200));
    const userWishlist = WISHLIST.find((w) => w.userId === userId);
    if (!userWishlist) return [];
    return PRODUCTS.filter((p) => userWishlist.productIds.includes(p.id));
  },

  async toggleWishlist(userId: string, productId: string): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 200));
    let userWishlist = WISHLIST.find((w) => w.userId === userId);
    if (!userWishlist) {
      userWishlist = { userId, productIds: [] };
      WISHLIST.push(userWishlist);
    }
    const idx = userWishlist.productIds.indexOf(productId);
    if (idx > -1) {
      userWishlist.productIds.splice(idx, 1);
    } else {
      userWishlist.productIds.push(productId);
    }
    return userWishlist.productIds;
  },
};