import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type {
  Account,
  Product,
  Settings,
  ShopRepository,
  User,
} from "../domain/models.js";
import { defaultSettings, seedProducts } from "./seed.js";
export class SqliteRepository implements ShopRepository {
  readonly db: Database.Database;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new Database(path);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL,
        category TEXT NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, price REAL NOT NULL CHECK(price >= 0),
        rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5), inStock INTEGER NOT NULL CHECK(inStock IN (0,1)));
      CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK(id = 1), value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin','customer')), passwordHash TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (tokenHash TEXT PRIMARY KEY, userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    `);
    if (
      !this.db.prepare("SELECT version FROM migrations WHERE version = 1").get()
    ) {
      this.db.transaction(() => {
        for (const product of seedProducts) this.saveProduct(product);
        this.saveSettings(defaultSettings);
        this.db.prepare("INSERT INTO migrations VALUES (1)").run();
      })();
    }
  }
  products() {
    return (
      this.db
        .prepare("SELECT * FROM products ORDER BY rowid")
        .all() as Product[]
    ).map((p) => ({ ...p, inStock: Boolean(p.inStock) }));
  }
  product(id: string) {
    const p = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
      Product | undefined;
    return p && { ...p, inStock: Boolean(p.inStock) };
  }
  saveProduct(p: Product) {
    this.db
      .prepare(
        `INSERT INTO products VALUES (@id,@name,@brand,@category,@description,@image,@price,@rating,@inStock)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name, brand=excluded.brand, category=excluded.category,
      description=excluded.description, image=excluded.image, price=excluded.price, rating=excluded.rating, inStock=excluded.inStock`,
      )
      .run({ ...p, inStock: Number(p.inStock) });
  }
  deleteProduct(id: string) {
    return (
      this.db.prepare("DELETE FROM products WHERE id = ?").run(id).changes > 0
    );
  }
  settings(): Settings {
    return JSON.parse(
      (
        this.db.prepare("SELECT value FROM settings WHERE id = 1").get() as {
          value: string;
        }
      ).value,
    );
  }
  saveSettings(s: Settings) {
    this.db
      .prepare(
        "INSERT INTO settings VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET value=excluded.value",
      )
      .run(JSON.stringify(s));
  }
  account(email: string) {
    return this.db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
      Account | undefined;
  }
  saveAccount(a: Account) {
    this.db
      .prepare(
        "INSERT INTO users VALUES (@id,@email,@name,@role,@passwordHash)",
      )
      .run(a);
  }
  saveSession(tokenHash: string, userId: string, expires: number) {
    this.db.prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
    this.db
      .prepare("INSERT INTO sessions VALUES (?, ?, ?)")
      .run(tokenHash, userId, expires);
  }
  session(hash: string) {
    return this.db
      .prepare(
        "SELECT u.id,u.email,u.name,u.role FROM users u JOIN sessions s ON u.id=s.userId WHERE s.tokenHash=? AND s.expires > ?",
      )
      .get(hash, Date.now()) as User | undefined;
  }
  deleteSession(hash: string) {
    this.db.prepare("DELETE FROM sessions WHERE tokenHash=?").run(hash);
  }
  close() {
    this.db.close();
  }
}
