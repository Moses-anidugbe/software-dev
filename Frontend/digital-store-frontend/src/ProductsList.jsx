import ProductCard from "./ProductCard";

function ProductsList(props) {
  return (
    <div className="products-list-container">
      <h2>Products</h2>
      <div className="products-list">
        {props.products.map((product) => {
          const alreadyInCart = props.cart.some(
            (item) => item.id === product.id,
          );

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onAddToCart={() => props.onAddToCart(product)}
              onRemoveFromCart={() => props.onRemoveFromCart(product)}
              alreadyInCart={alreadyInCart}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductsList;
