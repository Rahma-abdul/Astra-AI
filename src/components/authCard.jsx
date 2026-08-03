import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { supabase } from "../services/supabase";

function AuthCard({ type }) {
  const isLogin = type === "Login" ;
  const title = isLogin ? "Log In" : "Sign Up";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showVerify , setShowVerify] =useState(false);


  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Fill all fields please");
      return;
    }

    setError("");

    try{
      let error; 
      if (isLogin) {
        const result = await supabase.auth.signInWithPassword({ email, password });
        error = result.error;
        if (error) {
        setError(error.message);
        return;
      }

      navigate(`/dashboard`);
      }
      else {
        const result = await supabase.auth.signUp({ email, password });
        error = result.error;
        if (error) {
        setError(error.message);
        return;
        }
        setShowVerify(true);
      }

      

    }
    catch(err){
      setError("An error occurred during authentication. Please try again.");
    }

  };

  
  const handleSignUp = async () => {
    navigate(`/signup`);
  }

  const handleLogin = async () => {
    navigate(`/login`);
  }

  // const handleSubmit = async () => {
  //   handleAuth();
  //   navigate('/dashboard');
  // }

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

      {/* Verfication email */}
      {showVerify && (
            <div className="verify-overlay">
                <div className="verify-card">

                        <h2>Account created successfully!</h2>
                        <p>We've sent a verification email to <span style={{textDecoration: "underline", fontStyle: "italic" , color: "#fff" }}>{email}</span>.</p>
                        <p>Please check your inbox (and spam folder if needed), verify your email, then return here to <span className="auth-link2" onClick={handleLogin}>Login</span></p>
                </div>

            </div>
            )}
    </div>
  );
}
export default AuthCard;
