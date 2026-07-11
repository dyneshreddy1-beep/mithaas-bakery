export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  price: number; // in INR paise-free (rupees)
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  ingredients: string[];
  shelfLife: string;
  weights: { label: string; grams: number; priceMultiplier: number }[];
  nutrition: { label: string; value: string }[];
  isBestSeller?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  avatar: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: "Recipes" | "Festivals" | "Guides";
  author: string;
  date: string;
  body: string;
}

export interface CartItem {
  productId: string;
  weight: string;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
  items: { name: string; qty: number; price: number; image: string }[];
  total: number;
  address: string;
}

export interface Coupon {
  code: string;
  discount: number; // percent
  description: string;
}