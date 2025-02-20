import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignment = db.assignments.find((a) => a._id === aid);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return (
        <div id="wd-assignments-editor" className="p-4">
            <Form>
                <Form.Group className="mb-4">
                    <Form.Label><h3>Assignment Name</h3></Form.Label>
                    <Form.Control 
                        id="wd-name"
                        defaultValue={assignment.title}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        id="wd-description"
                        as="textarea" 
                        rows={10}
                        defaultValue={assignment.description}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Points</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            id="wd-points"
                            type="number"
                            defaultValue={assignment.points}
                            style={{ width: '100px' }}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Assignment Group</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-group" style={{ width: '200px' }}>
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECT">PROJECT</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Display Grade as</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-display-grade-as" style={{ width: '200px' }}>
                            <option value="Percentage">Percentage</option>
                            <option value="Points">Points</option>
                            <option value="Letter Grade">Letter Grade</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Due Date</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            id="wd-due-date"
                            type="date"
                            defaultValue={assignment.dueDate.split('T')[0]}
                            style={{ width: '200px' }}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Available from</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            id="wd-available-from"
                            type="date"
                            defaultValue={assignment.availableFrom.split('T')[0]}
                            style={{ width: '200px' }}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Submission Type</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-submission-type" className="mb-3" style={{ width: '200px' }}>
                            <option value="Online">Online</option>
                            <option value="Paper">Paper</option>
                        </Form.Select>

                        <div className="mb-3">
                            <strong>Online Entry Options</strong>
                            <Form.Check 
                                type="checkbox"
                                id="wd-text-entry"
                                label="Text Entry"
                                className="mt-2"
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-website-url"
                                label="Website URL"
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-media-recordings"
                                label="Media Recordings"
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-student-annotation"
                                label="Student Annotation"
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-file-upload"
                                label="File Uploads"
                            />
                        </div>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="text-end d-block">Assign</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Form.Group className="mb-3">
                            <Form.Label>Assign to</Form.Label>
                            <Form.Control 
                                id="wd-assign-to"
                                defaultValue="Everyone"
                                style={{ width: '200px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Due</Form.Label>
                            <Form.Control
                                id="wd-due-date"
                                type="date"
                                defaultValue="2024-05-13"
                                style={{ width: '200px' }}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Available from</Form.Label>
                                    <Form.Control
                                        id="wd-available-from"
                                        type="date"
                                        defaultValue="2024-05-06"
                                        style={{ width: '200px' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Until</Form.Label>
                                    <Form.Control
                                        id="wd-available-until"
                                        type="date"
                                        defaultValue="2024-05-13"
                                        style={{ width: '200px' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <hr />

                <div className="text-end">
                    <Link 
                        to={`/Kambaz/Courses/${cid}/Assignments`}
                        className="btn btn-light me-2"
                    >
                        Cancel
                    </Link>
                    <Link 
                        to={`/Kambaz/Courses/${cid}/Assignments`}
                        className="btn btn-danger"
                    >
                        Save
                    </Link>
                </div>
            </Form>
        </div>
    );
}