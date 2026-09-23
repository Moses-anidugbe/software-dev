function Cart(props) {
  const total = props.cart.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
  return (
    <div>
      <h2>Your Cart</h2>

      {props.cart.map((item) => (
        <p key={item.name}>
          {item.name} - ${item.price.toFixed(2)}
        </p>
      ))}

      <h3>
        {props.cart.length > 0
          ? `🛒Total: $${total.toFixed(2)}`
          : "🛒Your cart is empty"}
      </h3>
    </div>
  );
}

export default Cart;
