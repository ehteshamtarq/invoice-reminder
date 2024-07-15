import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "./Login.css";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className = "login">
        <button className="login-button" onClick={() => loginWithRedirect()}>login/signup</button>
    </div>
  )

};

export default Login;