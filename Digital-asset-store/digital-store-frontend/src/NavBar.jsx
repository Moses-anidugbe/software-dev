import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <div className="navbar">
      <h2>Digital Asset Store</h2>
      <div className="cart-info">
        <p>
          {props.cart.length > 0
            ? `🛒Cart: ${props.cart.length}`
            : "🛒Your cart is empty"}
        </p>
        <Link to="/cart">View Cart</Link>

        {props.cart.length > 0 && (
          <p className="cart-message">You have item(s) in your cart!</p>
        )}
      </div>
    </div>
  );
}

export default NavBar;
