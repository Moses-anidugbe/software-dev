import "./App.css";
import Hero from "./Hero";
import ProductsList from "./ProductsList";
import NavBar from "./NavBar";

function Store(props) {
  const products = [
    { name: "React Dashboard Template", price: 15 },
    { name: "Vue.js Admin Panel", price: 20 },
    { name: "Angular Material Design", price: 25 },
    { name: "Node.js Backend Boilerplate", price: 30 },
  ];
  return (
    <div>
      <NavBar cart={props.cart} />
      <Hero />
      <ProductsList
        products={products}
        cart={props.cart}
        onAddToCart={(product) => props.setCart((prev) => [...prev, product])}
        onRemoveFromCart={(product) =>
          props.setCart((prev) =>
            prev.filter((item) => item.name !== product.name),
          )
        }
      />
    </div>
  );
}

export default Store;
