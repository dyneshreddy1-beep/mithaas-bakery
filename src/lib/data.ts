import type { BlogPost, Category, Product, Store, Testimonial, Order } from "./types";
import kaju from "@/assets/p-kaju.jpg";
import laddu from "@/assets/p-laddu.jpg";
import mysore from "@/assets/p-mysore.jpg";
import rasgulla from "@/assets/p-rasgulla.jpg";
import dryfruit from "@/assets/p-dryfruit.jpg";
import milkcake from "@/assets/p-milkcake.jpg";
import peda from "@/assets/p-peda.jpg";
import rasmalai from "@/assets/p-rasmalai.jpg";
import giftbox from "@/assets/p-giftbox.jpg";
import badam from "@/assets/p-badam.jpg";

export const productImages = {
  kaju, laddu, mysore, rasgulla, dryfruit, milkcake, peda, rasmalai, giftbox, badam,
};

export const categories: Category[] = [
  { id: "c1", slug: "kaju-sweets", name: "Kaju Sweets", description: "Cashew delicacies wrapped in silver leaf." },
  { id: "c2", slug: "milk-sweets", name: "Milk Sweets", description: "Slow-simmered classics from pure khoya." },
  { id: "c3", slug: "dry-fruit", name: "Dry Fruit", description: "Rich, nutty indulgences for every occasion." },
  { id: "c4", slug: "namkeen", name: "Namkeen", description: "Crisp, savoury blends from cast-iron kadhais." },
  { id: "c5", slug: "pickles", name: "Pickles", description: "Sun-cured heirloom achaars in mustard oil." },
  { id: "c6", slug: "bakery", name: "Bakery", description: "Fresh cookies, cakes and Indian bakes." },
  { id: "c7", slug: "gift-hampers", name: "Gift Hampers", description: "Festive boxes finished by hand." },
];

const defaultWeights = [
  { label: "250 g", grams: 250, priceMultiplier: 1 },
  { label: "500 g", grams: 500, priceMultiplier: 1.9 },
  { label: "1 kg", grams: 1000, priceMultiplier: 3.6 },
];

const defaultNutrition = [
  { label: "Energy", value: "480 kcal / 100g" },
  { label: "Protein", value: "7.2 g" },
  { label: "Carbs", value: "56 g" },
  { label: "Fat", value: "24 g" },
  { label: "Sugar", value: "38 g" },
];

