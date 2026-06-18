import AuthCard from "../components/authCard";
import "../styles/auth.css";

function Login(){
    return(
        <div className="auth-page">
            <div className="background-auth"></div>
            <AuthCard type="Login"/>

        </div>
      
    )

}

export default Login;