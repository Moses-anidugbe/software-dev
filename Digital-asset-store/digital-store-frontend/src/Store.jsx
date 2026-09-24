import { useEffect, useState } from "react";
import "./App.css";
import Hero from "./Hero";
import ProductsList from "./ProductsList";
import NavBar from "./NavBar";

function Store(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        if (isMounted) {
          setProducts(result?.data ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load products right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <NavBar cart={props.cart} />
      <Hero />

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ProductsList
          products={products}
          cart={props.cart}
          onAddToCart={(product) =>
            props.setCart((prev) =>
              prev.some((item) => item.id === product.id)
                ? prev
                : [...prev, product],
            )
          }
          onRemoveFromCart={(product) =>
            props.setCart((prev) =>
              prev.filter((item) => item.id !== product.id),
            )
          }
        />
      )}
    </div>
  );
}

export default Store;