export const products: Product[] = [
  {
    id: "p1", slug: "kaju-katli", name: "Kaju Katli",
    category: "kaju-sweets", price: 720, mrp: 899, rating: 4.9, reviews: 1284,
    image: kaju, gallery: [kaju, giftbox, laddu],
    shortDescription: "Diamond-cut cashew fudge finished with edible silver leaf.",
    description: "Our signature Kaju Katli is crafted from single-origin Ratnagiri cashews, slow-ground on stone and gently cooked in copper vessels. Every diamond is hand-cut and finished with pure edible silver varak for that unmistakable, melt-in-your-mouth finish.",
    ingredients: ["Cashew nuts", "Cane sugar", "Cardamom", "Edible silver leaf", "A2 cow ghee"],
    shelfLife: "15 days from packaging, refrigerate for best taste.",
    weights: defaultWeights, nutrition: defaultNutrition,
    isBestSeller: true, tags: ["Bestseller", "Gluten-free"],
  },
  {
    id: "p2", slug: "motichoor-laddu", name: "Motichoor Laddu",
    category: "milk-sweets", price: 540, mrp: 640, rating: 4.8, reviews: 926,
    image: laddu, gallery: [laddu, peda, kaju],
    shortDescription: "Golden pearls of boondi bound in saffron syrup and ghee.",
    description: "Tiny boondi pearls, fried in slow-clarified ghee and bound in cardamom-saffron syrup. Rolled by hand while warm, our motichoor laddus are melt-soft with a fragrant, floral finish.",
    ingredients: ["Bengal gram flour", "Cane sugar", "A2 ghee", "Saffron", "Cardamom", "Melon seeds"],
    shelfLife: "7 days, best served at room temperature.",
    weights: defaultWeights, nutrition: defaultNutrition,
    isBestSeller: true, tags: ["Bestseller"],
  },
  {
    id: "p3", slug: "mysore-pak", name: "Royal Mysore Pak",
    category: "milk-sweets", price: 480, mrp: 599, rating: 4.7, reviews: 512,
    image: mysore, gallery: [mysore, badam, kaju],
    shortDescription: "Crumbly ghee-laced Mysore Pak, the palace classic.",
    description: "A recipe honed since 1946 — besan slow-toasted in ghee until it turns a deep amber, then set into fudgy squares that crumble at a touch. Unapologetically rich.",
    ingredients: ["Bengal gram flour", "A2 ghee", "Cane sugar", "Cardamom"],
    shelfLife: "12 days at room temperature in an airtight tin.",
    weights: defaultWeights, nutrition: defaultNutrition,
    tags: ["Signature"],
  },
  {
    id: "p4", slug: "rasgulla", name: "Bengali Rasgulla",
    category: "milk-sweets", price: 360, mrp: 420, rating: 4.6, reviews: 388,
    image: rasgulla, gallery: [rasgulla, rasmalai],
    shortDescription: "Spongy chenna dumplings soaked in delicate rose syrup.",
    description: "Freshly-set chenna, kneaded to a silky dough and simmered in light sugar syrup with a whisper of rose water. Served chilled.",
    ingredients: ["Cow milk chenna", "Cane sugar", "Rose water"],
    shelfLife: "5 days refrigerated, in syrup.",
    weights: defaultWeights, nutrition: defaultNutrition,
    isNew: true, tags: ["New"],
  },
  {
    id: "p5", slug: "dry-fruit-laddu", name: "Dry Fruit Laddu",
    category: "dry-fruit", price: 890, mrp: 1050, rating: 4.9, reviews: 742,
    image: dryfruit, gallery: [dryfruit, kaju, giftbox],
    shortDescription: "No-sugar laddus of dates, almonds, cashews and figs.",
    description: "A wholesome, no-added-sugar blend of Medjool dates, Mamra almonds, Ratnagiri cashews, Turkish figs and Iranian pistachios, bound in a touch of A2 ghee.",
    ingredients: ["Dates", "Almonds", "Cashews", "Figs", "Pistachios", "A2 ghee"],
    shelfLife: "30 days in an airtight tin.",
    weights: defaultWeights, nutrition: defaultNutrition,
    isBestSeller: true, tags: ["No added sugar", "Bestseller"],
  },
  {
    id: "p6", slug: "milk-cake", name: "Alwari Milk Cake",
    category: "milk-sweets", price: 460, mrp: 560, rating: 4.7, reviews: 421,
    image: milkcake, gallery: [milkcake, peda],
    shortDescription: "Caramelised khoya set into a firm, grainy fudge.",
    description: "Whole milk reduced for hours in an iron kadhai until it caramelises into a signature amber crust. Cut into rustic slabs.",
    ingredients: ["Cow milk", "Cane sugar", "Alum", "Cardamom"],
    shelfLife: "10 days at room temperature.",
    weights: defaultWeights, nutrition: defaultNutrition,
  },
  {
    id: "p7", slug: "kesar-peda", name: "Kesar Peda",
    category: "milk-sweets", price: 520, mrp: 620, rating: 4.8, reviews: 288,
    image: peda, gallery: [peda, laddu],
    shortDescription: "Saffron-kissed khoya pedas, dense and fragrant.",
    description: "Fresh khoya kneaded with Kashmiri saffron and green cardamom, hand-shaped into pedas and dusted with pistachio.",
    ingredients: ["Khoya", "Cane sugar", "Kashmiri saffron", "Cardamom", "Pistachio"],
    shelfLife: "8 days refrigerated.",
    weights: defaultWeights, nutrition: defaultNutrition,
  },
  {
    id: "p8", slug: "rasmalai", name: "Kesar Rasmalai",
    category: "milk-sweets", price: 580, mrp: 720, rating: 4.9, reviews: 654,
    image: rasmalai, gallery: [rasmalai, rasgulla],
    shortDescription: "Chenna discs in saffron-cardamom reduced milk.",
    description: "Delicate chenna patties simmered in rabri — full-cream milk reduced with saffron, cardamom and pistachio slivers.",
    ingredients: ["Cow milk", "Chenna", "Saffron", "Cardamom", "Pistachio"],
    shelfLife: "3 days refrigerated.",
    weights: defaultWeights, nutrition: defaultNutrition,
    isNew: true,
  },
  {
    id: "p9", slug: "diwali-royale-hamper", name: "Diwali Royale Hamper",
    category: "gift-hampers", price: 2499, mrp: 3200, rating: 5.0, reviews: 208,
    image: giftbox, gallery: [giftbox, kaju, laddu, dryfruit],
    shortDescription: "A hand-finished hamper of six signature mithais and dry fruits.",
    description: "Presented in a velvet-lined lacquered box, the Royale hamper carries Kaju Katli, Motichoor Laddu, Kesar Peda, Dry Fruit Laddu, saffron chocolates and a jar of premium mixed dry fruits.",
    ingredients: ["Assorted sweets and dry fruits — see individual items."],
    shelfLife: "As per items enclosed, 15 days average.",
    weights: [{ label: "Signature", grams: 1500, priceMultiplier: 1 }],
    nutrition: defaultNutrition,
    isBestSeller: true, tags: ["Festive", "Bestseller"],
  },
  {
    id: "p10", slug: "badam-halwa", name: "Badam Halwa",
    category: "dry-fruit", price: 780, mrp: 940, rating: 4.8, reviews: 176,
    image: badam, gallery: [badam, kaju],
    shortDescription: "Ghee-rich almond halwa, warm-spiced with cardamom.",
    description: "Freshly-ground almonds slow-cooked in A2 ghee until glossy, sweetened lightly and perfumed with cardamom and a saffron finish.",
    ingredients: ["Almonds", "A2 ghee", "Cane sugar", "Saffron", "Cardamom"],
    shelfLife: "20 days refrigerated.",
    weights: defaultWeights, nutrition: defaultNutrition,
  },
];

