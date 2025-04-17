import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Kambaz/store';
import { setCurrentQuiz, setLoading, setError } from './reducer';
import * as client from './client';
import { Button, Card, Row, Col, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import { AiOutlineClockCircle, AiOutlineEdit, AiOutlineEye, AiOutlinePlayCircle } from 'react-icons/ai';
import './styles/QuizDetails.css';

interface QuizDetailsProps {
  currentUser?: any;
}

const QuizDetails: React.FC<QuizDetailsProps> = ({ currentUser: propCurrentUser }) => {
  const { cid, quizId } = useParams<{ cid: string; quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const reduxUser = useSelector((state: RootState) => state.accountReducer.currentUser);
  const currentUser = propCurrentUser || reduxUser;
  const { currentQuiz, loading, error } = useSelector((state: RootState) => state.quizzesReducer);

  // User role for permissions
  const userRole = currentUser?.role || "STUDENT";
  const isFaculty = userRole === "FACULTY" || userRole === "ADMIN";

  // Fetch quiz details when component mounts
  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) {
        dispatch(setError('Quiz ID is missing'));
        return;
      }

      try {
        dispatch(setLoading(true));
        const quiz = await client.findQuizById(quizId);
        dispatch(setCurrentQuiz(quiz));
      } catch (err: any) {
        console.error("Error fetching quiz details:", err);
        dispatch(setError(err.message || 'Failed to load quiz details'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchQuizDetails();

    // Clear current quiz when component unmounts
    return () => {
      dispatch({ type: 'quizzes/clearCurrentQuiz' });
    };
  }, [quizId, dispatch]);

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigate to edit screen
  const handleEdit = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/edit`);
  };

  // Navigate to preview screen
  const handlePreview = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/preview`);
  };

  // For students: start the quiz
  const handleStartQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/take`);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading quiz details...</span>
        </Spinner>
      </div>
    );
  }

  // Display error state
  if (error) {
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
            Return to Quiz List
          </Button>
        </div>
      </Alert>
    );
  }

  // Display if quiz not found
  if (!currentQuiz) {
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
            Return to Quiz List
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="quiz-details-container">
      <Card className="quiz-details-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h2>{currentQuiz.title}</h2>
            <div className="quiz-status mt-1">
              <Badge bg={currentQuiz.published ? "success" : "secondary"}>
                {currentQuiz.published ? "Published" : "Unpublished"}
              </Badge>
            </div>
          </div>
          <div className="quiz-actions">
            {isFaculty ? (
              <>
                <Button 
                  variant="outline-primary" 
                  className="me-2" 
                  onClick={handlePreview}
                >
                  <AiOutlineEye className="me-1" /> Preview
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleEdit}
                >
                  <AiOutlineEdit className="me-1" /> Edit
                </Button>
              </>
            ) : (
              <Button 
                variant="success" 
                onClick={handleStartQuiz}
                disabled={!currentQuiz.published}
              >
                <AiOutlinePlayCircle className="me-1" /> Start Quiz
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          {currentQuiz.description && (
            <Card.Text className="quiz-description mb-4">
              {currentQuiz.description}
            </Card.Text>
          )}

          <h4 className="mb-3">Quiz Properties</h4>
          <Row>
            <Col md={6}>
              <ListGroup variant="flush" className="quiz-props-list">
                <ListGroup.Item>
                  <span className="prop-name">Quiz Type:</span>
                  <span className="prop-value">
                    {currentQuiz.quizType.replace('_', ' ')}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Points:</span>
                  <span className="prop-value">{currentQuiz.points}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Assignment Group:</span>
                  <span className="prop-value">{currentQuiz.assignmentGroup || "Quizzes"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Shuffle Answers:</span>
                  <span className="prop-value">{currentQuiz.shuffleAnswers ? "Yes" : "No"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Time Limit:</span>
                  <span className="prop-value">{currentQuiz.timeLimit} Minutes</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Multiple Attempts:</span>
                  <span className="prop-value">{currentQuiz.multipleAttempts ? "Yes" : "No"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">How Many Attempts:</span>
                  <span className="prop-value">
                    {currentQuiz.multipleAttempts ? currentQuiz.attemptsAllowed : "N/A"}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush" className="quiz-props-list">
                <ListGroup.Item>
                  <span className="prop-name">Show Correct Answers:</span>
                  <span className="prop-value">{currentQuiz.showCorrectAnswers || "After Submission"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Access Code:</span>
                  <span className="prop-value">{currentQuiz.accessCode || "None"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">One Question at a Time:</span>
                  <span className="prop-value">{currentQuiz.oneQuestionAtATime ? "Yes" : "No"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Webcam Required:</span>
                  <span className="prop-value">{currentQuiz.webcamRequired ? "Yes" : "No"}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="prop-name">Lock Questions After Answering:</span>
                  <span className="prop-value">{currentQuiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <h4 className="mt-4 mb-3">Due Dates</h4>
          <ListGroup variant="flush" className="quiz-props-list">
            <ListGroup.Item>
              <span className="prop-name">
                <AiOutlineClockCircle className="me-1" /> Due Date:
              </span>
              <span className="prop-value">{formatDate(currentQuiz.dueDate)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="prop-name">
                <AiOutlineClockCircle className="me-1" /> Available From:
              </span>
              <span className="prop-value">{formatDate(currentQuiz.availableDate)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="prop-name">
                <AiOutlineClockCircle className="me-1" /> Available Until:
              </span>
              <span className="prop-value">{formatDate(currentQuiz.untilDate)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default QuizDetails;