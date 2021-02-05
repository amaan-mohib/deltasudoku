import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { firebaseUI } from "./Firebase";

export default function Login() {
  useEffect(() => {
    firebaseUI();
  }, []);
  return (
    <div className="signin">
      <h1>Sign In</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
      <Link to="/settings">{"<"} Go Back</Link>
    </div>
  );
}
