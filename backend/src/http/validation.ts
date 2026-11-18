import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
export const credentialsSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((s) => s.toLowerCase()),
  password: z.string().min(8).max(128),
});
export const registrationSchema = credentialsSchema.extend({ name: text(100) });
export const productSchema = z.object({
  name: text(160),
  brand: text(100),
  category: z.enum(["Cosmetics", "Skin Care", "Hair Care", "Self Care"]),
  description: text(5000),
  image: text(2048).refine(
    (s) =>
      /^\/uploads\/[a-f0-9-]+\.(jpg|png|webp)$/.test(s) ||
      /^\/images\/[\w.-]+$/.test(s) ||
      /^https:\/\//.test(s),
    "Use an uploaded image, local image path, or HTTPS URL.",
  ),
  price: z
    .number()
    .finite()
    .min(0)
    .max(1_000_000)
    .refine(
      (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001,
      "Use at most two decimal places.",
    ),
  rating: z.number().min(0).max(5),
  inStock: z.boolean(),
});
export const settingsSchema = z.object({
  storeName: text(80),
  heroTitle: text(120),
  heroDescription: text(600),
  announcement: z.string().trim().max(200),
  contactEmail: z.email().max(254),
});
