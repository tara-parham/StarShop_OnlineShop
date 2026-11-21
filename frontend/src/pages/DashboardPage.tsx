import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { ProductCard } from "../components/products/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export function DashboardPage() {
  const { user, logout, loading, error } = useAuth();
  const { favorites, loading: favoritesLoading, error: favoritesError } = useFavorites();

  if (loading)
    return (
      <p role="status" className="p-10 text-center">
        Checking your session…
      </p>
    );
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-4">My Account</h1>
      <section aria-labelledby="profile-heading" className="bg-rose-50 dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-300 dark:border-slate-600">
        <h2 id="profile-heading" className="text-2xl font-semibold mb-4">Profile</h2>
        <p className="text-lg">
          Welcome back, <strong>{user.name}</strong>! 👋
        </p>
        <p className="text-gray-600 dark:text-slate-300 my-2">
          Email: {user.email}
        </p>
        {error && <p role="alert">{error}</p>}
        {user.role === "admin" && (
          <Link to="/admin" className="block text-primary underline mt-4">
            Manage store
          </Link>
        )}
        <Button onClick={() => void logout()} className="mt-6">
          Logout
        </Button>
      </section>
      <section aria-labelledby="favorites-heading" className="mt-8">
        <h2 id="favorites-heading" className="text-2xl font-semibold mb-4">Favorites</h2>
        {favoritesLoading ? (
          <p role="status" className="py-8 text-center">Loading your Favorites…</p>
        ) : favorites.length ? (
          <>
            <p className="mb-4 text-gray-600 dark:text-slate-300">Click a filled heart to remove a product from Favorites.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </>
        ) : !favoritesError ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-slate-600 dark:bg-slate-900">
            <p className="text-gray-600 dark:text-slate-300">No favorites yet. Tap a heart on any product to save it here.</p>
            <Link to="/products" className="mt-3 inline-block text-primary underline">Browse products</Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
