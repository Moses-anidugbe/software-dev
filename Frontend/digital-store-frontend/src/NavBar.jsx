function NavBar(props) {
  return (
    <div>
      <h2>Digital Asset Store</h2>
      <p>Cart: {props.cartCount}</p>
    </div>
  );
}

export default NavBar;