export const bestSellers = products.filter(p => p.isBestSeller);
export const newArrivals = products.filter(p => p.isNew);

export function findProduct(slug: string) {
  return products.find(p => p.slug === slug);
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Aarav Mehta", city: "Mumbai", rating: 5,
    quote: "The Kaju Katli tastes just like the ones my grandmother made in Jaipur. Packaging is spectacular — this is the gift I now send every Diwali.",
    avatar: "https://i.pravatar.cc/120?img=13" },
  { id: "t2", name: "Priya Iyer", city: "Bengaluru", rating: 5,
    quote: "Delivery was next-day, everything arrived cool and intact. The Mysore Pak is the closest to Sri Krishna Sweets I've tasted outside Chennai.",
    avatar: "https://i.pravatar.cc/120?img=45" },
  { id: "t3", name: "Rohan Verma", city: "Delhi", rating: 5,
    quote: "Ordered the Royale hamper for my clients — every single one messaged to say thank you. Exquisite presentation, honest sweetness.",
    avatar: "https://i.pravatar.cc/120?img=32" },
  { id: "t4", name: "Fatima Sheikh", city: "Hyderabad", rating: 5,
    quote: "The dry fruit laddus are my go-to after workouts. No refined sugar, still ridiculously indulgent.",
    avatar: "https://i.pravatar.cc/120?img=47" },
];

export const stores: Store[] = [
  { id: "s1", name: "Mithaas — Bandra Flagship", city: "Mumbai", address: "Turner Road, opposite Mehboob Studios, Bandra West", phone: "+91 22 2600 1122", hours: "Open daily · 9:00 AM – 10:30 PM", lat: 19.06, lng: 72.83 },
  { id: "s2", name: "Mithaas — Khan Market", city: "New Delhi", address: "Middle Lane, Khan Market", phone: "+91 11 4155 2233", hours: "Open daily · 10:00 AM – 10:00 PM", lat: 28.60, lng: 77.22 },
  { id: "s3", name: "Mithaas — Indiranagar", city: "Bengaluru", address: "100 Feet Road, near CMH Road junction", phone: "+91 80 4200 5566", hours: "Open daily · 9:30 AM – 10:30 PM", lat: 12.97, lng: 77.64 },
  { id: "s4", name: "Mithaas — Banjara Hills", city: "Hyderabad", address: "Road No. 12, Banjara Hills", phone: "+91 40 2354 7788", hours: "Open daily · 9:00 AM – 10:30 PM", lat: 17.41, lng: 78.44 },
  { id: "s5", name: "Mithaas — Salt Lake", city: "Kolkata", address: "City Centre 1, Sector 1, Salt Lake", phone: "+91 33 2358 1199", hours: "Open daily · 10:00 AM – 10:00 PM", lat: 22.57, lng: 88.42 },
  { id: "s6", name: "Mithaas — C-Scheme", city: "Jaipur", address: "Ashok Marg, C-Scheme", phone: "+91 141 400 2211", hours: "Open daily · 9:00 AM – 11:00 PM", lat: 26.91, lng: 75.79 },
];

