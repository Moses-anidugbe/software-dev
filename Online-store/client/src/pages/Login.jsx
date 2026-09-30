import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const [pageState, setPageState] = useState("login"); // "login" or "signup"
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        return;
      }
      localStorage.setItem("token", data.token);
      login();
      const token = localStorage.getItem("token");
      navigate("/");
      // console.log(token);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  }
  return (
    <div className="login-container">
      <h1>{pageState === "login" ? "Login" : "Sign Up"}</h1>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          onChange={(event) => setUserName(event.target.value)}
          value={username}
        />
        {pageState === "signup" && (
          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        )}
        <input
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button type="submit">
          {pageState === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      <p>
        {pageState === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
      </p>
      <button
        onClick={() => setPageState(pageState === "login" ? "signup" : "login")}
      >
        {pageState === "login" ? "Sign Up" : "Login"}
      </button>
    </div>
  );
}

export default Login;
