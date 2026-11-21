/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api";
import type { Product } from "../types/product";

const guestKey = "starshop_guest_favorites";

function readGuestFavorites(): Product[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(guestKey) ?? "[]");
    return Array.isArray(value)
      ? value.filter(
          (item): item is Product =>
            item !== null && typeof item === "object" && typeof item.id === "string",
        )
      : [];
  } catch {
    return [];
  }
}

interface FavoritesState {
  favorites: Product[];
  loading: boolean;
  error: string;
  isPending: (id: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  retry: () => void;
}

const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  return (
    <FavoritesStateProvider
      key={user?.id ?? "guest"}
      userId={user?.id}
      authLoading={loading}
    >
      {children}
    </FavoritesStateProvider>
  );
}

function FavoritesStateProvider({
  children,
  userId,
  authLoading,
}: {
  children: ReactNode;
  userId?: string;
  authLoading: boolean;
}) {
  const [guestFavorites, setGuestFavorites] = useState(readGuestFavorites);
  const [saveError, setSaveError] = useState("");
  const pendingIds = useRef(new Set<string>());
  const [pending, setPending] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const queryKey = ["favorites", userId];
  const query = useQuery({
    queryKey,
    enabled: Boolean(userId) && !authLoading,
    // Always reload when the account changes, including logging back in.
    staleTime: 0,
    queryFn: async ({ signal }) => {
      const guest = readGuestFavorites();
      if (guest.length) {
        const catalog = await api<Product[]>("/products", { signal });
        const available = new Set(catalog.map((product) => product.id));
        await Promise.all(
          guest.filter((product) => available.has(product.id)).map((product) =>
            api(`/favorites/${encodeURIComponent(product.id)}`, { method: "PUT", signal }),
          ),
        );
        try {
          localStorage.removeItem(guestKey);
        } catch {
          // Account favorites still work when browser storage is unavailable.
        }
      }
      return api<Product[]>("/favorites", { signal });
    },
    retry: 1,
  });
  const loading = authLoading || (Boolean(userId) && query.isPending);
  const favorites = userId ? query.data ?? [] : guestFavorites;

  async function toggleFavorite(product: Product) {
    if (loading || (userId && query.isError) || pendingIds.current.has(product.id)) {
      return;
    }
    const saved = favorites.some((item) => item.id === product.id);
    pendingIds.current.add(product.id);
    setPending([...pendingIds.current]);
    setSaveError("");
    try {
      if (userId) {
        await queryClient.cancelQueries({ queryKey });
        await api(`/favorites/${encodeURIComponent(product.id)}`, {
          method: saved ? "DELETE" : "PUT",
        });
        queryClient.setQueryData<Product[]>(queryKey, (previous = []) =>
          saved
            ? previous.filter((item) => item.id !== product.id)
            : [product, ...previous.filter((item) => item.id !== product.id)],
        );
      } else {
        const next = saved
          ? guestFavorites.filter((item) => item.id !== product.id)
          : [product, ...guestFavorites];
        try {
          localStorage.setItem(guestKey, JSON.stringify(next));
        } catch {
          throw new Error("Unable to save Favorites in this browser. Please allow site storage and try again.");
        }
        setGuestFavorites(next);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save Favorites. Please try again.");
    } finally {
      pendingIds.current.delete(product.id);
      setPending([...pendingIds.current]);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error: saveError || (userId ? query.error?.message ?? "" : ""),
        isPending: (id) => pending.includes(id) || Boolean(userId && query.isError),
        toggleFavorite,
        retry: () => {
          setSaveError("");
          if (userId) void query.refetch();
        },
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites requires FavoritesProvider");
  return value;
}

export function FavoritesNotice() {
  const { error, retry } = useFavorites();
  if (!error) return null;
  return (
    <div role="alert" className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-200">
      <p>Favorites: {error}</p>
      <button type="button" onClick={retry} className="mt-2 cursor-pointer underline">Try again</button>
    </div>
  );
}
