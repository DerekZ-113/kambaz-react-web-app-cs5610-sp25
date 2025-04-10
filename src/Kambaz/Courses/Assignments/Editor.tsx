import { Form, Row, Col, Alert } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ProtectedContent from "../../Account/ProtectedContent";
import * as client from "./client";
import { updateAssignment } from "./reducer";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    
    const [assignment, setAssignment] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isReadOnly = !currentUser || currentUser.role !== "FACULTY";
    
    // Fetch assignment data directly from API
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                setLoading(true);
                if (aid) {
                    const data = await client.fetchAssignment(aid);
                    setAssignment(data);
                    setFormData(data);
                }
            } catch (err) {
                console.error("Error loading assignment:", err);
                setError("Failed to load assignment details");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAssignment();
    }, [aid]);
    
    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };
    
    const formatDate = (dateStr: string | Date) => {
        if (!dateStr) return "";
        
        // Handle various date formats
        const date = dateStr instanceof Date 
            ? dateStr 
            : new Date(dateStr);
            
        return date.toISOString().split('T')[0];
    };
    
    const handleSave = async () => {
        try {
            // Call the API
            const updatedAssignment = await client.updateAssignment(aid as string, formData);
            
            // Update Redux store
            dispatch(updateAssignment(updatedAssignment));
            
            // Navigate away
            navigate(`/Kambaz/Courses/${cid}/Assignments`);
        } catch (err) {
            console.error("Error saving assignment:", err);
            setError("Failed to save assignment changes");
        }
    };

    if (loading) {
        return <div>Loading assignment...</div>;
    }
    
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return (
        <div id="wd-assignments-editor" className="p-4">
            <Form>
                {/* Form fields - using formatDate for date fields */}
                <Form.Group className="mb-4">
                    <Form.Label><h3>Assignment Name</h3></Form.Label>
                    <Form.Control 
                        id="wd-name"
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        readOnly={isReadOnly}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        id="wd-description"
                        as="textarea" 
                        rows={10}
                        value={formData.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        readOnly={isReadOnly}
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
                            value={formData.points || ""}
                            onChange={(e) => handleChange("points", parseInt(e.target.value))}
                            style={{ width: '100px' }}
                            readOnly={isReadOnly}
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
                        <Form.Select 
                            id="wd-group" 
                            value={formData.group || "ASSIGNMENTS"} 
                            onChange={(e) => handleChange("group", e.target.value)}
                            style={{ width: '200px' }} 
                            disabled={isReadOnly}
                        >
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
                        <Form.Select 
                            id="wd-display-grade-as" 
                            value={formData.displayGradeAs || "Percentage"} 
                            onChange={(e) => handleChange("displayGradeAs", e.target.value)}
                            style={{ width: '200px' }} 
                            disabled={isReadOnly}
                        >
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
                            value={formatDate(formData.dueDate)}
                            onChange={(e) => handleChange("dueDate", e.target.value)}
                            style={{ width: '200px' }}
                            readOnly={isReadOnly}
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
                            value={formatDate(formData.availableFrom)}
                            onChange={(e) => handleChange("availableFrom", e.target.value)}
                            style={{ width: '200px' }}
                            readOnly={isReadOnly}
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
                        <Form.Select 
                            id="wd-submission-type" 
                            value={formData.submissionType || "Online"} 
                            onChange={(e) => handleChange("submissionType", e.target.value)}
                            className="mb-3" 
                            style={{ width: '200px' }} 
                            disabled={isReadOnly}
                        >
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
                                checked={formData.textEntry || false}
                                onChange={(e) => handleChange("textEntry", e.target.checked)}
                                disabled={isReadOnly}
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-website-url"
                                label="Website URL"
                                checked={formData.websiteUrl || false}
                                onChange={(e) => handleChange("websiteUrl", e.target.checked)}
                                disabled={isReadOnly}
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-media-recordings"
                                label="Media Recordings"
                                checked={formData.mediaRecordings || false}
                                onChange={(e) => handleChange("mediaRecordings", e.target.checked)}
                                disabled={isReadOnly}
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-student-annotation"
                                label="Student Annotation"
                                checked={formData.studentAnnotation || false}
                                onChange={(e) => handleChange("studentAnnotation", e.target.checked)}
                                disabled={isReadOnly}
                            />
                            <Form.Check 
                                type="checkbox"
                                id="wd-file-upload"
                                label="File Uploads"
                                checked={formData.fileUploads || false}
                                onChange={(e) => handleChange("fileUploads", e.target.checked)}
                                disabled={isReadOnly}
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
                                value={formData.assignTo || "Everyone"}
                                onChange={(e) => handleChange("assignTo", e.target.value)}
                                style={{ width: '200px' }}
                                readOnly={isReadOnly}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Due</Form.Label>
                            <Form.Control
                                id="wd-due-date"
                                type="date"
                                value={formatDate(formData.dueDate)}
                                onChange={(e) => handleChange("dueDate", e.target.value)}
                                style={{ width: '200px' }}
                                readOnly={isReadOnly}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Available from</Form.Label>
                                    <Form.Control
                                        id="wd-available-from"
                                        type="date"
                                        value={formatDate(formData.availableFrom)}
                                        onChange={(e) => handleChange("availableFrom", e.target.value)}
                                        style={{ width: '200px' }}
                                        readOnly={isReadOnly}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Until</Form.Label>
                                    <Form.Control
                                        id="wd-available-until"
                                        type="date"
                                        value={formatDate(formData.availableUntil)}
                                        onChange={(e) => handleChange("availableUntil", e.target.value)}
                                        style={{ width: '200px' }}
                                        readOnly={isReadOnly}
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
                    <ProtectedContent>
                        <button 
                            type="button"
                            className="btn btn-danger"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </ProtectedContent>
                </div>
            </Form>
        </div>
    );
}