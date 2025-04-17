import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Alert, Form, ListGroup, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../Kambaz/store";
import { setQuizzes, setLoading, setError } from "./reducer";
import * as client from "./client";
import QuizCard from "./components/QuizCard";
import "./styles/QuizzesList.css";
import ProtectedContent from "../../Account/ProtectedContent";
import { FaPlus, FaSearch } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";

interface QuizzesProps {
  currentUser?: any;
}

const Quizzes: React.FC<QuizzesProps> = ({ currentUser: propCurrentUser }) => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get state from Redux
  const reduxUser = useSelector((state: RootState) => state.accountReducer.currentUser);
  const { quizzes, loading, error } = useSelector((state: RootState) => state.quizzesReducer);
  
  // Use Redux user if available, fall back to prop
  const currentUser = reduxUser || propCurrentUser;
  
  // Simplified user role logic
  const userRole = currentUser?.role || "STUDENT";
  const isFaculty = userRole === "FACULTY" || userRole === "ADMIN";

  // Fetch quizzes when component mounts or cid changes
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        if (!cid) {
          dispatch(setError("Course ID is missing"));
          return;
        }
        
        dispatch(setLoading(true));
        const quizzesData = await client.findQuizzesForCourse(cid);
        dispatch(setQuizzes(quizzesData));
      } catch (err: any) {
        console.error("Error loading quizzes:", err);
        dispatch(setError(err.message || "Failed to load quizzes"));
      }
    };
    
    loadQuizzes();
    
    // Check for error in location state (e.g., from navigation)
    if (location.state?.error) {
      dispatch(setError(location.state.error));
    }
  }, [dispatch, cid, location.state]);

  // Handle creating a new quiz
  const handleAddQuiz = () => {
    if (!currentUser?._id) {
      dispatch(setError("You must be logged in to create a quiz"));
      return;
    }
    
    if (!cid) {
      dispatch(setError("Course ID is required to create a quiz"));
      return;
    }
    
    navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
  };

  // Filter quizzes by search term
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Form.Group className="d-flex align-items-center w-50">
          <FaSearch className="position-absolute ms-3 text-secondary" />
          <Form.Control
            id="wd-search-quiz"
            placeholder="Search for Quizzes"
            className="ps-5"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        
        {/* Create Quiz Button - for faculty only */}
        <ProtectedContent>
          <div>
            <Button 
              variant="secondary bg-danger text-white"
              onClick={handleAddQuiz}
              disabled={loading}
            >
              <FaPlus className="me-2" />Quiz
            </Button>
          </div>
        </ProtectedContent>
      </div>

      {/* Error message if there is one */}
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => dispatch(setError(null))}>
          <strong>Error: </strong>{error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center p-3">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading quizzes...</span>
          </Spinner>
        </div>
      )}

      {/* Quiz list */}
      <ListGroup className="rounded-0" id="wd-quizzes">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> 
            QUIZZES
          </div>
          <ListGroup className="wd-items rounded-0">
            {!loading && filteredQuizzes.length === 0 ? (
              <ListGroup.Item className="p-3 text-center">
                {searchTerm ? 
                  `No quizzes match your search: "${searchTerm}"` :
                  isFaculty 
                    ? "No quizzes yet. Click the 'Create Quiz' button to create one." 
                    : "No quizzes available for this course yet."}
              </ListGroup.Item>
            ) : (
              filteredQuizzes.map(quiz => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  userRole={userRole}
                  cid={cid || ''}
                  onQuizUpdated={async () => {
                    try {
                      if (!cid) return;
                      const refreshedQuizzes = await client.findQuizzesForCourse(cid);
                      dispatch(setQuizzes(refreshedQuizzes));
                    } catch (err: any) {
                      console.error("Failed to refresh quizzes:", err);
                    }
                  }}
                />
              ))
            )}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default Quizzes;