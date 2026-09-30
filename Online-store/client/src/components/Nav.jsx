import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

function Nav() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  const dropDownMenuRef = useRef(null);

  useEffect(() => {
    setIsAccountOpen(false);
    setIsHelpOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
        setIsHelpOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          }}
        >
          Account ▾
        </button>

        {isAccountOpen && (
          <div className="account-dropdown" ref={dropDownMenuRef}>
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate("/account")}>My Account</button>
                <button>Orders</button>
                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    logout();
                    navigate("/");
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/login")}>
                Sign In / Sign Up
              </button>
            )}
          </div>
        )}
      </div>

      <div className="help-menu">
        <button
          type="button"
          onClick={() => {
            setIsHelpOpen(!isHelpOpen);
          }}
        >
          Help ▾
        </button>
        {isHelpOpen && (
          <div className="help-dropdown" ref={dropDownMenuRef}>
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
