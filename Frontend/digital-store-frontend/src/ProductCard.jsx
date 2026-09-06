function ProductCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>${props.price.toFixed(2)}</p>
      <button onClick={props.onAddToCart}>Buy</button>
    </div>
  );
}

export default ProductCard;
