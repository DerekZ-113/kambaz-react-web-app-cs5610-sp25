import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../style.css";

export default function AccountNavigation() {
    const { pathname } = useLocation();

    return (
        <div className="wd-account-navigation">
            <ListGroup className="wd-account-nav d-md-block rounded-0 bg-white z-2">
                <ListGroup.Item 
                    as={Link} 
                    to="/Kambaz/Account/Signin"
                    active={pathname.includes("/Signin")}
                    action
                    className="border-0 text-danger"
                    id="wd-signin-nav-link">
                    Sign In
                </ListGroup.Item>
                <ListGroup.Item 
                    as={Link} 
                    to="/Kambaz/Account/Signup"
                    active={pathname.includes("/Signup")}
                    action
                    className="border-0 text-danger"
                    id="wd-signup-nav-link">
                    Sign Up
                </ListGroup.Item>
                <ListGroup.Item 
                    as={Link} 
                    to="/Kambaz/Account/Profile"
                    active={pathname.includes("/Profile")}
                    action
                    className="border-0 text-danger"
                    id="wd-profile-nav-link">
                    Profile
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}