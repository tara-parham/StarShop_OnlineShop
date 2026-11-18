import { useState, type SubmitEvent } from "react";
import type { Product, Category } from "../../types/product";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
const emptyProduct: Omit<Product, "id"> = {
  name: "",
  brand: "",
  category: "Skin Care",
  description: "",
  image: "",
  price: 0,
  rating: 0,
  inStock: true,
};
export function ProductEditor({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(product ?? emptyProduct);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  function update<K extends keyof typeof draft>(
    key: K,
    value: (typeof draft)[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const result = await api<{ url: string }>("/uploads", {
        method: "POST",
        body,
      });
      update("image", result.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }
  async function save(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(product ? `/products/${product.id}` : "/products", {
        method: product ? "PUT" : "POST",
        body: JSON.stringify(draft),
      });
      await onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="admin-panel space-y-5">
      <h2 className="text-xl font-bold">
        {product ? "Edit product" : "Add a product"}
      </h2>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <label>
          Product name
          <input
            required
            maxLength={160}
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label>
          Brand
          <input
            required
            maxLength={100}
            value={draft.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={draft.category}
            onChange={(e) => update("category", e.target.value as Category)}
          >
            {["Cosmetics", "Skin Care", "Hair Care", "Self Care"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Price ($)
          <input
            type="number"
            min="0"
            max="1000000"
            step="0.01"
            required
            value={draft.price}
            onChange={(e) => update("price", Number(e.target.value))}
          />
        </label>
      </div>
      <label>
        Description
        <textarea
          required
          maxLength={5000}
          rows={4}
          value={draft.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-3">
          <label>
            Image URL or local path
            <input
              required
              value={draft.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://… or upload an image below"
            />
          </label>
          <label>
            Upload image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy || uploading}
              onChange={(e) => void upload(e.target.files?.[0])}
            />
          </label>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            JPEG, PNG or WebP, up to 5 MB. {uploading && "Uploading…"}
          </p>
        </div>
        {draft.image && (
          <img
            className="h-40 w-40 object-cover rounded-xl"
            src={draft.image}
            alt="Product preview"
          />
        )}
      </div>
      <label className="flex! items-center gap-2">
        <input
          type="checkbox"
          className="w-auto!"
          checked={draft.inStock}
          onChange={(e) => update("inStock", e.target.checked)}
        />{" "}
        Available in stock
      </label>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        New products start without a customer rating.
      </p>
      <div className="flex gap-3">
        <Button disabled={busy || uploading}>
          {busy ? "Saving…" : "Save product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
