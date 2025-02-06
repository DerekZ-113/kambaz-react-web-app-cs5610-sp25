import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Profile() {
    return (
        <div id="wd-profile-screen">
            <h3>Profile</h3>
            <Form.Control 
                defaultValue="alice" 
                placeholder="username" 
                className="mb-2"
                id="wd-username" />
            <Form.Control 
                defaultValue="123" 
                placeholder="password" 
                type="password" 
                className="mb-2"
                id="wd-password" />
            <Form.Control 
                defaultValue="Alice" 
                placeholder="First Name" 
                className="mb-2"
                id="wd-firstname" />
            <Form.Control 
                defaultValue="Wonderland" 
                placeholder="Last Name" 
                className="mb-2"
                id="wd-lastname" />
            <Form.Control 
                defaultValue="2000-01-01" 
                type="date" 
                className="mb-2"
                id="wd-dob" />
            <Form.Control 
                defaultValue="alice@wonderland" 
                type="email" 
                className="mb-2"
                id="wd-email" />
            <Form.Select 
                defaultValue="FACULTY" 
                className="mb-2"
                id="wd-role">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
            </Form.Select>
            <Link 
                to="/Kambaz/Account/Signin"
                className="btn btn-danger w-100 mb-2">
                Sign out
            </Link>
        </div>
    );
}