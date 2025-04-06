import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import { FormControl, Button, Alert } from "react-bootstrap";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const signin = async () => {
    try {
      setError("");
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (e: any) {
      setError(e.response?.data?.message || "Sign in failed");
    }
  };
  
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <FormControl defaultValue={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="mb-2" placeholder="username" id="wd-username" />
      <FormControl defaultValue={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="mb-2" placeholder="password" type="password" id="wd-password" />
      <Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup"> Sign up </Link>
    </div>
  );
}
