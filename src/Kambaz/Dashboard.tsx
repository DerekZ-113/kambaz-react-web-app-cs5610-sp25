import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "./hooks"; 
import { enrollInCourse, unenrollFromCourse } from "./Courses/Enrollments/reducer";
import ProtectedContent from "./Account/ProtectedContent";
import { User } from "./Account/types";

export default function Dashboard(
    { courses, course, setCourse, addNewCourse,
        deleteCourse, updateCourse }: {
        courses: any[]; course: any; setCourse: (course: any) => void;
        addNewCourse: () => void; deleteCourse: (course: any) => void;
        updateCourse: () => void; })
{
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.accountReducer);
    const { enrollments, loading } = useAppSelector((state) => state.enrollmentsReducer);
    
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [processingCourseId, setProcessingCourseId] = useState<string | null>(null);
    
    // Use type guard to ensure currentUser has the right properties
    const isStudent = currentUser?.role === "STUDENT";
    
    const isEnrolled = (courseId: string) => {
        if (!enrollments || !currentUser?._id) return false;
        
        return enrollments.some(
            (enrollment) => 
                enrollment.user === currentUser._id && 
                enrollment.course === courseId
        );
    };
    
    const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!currentUser?._id) return;
        
        setProcessingCourseId(courseId);
        try {
            await dispatch(enrollInCourse({ 
                userId: currentUser._id, 
                courseId 
            }));
        } finally {
            setProcessingCourseId(null);
        }
    };
    
    const handleUnenroll = async (courseId: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!currentUser?._id) return;
        
        setProcessingCourseId(courseId);
        try {
            await dispatch(unenrollFromCourse({ 
                userId: currentUser._id, 
                courseId 
            }));
        } finally {
            setProcessingCourseId(null);
        }
    };
    
    const handleCourseNavigation = (courseId: string, e: React.MouseEvent) => {
        if (isStudent && !isEnrolled(courseId)) {
            e.preventDefault();
        }
    };

    const displayCourses = showAllCourses 
        ? courses 
        : (courses || []).filter((c) => isEnrolled(c._id));

    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">
                Dashboard
                {isStudent && (
                    <Button 
                        variant={showAllCourses ? "primary" : "secondary"}
                        className="float-end"
                        onClick={() => setShowAllCourses(!showAllCourses)}
                    >
                        {showAllCourses ? "All Courses" : "Enrollments"}
                    </Button>
                )}
            </h1>
            <hr />

            {loading && <div className="alert alert-info">Loading enrollments...</div>}

            <ProtectedContent>
                <h5>New Course
                    <button className="btn btn-primary float-end"
                        id="wd-add-new-course-click"
                        onClick={addNewCourse}> Add </button>
                    <button className="btn btn-warning float-end me-2"
                        onClick={updateCourse} id="wd-update-course-click">
                        Update
                    </button>
                </h5><hr />
                <input value={course.name} className="form-control mb-2" 
                    onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                <textarea value={course.description} className="form-control" 
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}/>
            </ProtectedContent>

            <h2 id="wd-dashboard-published">Published Courses ({displayCourses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    {displayCourses.map((course) => (
                        <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                            <Card>
                                <Link 
                                    to={`/Kambaz/Courses/${course._id}/Home`}
                                    className="wd-dashboard-course-link text-decoration-none text-dark"
                                    onClick={(e) => handleCourseNavigation(course._id, e)}
                                >
                                    <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                                    <Card.Body className="card-body">
                                        <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                            {course.name}
                                        </Card.Title>
                                        <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                            {course.description}
                                        </Card.Text>
                                        <Button variant="primary">Go</Button>
                                        
                                        <ProtectedContent>
                                            <Button 
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    deleteCourse(course._id);
                                                }} 
                                                className="btn btn-danger float-end"
                                                id="wd-delete-course-click">
                                                Delete
                                            </Button>
                                            <Button 
                                                id="wd-edit-course-click"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setCourse(course);
                                                }}
                                                className="btn btn-warning me-2 float-end" >
                                                Edit
                                            </Button>
                                        </ProtectedContent>
                                        
                                        {isStudent && !isEnrolled(course._id) && (
                                            <Button 
                                                variant="success"
                                                className="float-end"
                                                disabled={processingCourseId === course._id || loading}
                                                onClick={(e) => handleEnroll(course._id, e)}
                                            >
                                                {processingCourseId === course._id ? "Processing..." : "Enroll"}
                                            </Button>
                                        )}
                                        
                                        {isStudent && isEnrolled(course._id) && (
                                            <Button 
                                                variant="danger"
                                                className="float-end"
                                                disabled={processingCourseId === course._id || loading}
                                                onClick={(e) => handleUnenroll(course._id, e)}
                                            >
                                                {processingCourseId === course._id ? "Processing..." : "Unenroll"}
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}
