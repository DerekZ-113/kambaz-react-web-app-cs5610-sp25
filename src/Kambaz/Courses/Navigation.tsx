import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../style.css";

export default function CourseNavigation() {
    const { pathname } = useLocation();

    return (
        <div className="wd-course-navigation">
            <ListGroup className="wd-navigation d-md-block rounded-0 bg-white z-2 ">
                <ListGroup.Item 
                    as={Link} 
                    to="/Kambaz/Courses/1234/Home"
                    active={pathname.includes("/Home")}
                    action
                    className="border-0 text-danger"
                    id="wd-course-home-link">
                    Home
                </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/Modules"
                active={pathname.includes("/Modules")}
                action
                className="border-0 text-danger"
                id="wd-course-modules-link">
                Modules
            </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/Piazza"
                active={pathname.includes("/Piazza")}
                action
                className="border-0 text-danger"
                id="wd-course-piazza-link">
                Piazza
            </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/Zoom"
                active={pathname.includes("/Zoom")}
                action
                className="border-0 text-danger"
                id="wd-course-zoom-link">
                Zoom
            </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/Assignments"
                active={pathname.includes("/Assignments")}
                action
                className="border-0 text-danger"
                id="wd-course-assignments-link">
                Assignments
            </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/Quizzes"
                active={pathname.includes("/Quizzes")}
                action
                className="border-0 text-danger"
                id="wd-course-quizzes-link">
                Quizzes
            </ListGroup.Item>
            <ListGroup.Item 
                as={Link} 
                to="/Kambaz/Courses/1234/People"
                active={pathname.includes("/People")}
                action
                className="border-0 text-danger"
                id="wd-course-people-link">
                People
            </ListGroup.Item>
        </ListGroup>
        </div>
    );
}