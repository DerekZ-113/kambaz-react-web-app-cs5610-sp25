import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addQuiz, setLoading, setError } from './Quizzes/reducer';
import * as client from './Quizzes/client';
import { Quiz } from './Quizzes/types';
import { RootState } from '../../Kambaz/store';
import { Alert, Spinner } from 'react-bootstrap';

interface NewQuizProps {
  currentUser?: any;
}

const NewQuiz: React.FC<NewQuizProps> = ({ currentUser: propCurrentUser }) => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Use Redux state as fallback
  const reduxUser = useSelector((state: RootState) => state.accountReducer.currentUser);
  const currentUser = propCurrentUser || reduxUser;
  const { error: globalError } = useSelector((state: RootState) => state.quizzesReducer);
  
  useEffect(() => {
    // Authorization check
    const userRole = currentUser?.role || '';
    const hasFacultyAccess = userRole === 'FACULTY' || userRole === 'ADMIN';
    
    if (!hasFacultyAccess) {
      console.warn("Unauthorized access attempt to create quiz");
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      return;
    }
    
    // Required fields check
    if (!currentUser?._id) {
      setLocalError("User information is missing. Please log in again.");
      return;
    }
    
    if (!cid) {
      setLocalError("Course information is missing. Please navigate from a course page.");
      return;
    }
    
    const createQuiz = async () => {
      try {
        // Set loading state
        dispatch(setLoading(true));
        
        // Create a new quiz template with today + 1 week due date
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const newQuiz: Partial<Quiz> = {
          title: "New Quiz",
          description: "New Quiz Description",
          course: cid,
          quizType: "GRADED_QUIZ",
          points: 10,
          assignmentGroup: "QUIZZES", 
          shuffleAnswers: true,
          timeLimit: 30,
          multipleAttempts: false,
          attemptsAllowed: 1,
          showCorrectAnswers: "AFTER_SUBMISSION",
          availableDate: today.toISOString(),
          dueDate: nextWeek.toISOString(),
          published: false,
          creator: currentUser._id
        };

        // Ensure cid is a string
        if (typeof cid !== 'string') {
          throw new Error("Invalid course ID format");
        }
        
        console.log("Creating quiz with data:", newQuiz);
        const savedQuiz = await client.createQuiz(cid, newQuiz);
        
        if (savedQuiz && savedQuiz._id) {
          console.log("Quiz created successfully:", savedQuiz);
          
          // Update Redux store
          dispatch(addQuiz(savedQuiz));
          
          // Clear any errors
          dispatch(setError(null));
          
          // Navigate to edit
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${savedQuiz._id}/edit`);
        } else {
          throw new Error("Invalid response from server when creating quiz");
        }
      } catch (err: any) {
        console.error("Error creating quiz:", err);
        
        // Set error in Redux
        dispatch(setError(err.message || "Failed to create quiz. Please try again later."));
        
        // Also set local error
        setLocalError(err.message || "Failed to create quiz. Please try again later.");
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    createQuiz();
  }, [cid, currentUser, dispatch, navigate]);
  
  const error = localError || globalError;
  
  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error Creating Quiz</Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <button 
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)} 
            className="btn btn-outline-danger"
          >
            Return to Quizzes
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="text-center p-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Creating quiz...</span>
      </Spinner>
      <p className="mt-3">Creating a new quiz...</p>
    </div>
  );
};

export default NewQuiz;