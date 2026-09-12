import type { Product } from "../types/product";
import LipStick from "../assets/images/Lipstick.jpg";
import HydratingSerum from "../assets/images/HydratingSerum.jpg";
import ArgonOil from "../assets/images/ArganOil.jpg";
import Perfume from "../assets/images/Perfume.jpg";

export const mockData: Product[] = [
  {
    id: "1",
    name: "Nude Look Matte Lipstick",
    brand: "Golden Rose",
    category: "Cosmetics",
    description:
      "Lipstick is a timeless beauty essential that instantly enhances and balances your complexion, even on makeup-free days. The Golden Rose Nude Look Matte Lipstick features a lightweight, velvety texture that delivers a natural tint and smooth coverage. Enriched with Vitamin E, it locks in moisture to prevent dryness and chapping, leaving your lips irresistibly soft with long-lasting wear.",
    image: LipStick,
    inStock: true,
    price: 32,
    rating: 4.2,
  },
  {
    id: "2",
    name: "Deep Hydration Face Serum",
    brand: "Dr.Taffi",
    category: "Skin Care",
    description:
      "Suitable for all skin types and ages, this 30ml hydrating serum is powered by Hyaluronic Acid and Collagen to deeply restore and nourish your skin. Perfect for both morning and evening routines, it comes with a convenient dropper applicator for effortless use.",
    image: HydratingSerum,
    inStock: true,
    price: 50,
    rating: 4.5,
  },
  {
    id: "3",
    name: "Sulfate-Free Argan Oil Hair Serum",
    brand: "Vitaplex",
    category: "Hair Care",
    description:
      "Designed for all hair types, this 90ml leave-in serum instantly softens and adds brilliant shine. Free from sulfates and parabens, its lightweight, unisex formula nourishes deeply without needing to rinse.",
    image: ArgonOil,
    inStock: false,
    price: 45.99,
    rating: 4.0,
  },
  {
    id: "4",
    name: "Lalique L’Amour Eau de Parfum",
    brand: "Pensis",
    category: "Self Care",
    description:
      "A bright and enchanting feminine fragrance that brings an instant feeling of fresh elegance. It opens with vibrant notes, settles into a soft, graceful scent on the skin, and leaves a clean, sophisticated trail. The perfect choice for effortlessly smelling fresh and radiant all day.",
    image: Perfume,
    inStock: true,
    price: 80,
    rating: 4.5,
  },
];
