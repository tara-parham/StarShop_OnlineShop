/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Product } from "../types/product";
export interface ShopSettings {
  storeName: string;
  heroTitle: string;
  heroDescription: string;
  announcement: string;
  contactEmail: string;
}
interface ShopState {
  products: Product[];
  settings: ShopSettings | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}
const ShopContext = createContext<ShopState | null>(null);
const queryClient = new QueryClient();
async function fetchShop() {
  const [products, settings] = await Promise.all([
    api<Product[]>("/products"),
    api<ShopSettings>("/settings"),
  ]);
  return { products, settings };
}
function ShopStateProvider({ children }: { children: ReactNode }) {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["shop"],
    queryFn: fetchShop,
    retry: 1,
  });
  async function refresh() {
    await refetch({ throwOnError: true });
  }
  return (
    <ShopContext.Provider
      value={{
        products: data?.products ?? [],
        settings: data?.settings ?? null,
        loading: isPending,
        error: error?.message ?? "",
        refresh,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
export function ShopProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopStateProvider>{children}</ShopStateProvider>
    </QueryClientProvider>
  );
}
export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop requires ShopProvider");
  return value;
}
export function CatalogStatus() {
  const { loading, error, refresh } = useShop();
  if (loading)
    return (
      <p role="status" className="p-8 text-center">
        Loading the collection…
      </p>
    );
  if (error)
    return (
      <div role="alert" className="p-8 text-center">
        <p>{error}</p>
        <button
          className="text-primary underline mt-3"
          onClick={() => {
            void refresh().catch(() => {});
          }}
        >
          Try again
        </button>
      </div>
    );
  return null;
}
