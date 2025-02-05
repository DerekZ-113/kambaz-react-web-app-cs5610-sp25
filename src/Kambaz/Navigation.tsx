import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaBook, FaCalendar, FaInbox } from "react-icons/fa";
import { GoBeaker } from "react-icons/go";
import { ImMeter } from "react-icons/im";
import { BsPeople } from "react-icons/bs";
import './Navigation.css';

export default function KambazNavigation() {
    return (
        <Nav variant="tabs" id="wd-kambaz-navigation" className="custom-nav d-none d-md-block rounded-0 position-fixed bottom-0 top-0 bg-black z-2">
            <Nav.Item>
                <Nav.Link className="custom-nav-link text-danger text-center" href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank">
                    <img src="/images/NU_icon.png" width="75px" />
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Kambaz/Account" id="wd-account-link" className="custom-nav-link text-white text-center">
                    <BsPeople className="fs-1 text-white"/>Account
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Kambaz/Dashboard" id="wd-dashboard-link" className="custom-nav-link text-white text-center">
                    <ImMeter className="fs-1 text-danger"/>Dashboard
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Kambaz/Courses" id="wd-course-link" className="custom-nav-link text-white text-center">
                    <FaBook className="fs-1 text-danger"/>Courses
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Kambaz/Calendar" id="wd-calendar-link" className="custom-nav-link text-white text-center">
                    <FaCalendar className="fs-1 text-danger"/>Calendar
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Kambaz/Inbox" id="wd-inbox-link" className="custom-nav-link text-white text-center">
                    <FaInbox className="fs-1 text-danger"/>Inbox
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={NavLink} to="/Labs" id="wd-labs-link" className="custom-nav-link text-white text-center">
                    <GoBeaker className="fs-1 text-danger"/>Labs
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}