import { Form, Button, ListGroup, Modal } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, deleteAssignment } from "./reducer";
import { v4 as uuidv4 } from 'uuid';
import ProtectedContent from "../../Account/ProtectedContent";
import { useState } from "react";

export default function Assignments() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    
    // State for delete confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
    
    const filteredAssignments = assignments.filter(
        (assignment: any) => assignment.course === cid
    );
    
    const handleAddAssignment = () => {
        const newAssignmentId = uuidv4();
        const newAssignment = {
            _id: newAssignmentId,
            title: "New Assignment",
            description: "New Assignment Description",
            course: cid,
            availableFrom: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            points: 100,
            modules: ["Multiple Modules"]
        };
        
        dispatch(addAssignment(newAssignment));
        
        // Navigate to the editor for the new assignment
        navigate(`/Kambaz/Courses/${cid}/Assignments/${newAssignmentId}`);
    };
    
    // Open confirmation dialog
    const confirmDeleteAssignment = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setAssignmentToDelete(id);
        setShowConfirmModal(true);
    };
    
    // Handle confirmed deletion
    const handleConfirmedDelete = () => {
        if (assignmentToDelete) {
            dispatch(deleteAssignment(assignmentToDelete));
            setShowConfirmModal(false);
            setAssignmentToDelete(null);
        }
    };
    
    // Cancel deletion
    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setAssignmentToDelete(null);
    };

    return (
        <div>
            {/* Delete Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this assignment?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmedDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Group className="d-flex align-items-center w-50">
                    <FaSearch className="position-absolute ms-3 text-secondary" />
                    <Form.Control
                        id="wd-search-assignment"
                        placeholder="Search for Assignments"
                        className="ps-5"
                    />
                </Form.Group>
                <ProtectedContent>
                    <div>
                        <Button variant="secondary" className="me-2">
                            <FaPlus className="me-2" />Group
                        </Button>
                        <Button 
                            variant="secondary bg-danger text-white"
                            onClick={handleAddAssignment}
                        >
                            <FaPlus className="me-2" />Assignment
                        </Button>
                    </div>
                </ProtectedContent>
            </div>

            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3" /> 
                        ASSIGNMENTS
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {filteredAssignments.map((assignment: any) => (
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
                                    <span className="text-danger">{assignment.modules}</span> | 
                                    <b> Not available until</b> {new Date(assignment.availableFrom).toLocaleDateString()} |<br />
                                    <b>Due</b> {new Date(assignment.dueDate).toLocaleDateString()} | {assignment.points}pts
                                </div>
                                <ProtectedContent>
                                    <div className="float-end">
                                        <Button 
                                            className="btn-sm btn-danger"
                                            onClick={(e) => confirmDeleteAssignment(assignment._id, e)}
                                        >
                                            Delete
                                        </Button>
                                        <Button 
                                            className="btn-sm btn-warning me-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </ProtectedContent>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}