// data/wishlist.ts
export const WISHLIST: { userId: string; productIds: string[] }[] = Array.from({ length: 50 }, (_, i) => ({
  userId: `user-${i + 1}`,
  productIds: [`prod-${(i % 500) + 1}`, `prod-${((i + 15) % 500) + 1}`, `prod-${((i + 30) % 500) + 1}`],
}));