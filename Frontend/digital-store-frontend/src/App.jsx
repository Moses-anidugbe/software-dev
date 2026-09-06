import { useState } from "react";
import Hero from "./Hero";
import ProductsList from "./ProductsList";
import NavBar from "./NavBar";

function App() {
  const products = [
    { name: "React Dashboard Template", price: 15 },
    { name: "Vue.js Admin Panel", price: 20 },
    { name: "Angular Material Design", price: 25 },
    { name: "Node.js Backend Boilerplate", price: 30 },
  ];
  const [cartCount, setCartCount] = useState(0);
  return (
    <div>
      <NavBar cartCount={cartCount} />
      <Hero />
      <ProductsList
        products={products}
        onAddToCart={() => setCartCount((prev) => prev + 1)}
      />
    </div>
  );
}

export default App;
