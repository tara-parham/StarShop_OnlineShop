import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import type { ShopRepository, User } from "../domain/models.js";
import { AppError } from "./shop-service.js";
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export class AuthService {
  constructor(private repository: ShopRepository) {}
  register(
    email: string,
    password: string,
    name: string,
    role: User["role"] = "customer",
  ) {
    if (this.repository.account(email))
      throw new AppError(409, "An account already exists for this email.");
    const user = { id: randomUUID(), email, name, role };
    this.repository.saveAccount({
      ...user,
      passwordHash: hashPassword(password),
    });
    return user;
  }
  login(email: string, password: string) {
    const account = this.repository.account(email);
    // Run scrypt even for unknown users to avoid a cheap account-existence timing signal.
    const [salt, expected] = (
      account?.passwordHash ?? `${"0".repeat(32)}:${"0".repeat(128)}`
    ).split(":");
    const valid = timingSafeEqual(
      scryptSync(password, salt, 64),
      Buffer.from(expected, "hex"),
    );
    if (!account || !valid)
      throw new AppError(401, "Incorrect email or password.");
    const { id, name, role } = account;
    return { id, email, name, role };
  }
  createSession(user: User) {
    const token = randomBytes(32).toString("hex");
    this.repository.saveSession(
      digest(token),
      user.id,
      Date.now() + 7 * 24 * 3600_000,
    );
    return token;
  }
  user(token?: string) {
    return token ? this.repository.session(digest(token)) : undefined;
  }
  logout(token?: string) {
    if (token) this.repository.deleteSession(digest(token));
  }
}
