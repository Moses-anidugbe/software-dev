import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

function Nav() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  return (
    <nav>
      <a href="/">SEWSS VINTAGE</a>
      <form>
        <input type="search" placeholder="Search products..." />
        <button type="submit">Search</button>
      </form>

      <div className="account-menu">
        <button
          type="button"
          onClick={() => {
            setIsAccountOpen(!isAccountOpen);
            setIsHelpOpen(false);
          }}
        >
          Account ▾
        </button>

        {isAccountOpen && (
          <div className="account-dropdown">
            {isAuthenticated ? (
              <>
                <button>My Account</button>
                <button>Orders</button>
                <button onClick={logout}>Log Out</button>
              </>
            ) : (
              <button onClick={login}>Sign In / Sign Up</button>
            )}
          </div>
        )}
      </div>
      <div className="help-menu">
        <button
          type="button"
          onClick={() => {
            setIsHelpOpen(!isHelpOpen);
            setIsAccountOpen(false);
          }}
        >
          Help ▾
        </button>
        {isHelpOpen && (
          <div className="help-dropdown">
            <button>FAQ</button>
            <button>Contact Us</button>
          </div>
        )}
      </div>

      <a href="/cart">Cart</a>
    </nav>
  );
}

export default Nav;
