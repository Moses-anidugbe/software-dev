import ProductCard from "./ProductCard";

function ProductsList(props) {
  return (
    <div className="products-list-container">
      <h2>Products</h2>
      <div className="products-list">
        {props.products.map((product) => {
          const alreadyInCart = props.cart.some(
            (item) => item.name === product.name,
          );
          console.log(product.name, alreadyInCart);

          return (
            <ProductCard
              key={product.name}
              name={product.name}
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
