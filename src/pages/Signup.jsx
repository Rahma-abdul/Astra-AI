import AuthCard from "../components/authCard";
import "../styles/auth.css";

function SignUp() {
    return (
        <div className="auth-page">
            <div className="background-auth"></div>
            <AuthCard type="Signup" />
        </div>
    );
}
export default SignUp;
