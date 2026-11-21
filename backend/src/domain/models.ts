export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  inStock: boolean;
}
export type ProductInput = Omit<Product, "id">;
export interface Settings {
  storeName: string;
  heroTitle: string;
  heroDescription: string;
  announcement: string;
  contactEmail: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}
export interface Account extends User {
  passwordHash: string;
}
export interface ShopRepository {
  products(): Product[];
  product(id: string): Product | undefined;
  saveProduct(product: Product): void;
  deleteProduct(id: string): boolean;
  favorites(userId: string): Product[];
  addFavorite(userId: string, productId: string): void;
  removeFavorite(userId: string, productId: string): void;
  settings(): Settings;
  saveSettings(settings: Settings): void;
  account(email: string): Account | undefined;
  saveAccount(account: Account): void;
  saveSession(tokenHash: string, userId: string, expires: number): void;
  session(tokenHash: string): User | undefined;
  deleteSession(tokenHash: string): void;
}
