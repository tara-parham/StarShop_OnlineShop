import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/http/app.js";
import { SqliteRepository } from "../src/infrastructure/sqlite-repository.js";

test("favorites require a session, stay private, persist, and follow product deletion", async () => {
  const temp = mkdtempSync(join(tmpdir(), "star-shop-favorites-"));
  const path = join(temp, "shop.sqlite");
  let repository = new SqliteRepository(path);
  const server = createApp(repository, {
    uploadDir: join(temp, "uploads"), secureCookie: false,
  }).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}/api`;
  async function request(path: string, method = "GET", cookie = "", body?: unknown) {
    return fetch(`${base}${path}`, {
      method,
      headers: { "X-StarShop-Request": "1", "Content-Type": "application/json", Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
  async function register(email: string) {
    const response = await request("/auth/register", "POST", "", {
      email, name: "Wishlist customer", password: "favorite-test-password",
    });
    assert.equal(response.status, 201);
    return {
      cookie: response.headers.get("set-cookie")!.split(";")[0],
      user: (await response.json()).user,
    };
  }
  try {
    for (const method of ["GET", "PUT", "DELETE"]) {
      assert.equal((await request(method === "GET" ? "/favorites" : "/favorites/1", method)).status, 401);
    }
    const first = await register("first@example.com");
    const second = await register("second@example.com");
    assert.deepEqual(await (await request("/favorites", "GET", first.cookie)).json(), []);
    assert.equal((await request("/favorites/1", "PUT", first.cookie)).status, 204);
    // Repeated saves must not create duplicate entries.
    assert.equal((await request("/favorites/1", "PUT", first.cookie)).status, 204);
    assert.equal((await request("/favorites/3", "PUT", first.cookie)).status, 204);
    const saved = await (await request("/favorites", "GET", first.cookie)).json();
    assert.deepEqual(saved.map((p: { id: string }) => p.id).sort(), ["1", "3"]);
    assert.equal(saved.find((p: { id: string }) => p.id === "3").inStock, false);
    assert.deepEqual(await (await request("/favorites", "GET", second.cookie)).json(), []);
    assert.equal((await request("/favorites/1", "DELETE", second.cookie)).status, 204);
    assert.equal(repository.favorites(first.user.id).length, 2);
    assert.equal((await request("/favorites/missing", "PUT", first.cookie)).status, 404);
    assert.equal((await request("/favorites/1", "DELETE", first.cookie)).status, 204);
    assert.equal((await request("/favorites/1", "DELETE", first.cookie)).status, 204);
    assert.deepEqual(repository.favorites(first.user.id).map((p) => p.id), ["3"]);
    assert.equal((await request("/auth/logout", "POST", first.cookie)).status, 204);
    assert.equal((await request("/favorites", "GET", first.cookie)).status, 401);

    await new Promise<void>((resolve) => server.close(() => resolve()));
    repository.close();
    repository = new SqliteRepository(path);
    assert.deepEqual(repository.favorites(first.user.id).map((p) => p.id), ["3"]);
    repository.saveProduct({ ...repository.product("3")!, name: "Updated favorite", price: 99 });
    assert.equal(repository.favorites(first.user.id)[0].name, "Updated favorite");
    assert.equal(repository.favorites(first.user.id)[0].price, 99);
    repository.deleteProduct("3");
    assert.deepEqual(repository.favorites(first.user.id), []);
  } finally {
    if (server.listening) await new Promise<void>((resolve) => server.close(() => resolve()));
    repository.close();
    rmSync(temp, { recursive: true, force: true });
  }
});
