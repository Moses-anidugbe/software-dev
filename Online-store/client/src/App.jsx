import "./App.css";
import Nav from "./components/Nav";
import ProductSection from "./components/ProductSection";

function App() {
  return (
    <div className="App">
      <header>
        <Nav />
      </header>

      <main>
        <ProductSection />
      </main>
    </div>
  );
}

export default App;
