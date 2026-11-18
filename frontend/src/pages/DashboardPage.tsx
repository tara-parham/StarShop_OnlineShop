import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export function DashboardPage() {
  const { user, logout, loading, error } = useAuth();

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
      <div className="bg-rose-50 dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-300 dark:border-slate-600">
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
      </div>
    </div>
  );
}
