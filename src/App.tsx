import { Categories } from "./components/home/Categories";
import Hero from "./components/home/Hero";
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Categories />
      </main>
    </div>
      
  );
}

export default App;
