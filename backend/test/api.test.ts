import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/http/app.js";
import { SqliteRepository } from "../src/infrastructure/sqlite-repository.js";
import { AuthService } from "../src/application/auth-service.js";

test("catalog, authorization, CRUD, settings, sessions, uploads and persistence", async () => {
  const temp = mkdtempSync(join(tmpdir(), "star-shop-test-"));
  let repository = new SqliteRepository(join(temp, "shop.sqlite"));
  new AuthService(repository).register(
    "admin@example.com",
    "a-strong-test-password",
    "Admin",
    "admin",
  );
  const server = createApp(repository, {
    uploadDir: join(temp, "uploads"),
    secureCookie: false,
  }).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  let cookie = "";
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    authenticated = true,
  ) {
    return fetch(`${base}/api${path}`, {
      method,
      headers: {
        "X-StarShop-Request": "1",
        ...(body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(authenticated && cookie ? { Cookie: cookie } : {}),
      },
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  }
  try {
    assert.equal((await request("/health")).status, 200);
    const initial = await (await request("/products")).json();
    assert.equal(initial.length, 12);
    assert.equal(initial[0].rating, 0);
    assert.equal((await request("/products", "POST", {})).status, 401);
    assert.equal(
      (
        await request("/auth/login", "POST", {
          email: "admin@example.com",
          password: "incorrect-password",
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await request("/auth/register", "POST", {
          email: "customer@example.com",
          password: "customer-pass",
          name: "Customer",
          role: "admin",
        })
      ).status,
      201,
    );
    const customerLogin = await request("/auth/login", "POST", {
      email: "customer@example.com",
      password: "customer-pass",
    });
    cookie = customerLogin.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (await (await request("/auth/me")).json()).user.role,
      "customer",
    );
    assert.equal((await request("/settings", "PUT", {})).status, 403);
    const login = await request("/auth/login", "POST", {
      email: "admin@example.com",
      password: "a-strong-test-password",
    });
    assert.equal(login.status, 200);
    assert.match(login.headers.get("set-cookie")!, /HttpOnly/i);
    cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert.equal((await (await request("/auth/me")).json()).user.role, "admin");
    assert.equal(
      (
        await fetch(`${base}/api/products`, {
          method: "POST",
          headers: { Cookie: cookie },
        })
      ).status,
      403,
    );
    const input = {
      name: "Test serum",
      brand: "Test",
      category: "Skin Care",
      description: "Sample description",
      image: "/images/HydratingSerum.jpg",
      price: 18.5,
      rating: 0,
      inStock: true,
    };
    assert.equal(
      (await request("/products", "POST", { ...input, price: -1 })).status,
      400,
    );
    assert.equal(
      (
        await request("/products", "POST", {
          ...input,
          image: "javascript:alert(1)",
        })
      ).status,
      400,
    );
    const createdResponse = await request("/products", "POST", input);
    assert.equal(createdResponse.status, 201);
    const created = await createdResponse.json();
    assert.equal(
      (
        await request(`/products/${created.id}`, "PUT", {
          ...input,
          name: "Updated serum",
          inStock: false,
        })
      ).status,
      200,
    );
    assert.equal(
      (await (await request(`/products/${created.id}`)).json()).inStock,
      false,
    );
    const settings = await (await request("/settings")).json();
    assert.equal(
      (
        await request("/settings", "PUT", {
          ...settings,
          storeName: "Test Store",
        })
      ).status,
      200,
    );
    const invalid = new FormData();
    invalid.append(
      "image",
      new Blob(["<svg></svg>"], { type: "image/png" }),
      "fake.png",
    );
    assert.equal((await request("/uploads", "POST", invalid)).status, 400);
    const upload = new FormData();
    upload.append(
      "image",
      new Blob(
        [
          Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=",
            "base64",
          ),
        ],
        { type: "image/png" },
      ),
      "pixel.png",
    );
    const uploaded = await request("/uploads", "POST", upload);
    assert.equal(uploaded.status, 201);
    const { url } = await uploaded.json();
    const image = await fetch(`${base}${url}`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type")!, /image\/png/);
    assert.equal((await request("/auth/logout", "POST")).status, 204);
    assert.equal((await (await request("/auth/me")).json()).user, null);
    assert.equal(
      (await request(`/products/${created.id}`, "DELETE")).status,
      401,
    );
    const secondLogin = await request("/auth/login", "POST", {
      email: "admin@example.com",
      password: "a-strong-test-password",
    });
    cookie = secondLogin.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (await request(`/products/${created.id}`, "DELETE")).status,
      204,
    );
    assert.equal((await request(`/products/${created.id}`)).status, 404);
    // Even an empty catalog should stay empty after a restart (seed runs only once).
    for (const p of initial)
      assert.equal((await request(`/products/${p.id}`, "DELETE")).status, 204);
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
    repository.close();
    repository = new SqliteRepository(join(temp, "shop.sqlite"));
    assert.equal(repository.settings().storeName, "Test Store");
    assert.equal(repository.products().length, 0);
    assert.equal(
      new AuthService(repository).login(
        "admin@example.com",
        "a-strong-test-password",
      ).role,
      "admin",
    );
  } finally {
    if (server.listening)
      await new Promise<void>((resolve) => server.close(() => resolve()));
    repository.close();
    rmSync(temp, { recursive: true, force: true });
  }
});
