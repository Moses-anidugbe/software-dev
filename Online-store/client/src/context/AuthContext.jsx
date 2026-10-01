import { createContext, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [user, setUser] = useState(getStoredUser);

  function login({ token, user: authenticatedUser }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setIsAuthenticated(true);
    setUser(authenticatedUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
