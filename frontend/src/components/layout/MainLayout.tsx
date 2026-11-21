import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { FavoritesNotice } from "../../context/FavoritesContext";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <Navbar />
      <FavoritesNotice />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
