function ProductCard(props) {
  return (
    <div className="product-card">
      <h3>{props.name}</h3>
      <p className="product-price">${props.price.toFixed(2)}</p>
      <button
        className="buy-button"
        onClick={() =>
          props.alreadyInCart
            ? props.onRemoveFromCart(props.product)
            : props.onAddToCart(props.product)
        }
      >
        {props.alreadyInCart ? "Remove from cart" : "Add to cart"}
      </button>
    </div>
  );
}

export default ProductCard;
