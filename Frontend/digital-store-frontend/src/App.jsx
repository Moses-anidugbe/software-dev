import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./Store";
import Cart from "./Cart";

function App() {
  const [cart, setCart] = useState([]);
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Store cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
