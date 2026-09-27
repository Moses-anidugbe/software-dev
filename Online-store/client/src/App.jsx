import "./App.css";

import Nav from "./components/Nav";
import Home from "./pages/Home";
import Account from "./pages/Account";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <header>
        <Nav />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
