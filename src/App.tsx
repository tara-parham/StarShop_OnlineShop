import { Categories } from "./components/home/Categories";
import Hero from "./components/home/Hero";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Categories />
      </main>
      <Footer />
    </div>
      
  );
}

export default App;