export const blogPosts: BlogPost[] = [
  { id: "b1", slug: "the-secret-of-perfect-kaju-katli", title: "The Secret of a Perfect Kaju Katli",
    excerpt: "Why the temperature of the ghee — not the cashew grade — decides whether your katli melts or crumbles.",
    cover: kaju, category: "Recipes", author: "Chef Ramesh", date: "12 Aug 2025",
    body: "Kaju Katli is one of those sweets where the difference between good and great is measured in seconds and degrees. In our Bandra kitchen, we grind cashews just cool enough to keep them from turning oily, then fold them into a syrup at the elusive 'ek-tar' single-thread stage..." },
  { id: "b2", slug: "diwali-gifting-guide-2025", title: "Diwali Gifting Guide 2025",
    excerpt: "Six hampers, six budgets, and one rule for choosing a gift that lands well every time.",
    cover: giftbox, category: "Festivals", author: "Studio Mithaas", date: "1 Oct 2025",
    body: "Diwali gifting has quietly become a language of its own. This year, we curated hampers for three intents — the corporate thank-you, the family blessing, and the close-friend treat..." },
  { id: "b3", slug: "a-brief-history-of-mysore-pak", title: "A Brief History of Mysore Pak",
    excerpt: "From the Wodeyar palace kitchens to your Sunday tea tin — the 1935 accident that started it all.",
    cover: mysore, category: "Guides", author: "Studio Mithaas", date: "22 Jul 2025",
    body: "In 1935, palace cook Kakasura Madappa was told to invent something for the Maharaja before lunch. He whisked besan into a ghee-and-sugar syrup and set it aside. The rest is fudge history..." },
  { id: "b4", slug: "why-a2-ghee-matters", title: "Why We Use A2 Ghee — And Why It Matters",
    excerpt: "The difference between ordinary ghee and A2 desi ghee, tasted side-by-side.",
    cover: laddu, category: "Guides", author: "Chef Ramesh", date: "5 Jun 2025",
    body: "A2 refers to a specific milk protein found in the milk of indigenous Indian cow breeds. The ghee it yields is subtler, more aromatic, and — we think — makes every mithai it touches taste more like itself..." },
];

export const sampleOrders: Order[] = [
  { id: "MT-24051", date: "12 Oct 2025", status: "Out for Delivery",
    items: [
      { name: "Kaju Katli", qty: 1, price: 720, image: kaju },
      { name: "Motichoor Laddu", qty: 2, price: 540, image: laddu },
    ], total: 1800, address: "Bandra West, Mumbai 400050" },
  { id: "MT-23988", date: "28 Sep 2025", status: "Delivered",
    items: [{ name: "Diwali Royale Hamper", qty: 1, price: 2499, image: giftbox }],
    total: 2499, address: "Bandra West, Mumbai 400050" },
];

export const coupons: Record<string, { discount: number; label: string }> = {
  DIWALI10: { discount: 10, label: "10% off — Diwali special" },
  MITHAAS15: { discount: 15, label: "15% off for first orders" },
  FESTIVE20: { discount: 20, label: "20% off above ₹2,499" },
};

export const faqs: { q: string; a: string }[] = [
  { q: "How fresh are the sweets when they arrive?", a: "Every order is prepared the morning of dispatch. We ship in temperature-controlled boxes with ice packs where required, so your mithai arrives tasting just as it left our kitchen." },
  { q: "Do you deliver across India?", a: "Yes — we ship to 19,000+ pincodes in India via next-day and 2-day services. Enter your pincode on any product page to see the exact ETA." },
  { q: "Are your sweets pure vegetarian?", a: "Every sweet is 100% pure vegetarian. All milk-based sweets are made with A2 cow milk, and we do not use any egg-based binders." },
  { q: "Can I schedule delivery for a specific date?", a: "Absolutely. At checkout, choose a preferred delivery window up to 30 days in advance — perfect for weddings, birthdays and Rakhi." },
  { q: "What is your return & refund policy?", a: "If your order arrives damaged or spoilt, share a photo within 24 hours of delivery and we'll replace it or refund you in full. See our full policy for details." },
  { q: "Do you offer corporate gifting?", a: "Yes. Our concierge desk handles custom branded hampers from 25 boxes to 25,000. Write to us at gifting@mithaas.co and we'll be in touch within one business day." },
];