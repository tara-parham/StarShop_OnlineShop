import { Categories } from "./components/home/Categories";
import Hero from "./components/home/Hero";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { FeaturedProducts } from "./components/products/FeaturedProducts";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
      
  );
}

export default App;
