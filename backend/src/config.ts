import { resolve } from "node:path";
export const config = {
  port: Number(process.env.PORT ?? 3001),
  databasePath: resolve(process.env.DATABASE_PATH ?? "data/star-shop.sqlite"),
  uploadDir: resolve(process.env.UPLOAD_DIR ?? "uploads"),
  secureCookie: process.env.COOKIE_SECURE === "true",
};
