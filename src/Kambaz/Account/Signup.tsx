import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Signup() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const signup = async () => {
        try {
            const currentUser = await client.signup(user);
            dispatch(setCurrentUser(currentUser));
            navigate("/Kambaz/Account/Profile");
        } catch (error) {
            console.error("Signup failed:", error);
            // Handle signup error - you might want to display an error message
        }
    };

    return (
        <div id="wd-signup-screen">
            <h1>Sign up</h1>
            <Form.Control 
                id="wd-username"
                placeholder="username" 
                className="mb-2"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <Form.Control 
                id="wd-password"
                placeholder="password" 
                type="password" 
                className="mb-2"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Form.Control 
                id="wd-password-verify"
                placeholder="verify password" 
                type="password" 
                className="mb-2"
            />
            <button 
                id="wd-signup-btn"
                onClick={signup}
                className="btn btn-primary w-100 mb-2">
                Sign up
            </button>
            <Link 
                id="wd-signin-link"
                to="/Kambaz/Account/Signin">
                Sign in
            </Link>
        </div>
    );
}