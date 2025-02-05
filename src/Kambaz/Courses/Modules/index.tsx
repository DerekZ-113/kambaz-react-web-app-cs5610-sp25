import { ListGroup } from "react-bootstrap";
import ModulesControls from "./ModulesControls";

export default function Modules() {
    return (
        <div>
            <ModulesControls /><br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                <div className="wd-title p-3 ps-2 bg-secondary"> Week 1 </div>
                <ListGroup className="wd-lessons rounded-0">
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                    LEARNING OBJECTIVES </ListGroup.Item>
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                    Introduction to the course </ListGroup.Item>
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                    Learn what is Web Development </ListGroup.Item>
                </ListGroup>
                </ListGroup.Item>
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                <div className="wd-title p-3 ps-2 bg-secondary"> Week 2 </div>
                <ListGroup className="wd-lessons rounded-0">
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                    LESSON 1 </ListGroup.Item>
                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                    LESSON 2 </ListGroup.Item>
                </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}