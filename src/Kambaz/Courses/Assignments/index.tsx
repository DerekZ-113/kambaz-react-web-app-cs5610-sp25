import { Form, Button, ListGroup } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import LessonControlButtons from "../Modules/LessonControlButtons";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import * as db from "../../Database";
import "../../style.css";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments.filter(
        (assignment) => assignment.course === cid
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Group className="d-flex align-items-center w-50">
                    <FaSearch className="position-absolute ms-3 text-secondary" />
                    <Form.Control
                        id="wd-search-assignment"
                        placeholder="Search for Assignments"
                        className="ps-5"
                    />
                </Form.Group>
                <div>
                    <Button variant="secondary" className="me-2">
                        <FaPlus className="me-2" />Group
                    </Button>
                    <Button variant="secondary bg-danger text-white">
                        <FaPlus className="me-2" />Assignment
                    </Button>
                </div>
            </div>

            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> 
                        ASSIGNMENTS
                        <ModuleControlButtons /> 
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {assignments.map((assignment) => (
                            <ListGroup.Item 
                                key={assignment._id}
                                className="wd-lesson p-3 ps-1"
                            > 
                                <BsGripVertical className="me-2 fs-3" />
                                <LuNotebookPen className="text-success"/>
                                <Link 
                                    to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                    className="wd-assignment-link text-black fw-bold text-decoration-none"
                                >
                                    {assignment.title}
                                </Link>
                                <div className="ms-4 text-secondary">
                                    <span className="text-danger">Multiple Modules</span> | 
                                    <b> Not available until</b> May 6 at 12:00am |<br />
                                    <b>Due</b> May 13 at 11:59pm | 100pts
                                </div>
                                <LessonControlButtons />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}