import ProductCard from "./ProductCard";

function ProductsList(props) {
  return (
    <div>
      <h2>Products</h2>
      {props.products.map((product) => (
        <ProductCard
          key={product.name}
          name={product.name}
          price={product.price}
          onAddToCart={props.onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductsList;
