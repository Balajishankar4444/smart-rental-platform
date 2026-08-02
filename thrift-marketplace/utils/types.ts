export interface Product {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  marketValue: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  owner: {
    name: string;
    badge: string;
    image: string;
  };
  image: string;
  verified: boolean;
}

export interface Category {
  name: string;
  slug: string;
  iconName: string;
  count: string;
}