export type Category = "Cosmetics" | "Skin Care" | "Hair Care" | "Self Care";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  category: Category;
  inStock: boolean;
}
