import { z } from "zod";
import { config } from "./config.js";
import { SqliteRepository } from "./infrastructure/sqlite-repository.js";
import { AuthService } from "./application/auth-service.js";
const input = z
  .object({
    email: z.email().transform((s) => s.toLowerCase()),
    password: z.string().min(12).max(128),
    name: z.string().trim().min(1).default("Admin"),
  })
  .safeParse({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
  });
if (!input.success) {
  console.error(
    "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters), and optionally ADMIN_NAME.",
  );
  process.exit(1);
}
const repository = new SqliteRepository(config.databasePath);
try {
  const { email, password, name } = input.data;
  new AuthService(repository).register(email, password, name, "admin");
  console.log("Admin account created. Sign in at /login, then open /admin.");
} finally {
  repository.close();
}
