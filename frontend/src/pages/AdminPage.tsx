import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop, CatalogStatus } from "../context/ShopContext";
import { ProductEditor } from "../components/admin/ProductEditor";
import { SettingsEditor } from "../components/admin/SettingsEditor";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatPrice";
export function AdminPage() {
  const { user, loading } = useAuth();
  const { products, settings, refresh } = useShop();
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (loading)
    return (
      <p role="status" className="p-12 text-center">
        Checking your session…
      </p>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-bold">Administrator access required</h1>
        <p className="mt-3">
          Sign in with an admin account to manage this store.
        </p>
      </div>
    );
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await api(`/products/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div>
        <p className="text-primary text-sm font-semibold uppercase tracking-widest">
          Store workspace
        </p>
        <h1 className="text-3xl font-bold mt-2">Administration</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          Manage your collection and make the storefront your own.
        </p>
      </div>
      <div className="flex gap-3" aria-label="Admin sections">
        <Button
          variant={tab === "products" ? "primary" : "outline"}
          onClick={() => setTab("products")}
        >
          Products & uploads
        </Button>
        <Button
          variant={tab === "settings" ? "primary" : "outline"}
          onClick={() => setTab("settings")}
        >
          Settings
        </Button>
      </div>
      <CatalogStatus />
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {tab === "settings" ? (
        settings && <SettingsEditor settings={settings} />
      ) : editing ? (
        <ProductEditor
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            await refresh();
            setEditing(null);
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Your collection{" "}
              <span className="text-gray-500 dark:text-slate-400">
                ({products.length})
              </span>
            </h2>
            <Button onClick={() => setEditing("new")}>+ Add product</Button>
          </div>
          {deleting && (
            <div className="admin-panel border-red-300!" role="alert">
              <p className="mb-4">
                Delete “{deleting.name}”? This removes it from the catalog.
              </p>
              <div className="flex gap-3">
                <Button disabled={busy} onClick={() => void remove()}>
                  {busy ? "Deleting…" : "Confirm delete"}
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setDeleting(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div className="admin-panel overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 dark:border-slate-800"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-12 h-12 rounded-lg object-cover"
                          src={p.image}
                          alt=""
                        />
                        <div className="min-w-40">
                          <strong>{p.name}</strong>
                          <p className="text-gray-500 dark:text-slate-400">
                            {p.category} · {p.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3 whitespace-nowrap">
                      {p.inStock ? "In stock" : "Out of stock"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditing(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleting(p)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="p-8 text-center">
                Your collection is empty. Add your first product above.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
