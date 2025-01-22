import { Link } from "react-router-dom";

export default function TOC() {
    return (
        <ul>
            <li><Link to="https://github.com/DerekZ-113/kambaz-react-web-app-cs5610-sp25" id="wd-github">GitHub: DerekZ-113</Link></li>
            <li><Link to="/Labs"> Labs</Link></li>
            <li><Link to="/Labs/Lab1">Lab 1</Link></li>
            <li><Link to="/Labs/Lab2">Lab 2</Link></li>
            <li><Link to="/Labs/Lab3">Lab 3</Link></li>
            <li><Link to="/Kambaz">Kambaz</Link></li>
        </ul>
    )
}