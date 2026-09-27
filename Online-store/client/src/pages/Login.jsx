import { useState } from "react";

function Login() {
  const [pageState, setPageState] = useState("login"); // "login" or "signup"
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log(username);
    console.log(password);
    console.log(email);
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
