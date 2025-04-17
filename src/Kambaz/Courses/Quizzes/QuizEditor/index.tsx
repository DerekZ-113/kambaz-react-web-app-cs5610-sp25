import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button, Alert, Spinner, ButtonGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../Kambaz/store';
import { setCurrentQuiz, updateQuiz, setError, setLoading } from '../reducer';
import * as client from '../client';
import { Quiz } from '../types';
import DetailsTab from './DetailsTab';
import QuestionsTab from './QuestionsTab';
import './styles/QuizEditor.css';

interface QuizEditorProps {
  currentUser?: any;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ currentUser: propCurrentUser }) => {
  const { cid, quizId } = useParams<{ cid: string; quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get state from Redux
  const reduxUser = useSelector((state: RootState) => state.accountReducer.currentUser);
  const currentUser = propCurrentUser || reduxUser;
  const { currentQuiz, loading, error } = useSelector((state: RootState) => state.quizzesReducer);
  
  // Local state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: 'success' | 'danger' | null;
  }>({ message: '', type: null });
  
  // Load quiz data
  useEffect(() => {
    const userRole = currentUser?.role || '';
    const hasFacultyAccess = userRole === 'FACULTY' || userRole === 'ADMIN';
    
    if (!hasFacultyAccess) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      return;
    }
    
    const loadQuiz = async () => {
      try {
        dispatch(setLoading(true));
        
        if (quizId === 'new') {
          // Redirect to the NewQuiz component
          navigate(`/Kambaz/Courses/${cid}/Quizzes/new`);
          return;
        } 
        
        if (quizId) {
          const data = await client.findQuizById(quizId);
          
          // Check if current user can edit this quiz
          if (data.creator && data.creator !== currentUser?._id && userRole !== 'ADMIN') {
            dispatch(setError('You can only edit quizzes you created.'));
            navigate(`/Kambaz/Courses/${cid}/Quizzes`);
            return;
          }
          
          // Update Redux and local state
          dispatch(setCurrentQuiz(data));
          setQuiz(data);
        }
      } catch (err: any) {
        console.error('Failed to load quiz:', err);
        dispatch(setError(err.message || 'Failed to load quiz. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadQuiz();
  }, [quizId, currentUser, cid, navigate, dispatch]);
  
  // Update local state when Redux state changes
  useEffect(() => {
    if (currentQuiz) {
      setQuiz(currentQuiz);
    }
  }, [currentQuiz]);
  
  // Handle quiz updates from child components
  const handleQuizUpdate = (updatedQuiz: Quiz) => {
    setQuiz(updatedQuiz);
  };
  
  // Save quiz changes
  const handleSave = async (publishAfterSave: boolean = false) => {
    if (!quiz) return;
    
    try {
      setSaveStatus({ message: 'Saving...', type: null });
      dispatch(setLoading(true));
      
      // If we're publishing, update the quiz object
      const quizToSave = publishAfterSave 
        ? { ...quiz, published: true } 
        : quiz;
      
      const savedQuiz = await client.updateQuiz(quiz._id, quizToSave);
      
      // Update Redux state
      dispatch(updateQuiz(savedQuiz));
      
      // Update local state
      setQuiz(savedQuiz);
      
      setSaveStatus({ 
        message: publishAfterSave 
          ? 'Quiz saved and published successfully!' 
          : 'Quiz saved successfully!', 
        type: 'success' 
      });
      
      // Navigate based on save type
      setTimeout(() => {
        if (publishAfterSave) {
          navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } else {
          navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/details`);
        }
      }, 1000);
      
    } catch (err: any) {
      console.error('Failed to save quiz:', err);
      setSaveStatus({ 
        message: err.message || 'Failed to save quiz', 
        type: 'danger' 
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  // Handle cancellation
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  };

  if (loading && !quiz) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading quiz details...</span>
        </Spinner>
        <p className="mt-3">Loading quiz details...</p>
      </div>
    );
  }
  
  if (error && !quiz) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error Loading Quiz</Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button 
            variant="outline-danger"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Return to Quizzes
          </Button>
        </div>
      </Alert>
    );
  }

  if (!quiz) {
    return (
      <Alert variant="warning" className="m-3">
        <Alert.Heading>Quiz Not Found</Alert.Heading>
        <p>The requested quiz could not be found.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button 
            variant="outline-warning"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Return to Quizzes
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="quiz-editor-container">
      <div className="quiz-editor-header">
        <h2>{quiz._id ? `Edit Quiz: ${quiz.title}` : 'Create New Quiz'}</h2>
        <div className="quiz-editor-actions">
          <ButtonGroup>
            <Button variant="outline-secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={() => handleSave(false)}>
              Save
            </Button>
            <Button variant="primary" onClick={() => handleSave(true)}>
              Save and Publish
            </Button>
          </ButtonGroup>
        </div>
      </div>
      
      {saveStatus.message && (
        <Alert variant={saveStatus.type || 'info'} className="mt-3">
          {saveStatus.message}
        </Alert>
      )}
      
      {loading && (
        <Alert variant="info" className="mt-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Processing...
        </Alert>
      )}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'details')}
        className="quiz-editor-tabs mt-4"
      >
        <Tab eventKey="details" title="Details">
          <DetailsTab quiz={quiz} onQuizUpdate={handleQuizUpdate} />
        </Tab>
        <Tab eventKey="questions" title="Questions" disabled={!quiz._id}>
          {quiz._id && quiz._id !== '' ? (
            <QuestionsTab quizId={quiz._id} />
          ) : (
            <div className="p-4">
              <Alert variant="info">
                Save the quiz details first to add questions.
              </Alert>
            </div>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default QuizEditor;