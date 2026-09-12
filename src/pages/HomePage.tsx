import { Categories } from "../components/home/Categories";
import Hero from "../components/home/Hero";
import { FeaturedProducts } from "../components/products/FeaturedProducts";

export function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </>
  );
}
