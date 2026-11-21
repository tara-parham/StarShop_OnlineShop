import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer from "multer";
import { rateLimit } from "express-rate-limit";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { ZodError } from "zod";
import type { ShopRepository, User } from "../domain/models.js";
import { ShopService, AppError } from "../application/shop-service.js";
import { AuthService } from "../application/auth-service.js";
import {
  credentialsSchema,
  registrationSchema,
  productSchema,
  settingsSchema,
} from "./validation.js";

interface Options {
  uploadDir: string;
  secureCookie: boolean;
}
const cookieName = "starshop_session";
function sessionToken(req: Request) {
  return req.headers.cookie
    ?.split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
}
function imageExtension(bytes: Buffer) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return "jpg";
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "png";
  if (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  throw new AppError(400, "Upload a JPEG, PNG, or WebP image.");
}
export function createApp(repository: ShopRepository, options: Options) {
  const app = express();
  const shop = new ShopService(repository);
  const auth = new AuthService(repository);
  mkdirSync(options.uploadDir, { recursive: true });
  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    // Custom header forces cross-origin writes through a CORS preflight; CORS is deliberately not enabled.
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.get("X-StarShop-Request") !== "1"
    ) {
      res.status(403).json({ message: "Missing request verification header." });
      return;
    }
    if (req.get("Sec-Fetch-Site") === "cross-site") {
      res.status(403).json({ message: "Cross-site request denied." });
      return;
    }
    next();
  });
  app.use(express.json({ limit: "64kb" }));
  app.use(
    "/uploads",
    express.static(options.uploadDir, { dotfiles: "deny", index: false }),
  );
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = auth.user(sessionToken(req));
    if (!user) {
      res.status(401).json({ message: "Please sign in." });
      return;
    }
    if (user.role !== "admin") {
      res.status(403).json({ message: "Administrator access required." });
      return;
    }
    next();
  };
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: options.secureCookie,
    path: "/",
  };
  const authLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Try again in 15 minutes." },
  });
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/products", (_req, res) => res.json(shop.products()));
  app.get("/api/products/:id", (req, res) =>
    res.json(shop.product(String(req.params.id))),
  );
  app.get("/api/settings", (_req, res) => res.json(shop.settings()));
  app.use("/api/favorites", (req, res, next) => {
    const user = auth.user(sessionToken(req));
    if (!user) {
      res.status(401).json({ message: "Please sign in." });
      return;
    }
    res.locals.user = user;
    next();
  });
  app.get("/api/favorites", (_req, res) => {
    res.json(shop.favorites(res.locals.user.id));
  });
  app.put("/api/favorites/:id", (req, res) => {
    shop.addFavorite(res.locals.user.id, String(req.params.id));
    res.status(204).end();
  });
  app.delete("/api/favorites/:id", (req, res) => {
    shop.removeFavorite(res.locals.user.id, String(req.params.id));
    res.status(204).end();
  });
  app.get("/api/auth/me", (req, res) =>
    res.json({ user: auth.user(sessionToken(req)) ?? null }),
  );
  app.post("/api/auth/:action", authLimiter, (req, res) => {
    const action = req.params.action;
    if (action === "logout") {
      auth.logout(sessionToken(req));
      res.clearCookie(cookieName, cookieOptions).status(204).end();
      return;
    }
    if (action !== "login" && action !== "register")
      throw new AppError(404, "Unknown authentication action.");
    let user: User;
    if (action === "register") {
      const input = registrationSchema.parse(req.body);
      user = auth.register(input.email, input.password, input.name);
    } else {
      const input = credentialsSchema.parse(req.body);
      user = auth.login(input.email, input.password);
    }
    auth.logout(sessionToken(req));
    res
      .cookie(cookieName, auth.createSession(user), {
        ...cookieOptions,
        maxAge: 7 * 24 * 3600_000,
      })
      .status(action === "register" ? 201 : 200)
      .json({ user });
  });
  app.post("/api/products", requireAdmin, (req, res) =>
    res.status(201).json(shop.saveProduct(productSchema.parse(req.body))),
  );
  app.put("/api/products/:id", requireAdmin, (req, res) =>
    res.json(
      shop.saveProduct(productSchema.parse(req.body), String(req.params.id)),
    ),
  );
  app.delete("/api/products/:id", requireAdmin, (req, res) => {
    shop.deleteProduct(String(req.params.id));
    res.status(204).end();
  });
  app.put("/api/settings", requireAdmin, (req, res) =>
    res.json(shop.saveSettings(settingsSchema.parse(req.body))),
  );
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
  });
  app.post("/api/uploads", requireAdmin, upload.single("image"), (req, res) => {
    if (!req.file) throw new AppError(400, "Choose an image to upload.");
    const filename = `${randomUUID()}.${imageExtension(req.file.buffer)}`;
    writeFileSync(join(options.uploadDir, filename), req.file.buffer, {
      flag: "wx",
    });
    res.status(201).json({ url: `/uploads/${filename}` });
  });
  app.use((_req, res) =>
    res.status(404).json({ message: "Endpoint not found." }),
  );
  // Express identifies error middleware by its four-argument signature.
  app.use(
    (error: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        next(error);
        return;
      }
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({
            message: error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
          });
        return;
      }
      if (error instanceof AppError) {
        res.status(error.status).json({ message: error.message });
        return;
      }
      if (error instanceof multer.MulterError) {
        res
          .status(400)
          .json({
            message:
              error.code === "LIMIT_FILE_SIZE"
                ? "Images must be 5 MB or smaller."
                : error.message,
          });
        return;
      }
      if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({ message: "Invalid JSON." });
        return;
      }
      console.error(error);
      res
        .status(500)
        .json({ message: "Something went wrong. Please try again." });
    },
  );
  return app;
}
