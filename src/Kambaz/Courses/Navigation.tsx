import { ListGroup } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";
import "../style.css";
import { courses } from "../Database";

export default function CourseNavigation() {
    const { pathname } = useLocation();
    const { cid } = useParams();
    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
    const currentSection = pathname.split("/").pop() || "Home";

    const course = courses.find((course) => course._id === cid);

    return (
        <>
            <div className="wd-course-breadcrumb">
                <h2 className="text-danger">
                    <FaAlignJustify className="me-3 fs-4 mb-1" />
                    {course && course.name} &gt; {currentSection}
                </h2>
            </div>
            <div className="wd-course-navigation">
                <ListGroup className="wd-navigation d-md-block rounded-0 bg-white z-2">
                    {links.map((link) => (
                        <ListGroup.Item
                            key={link}
                            as={Link}
                            to={`/Kambaz/Courses/${cid}/${link}`}
                            active={pathname.includes(`/${link}`)}
                            action
                            className="border-0 text-danger"
                            id={`wd-course-${link.toLowerCase()}-link`}
                        >
                            {link}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </>
    );
}