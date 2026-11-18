import { useState, type SubmitEvent } from "react";
import { useShop, type ShopSettings } from "../../context/ShopContext";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
export function SettingsEditor({ settings }: { settings: ShopSettings }) {
  const { refresh } = useShop();
  const [draft, setDraft] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api("/settings", { method: "PUT", body: JSON.stringify(draft) });
      await refresh();
      setMessage("Settings saved.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="admin-panel max-w-3xl space-y-5">
      <h2 className="text-xl font-bold">Store settings</h2>
      <p className="text-gray-500 dark:text-slate-400">
        Update your storefront content. Changes appear on the home page and
        footer.
      </p>
      {message && <p role="status">{message}</p>}
      {(
        [
          { key: "storeName", label: "Store name", max: 80 },
          { key: "heroTitle", label: "Home page title", max: 120 },
          { key: "announcement", label: "Announcement", max: 200 },
          { key: "contactEmail", label: "Contact email", max: 254 },
        ] as const
      ).map(({ key, label, max }) => (
        <label key={key}>
          {label}
          <input
            type={key === "contactEmail" ? "email" : "text"}
            maxLength={max}
            required={key !== "announcement"}
            value={draft[key]}
            onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
          />
        </label>
      ))}
      <label>
        Home page description
        <textarea
          required
          maxLength={600}
          rows={4}
          value={draft.heroDescription}
          onChange={(e) =>
            setDraft({ ...draft, heroDescription: e.target.value })
          }
        />
      </label>
      <Button disabled={busy}>{busy ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
