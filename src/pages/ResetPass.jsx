import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "../styles/auth.css";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const [recoveryReady, setRecoveryReady] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {

        const {
        data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {

        if (event === "PASSWORD_RECOVERY") {
            setRecoveryReady(true);
        }

        });

        return () => {
        subscription.unsubscribe();
        };

    }, []);

    const handleReset = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
        }

        setError("");

        const { error: err } = await supabase.auth.updateUser({ password });
        
        if (err) {
        setError(err.message);
        return;
        }
        
        navigate("/login");
    };

    return (
        <div className="auth-page">
                <div className="background-auth"></div>
        <div className="auth-card">
        <h3>Set New Password</h3>
        {!recoveryReady ? (
          <p>
            Preparing password reset...
          </p>
        ) : (
        <form onSubmit={handleReset} className="auth-form">
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            />
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            />
            <button className="submit-button" type="submit">
            Reset Password
            </button>
        </form>
        )}
        {error && <p className="form-error">{error}</p>}
        </div>
        </div>
    );
    }