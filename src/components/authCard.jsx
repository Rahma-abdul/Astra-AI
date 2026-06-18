import { useState } from "react";
import { Link  , useNavigate} from "react-router-dom";

function AuthCard({ type }) {
  const normalizedType = String(type).trim().toLowerCase();
  const isLogin = normalizedType === "login" || normalizedType === "signin" || normalizedType === "sign in";
  const title = isLogin ? "Login" : "Signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAuth = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Fill all fields please");
      return;
    }

    setError("");
    // TODO: Add auth submission logic here

    console.log(`${title} submitted`, { email, password });
  };

  
  const handleSignUp = async () => {
    navigate(`/signup`);
  }

  const handleLogin = async () => {
    navigate(`/login`);
  }

  return (
    <div className="auth-card">
      <h3>{title}</h3>
      <form className="auth-form" onSubmit={handleAuth}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
        />

        <button type="submit">{title}</button>
      </form>

      {error && <p className="form-error">{error}</p>}

      <div className="auth-meta">
        {isLogin ? (
          <button onClick = {handleSignUp} className="auth-link"> Create a new account? SignUp</button>
        ) : (
          <button onClick = {handleLogin} className="auth-link"> Already have an account? Login</button>
        )}
      </div>
    </div>
  );
}
export default AuthCard;
