import { Form, Button, ListGroup } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import LessonControlButtons from "../Modules/LessonControlButtons";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import "../../style.css";

export default function Assignments() {
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
                    <Button 
                        variant="secondary" 
                        className="me-2">
                        <FaPlus className="me-2" />Group
                    </Button>
                    <Button 
                        variant="secondary bg-danger text-white">
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
                        <ListGroup.Item className="wd-lesson p-3 ps-1"> 
                            <BsGripVertical className="me-2 fs-3" />
                            <LuNotebookPen />
                            <a href="#/Kambaz/Courses/1234/Assignments/123" 
                            className="wd-assignment-link text-black text-decoration-none">
                                A1
                            </a>
                            <div className="ms-4 text-secondary">
                                <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |<br />
                                <b>Due</b> May 13 at 11:59pm | 100pts
                            </div>
                            <LessonControlButtons />
                        </ListGroup.Item>

                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />
                            <LuNotebookPen />
                            <a href="#/Kambaz/Courses/1234/Assignments/124" 
                            className="wd-assignment-link text-black text-decoration-none">
                                A2
                            </a>
                            <div className="ms-4 text-secondary">
                                <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 13 at 12:00am |<br />
                                <b>Due</b> May 20 at 11:59pm | 100pts
                            </div>
                            <LessonControlButtons />
                        </ListGroup.Item>

                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <BsGripVertical className="me-2 fs-3" />
                            <LuNotebookPen />
                            <a href="#/Kambaz/Courses/1234/Assignments/125" 
                            className="wd-assignment-link text-black text-decoration-none">
                                A3
                            </a>
                            <div className="ms-4 text-secondary">
                                <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 20 at 12:00am |<br />
                                <b>Due</b> May 27 at 11:59pm | 100pts
                            </div>
                            <LessonControlButtons />
                        </ListGroup.Item>
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}