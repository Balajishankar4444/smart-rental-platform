export function listingsStorageKey(userId: string) {
  return `my_listings:${userId}`;
}

export function deletedListingsStorageKey(userId: string) {
  return `deleted_listings:${userId}`;
}
