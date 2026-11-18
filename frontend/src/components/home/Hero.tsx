import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { Button } from "../ui/Button";
import heroImg from "../../assets/images/Hero.png";

export default function Hero() {
  const navigate = useNavigate();
  const { settings } = useShop();
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-rose-50 dark:from-slate-950 via-purple-50 dark:via-slate-900 to-pink-50 dark:to-rose-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary bg-rose-100 dark:bg-rose-950 uppercase rounded-full">
              {settings?.announcement || "Your daily beauty ritual ✨"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-slate-100">
              {settings?.heroTitle || "Natural Glow"} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-600">
                Your Unique Beauty
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0">
              {settings?.heroDescription ||
                "Find your next favorite beauty essential."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" onClick={() => navigate("/products")}>
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/products?sort=price-asc")}
              >
                Explore the Collection
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-3xl bg-linear-to-tr from-primary to-purple-500 shadow-2xl rotate-2 p-2 hover:rotate-0 transition-transform duration-300">
              <img
                src={heroImg}
                alt="Cosmetics Hero"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
