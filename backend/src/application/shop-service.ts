import { randomUUID } from "node:crypto";
import type {
  ProductInput,
  Settings,
  ShopRepository,
} from "../domain/models.js";
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export class ShopService {
  constructor(private repository: ShopRepository) {}
  products() {
    return this.repository.products();
  }
  product(id: string) {
    const product = this.repository.product(id);
    if (!product) throw new AppError(404, "Product not found.");
    return product;
  }
  saveProduct(input: ProductInput, id?: string) {
    if (id) this.product(id);
    const product = { ...input, id: id ?? randomUUID() };
    this.repository.saveProduct(product);
    return product;
  }
  deleteProduct(id: string) {
    if (!this.repository.deleteProduct(id))
      throw new AppError(404, "Product not found.");
  }
  settings() {
    return this.repository.settings();
  }
  favorites(userId: string) {
    return this.repository.favorites(userId);
  }
  addFavorite(userId: string, productId: string) {
    this.product(productId);
    this.repository.addFavorite(userId, productId);
  }
  removeFavorite(userId: string, productId: string) {
    this.repository.removeFavorite(userId, productId);
  }
  saveSettings(settings: Settings) {
    this.repository.saveSettings(settings);
    return settings;
  }
}
