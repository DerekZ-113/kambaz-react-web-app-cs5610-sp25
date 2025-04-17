import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { findQuizById } from '../client';
import { fetchQuestions } from '../questionClient';
import { createQuizAttempt, submitAnswer, submitQuizAttempt } from '../quizAttemptClient';
import QuizDisplay from './QuizDisplay';
import './styles/QuizTaking.css';
import { Quiz, Question } from '../types';

interface QuizTakingProps {
  currentUser: any;
  previewMode?: boolean;
  cid?: string;
  quizId?: string;
}

const QuizTaking: React.FC<QuizTakingProps> = ({ 
  currentUser, 
  previewMode = false,
  cid: cidProp,
  quizId: quizIdProp 
}) => {
  // Use props if provided, otherwise fall back to useParams
  const params = useParams<{ cid: string; quizId: string }>();
  const cid = cidProp || params.cid;
  const quizId = quizIdProp || params.quizId;
  
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string>('');
  const [accessCodeError, setAccessCodeError] = useState<boolean>(false);
  
  // Add this effect near the beginning of your component
  useEffect(() => {
    // Skip permission checks in preview mode
    if (previewMode) return;
    
    // Skip checks if quiz isn't loaded yet
    if (!quiz) return;
    
    // Check if currentUser exists before trying to access its properties
    if (!currentUser) {
      setError('User information not available. Please try refreshing the page.');
      return;
    }
    
    // Additional checks once quiz is loaded
    // Faculty and admin can always take quizzes
    const isFacultyOrAdmin = 
      currentUser?.role === 'FACULTY' || 
      currentUser?.role === 'ADMIN';

    if (!isFacultyOrAdmin) {
      // For students, check quiz availability
      const now = new Date();
      const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
      const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;
      
      // Redirect if quiz isn't published or not available by date
      if (!quiz.published || 
          (availableDate && now < availableDate) || 
          (untilDate && now > untilDate)) {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`, {
          state: { error: 'This quiz is not currently available.' }
        });
      }
    }
  }, [currentUser, quiz, cid, navigate, previewMode]);

  // Fetch quiz and questions when component mounts
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        if (quizId) {
          // Load quiz details
          const quizData = await findQuizById(quizId);
          setQuiz(quizData);
          
          // Set timer if applicable
          if (quizData.timeLimit && quizData.timeLimit > 0) {
            setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
          }
          
          // Load questions
          const questionsData = await fetchQuestions(quizId);
          setQuestions(questionsData);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load quiz:', err);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizId]);
  
  // Submit quiz answers
  const handleSubmitQuiz = useCallback(async () => {
    if (previewMode) {
      // In preview mode, just show an alert instead of submitting
      alert("In preview mode, quiz submission is disabled");
      return;
    }
    
    if (!attemptId) return;
    
    try {
      await submitQuizAttempt(attemptId);
      
      // Navigate to results page
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/results/${attemptId}`);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    }
  }, [previewMode, attemptId, navigate, cid, quizId]);
  
  // Timer countdown effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (quizStarted && timeRemaining && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          }
          return 0;
        });
      }, 1000);
    }
    
    // Auto-submit when time expires
    if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [quizStarted, timeRemaining, handleSubmitQuiz]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Start the quiz
  const handleStartQuiz = async () => {
    if (previewMode) {
      // In preview mode, just show the questions without creating an attempt
      setQuizStarted(true);
      return;
    }
    
    if (!quizId) {
      setError('Quiz ID is missing. Cannot start quiz.');
      return;
    }
    
    // Validate access code if required
    if (quiz?.accessCode && accessCode !== quiz.accessCode) {
      setAccessCodeError(true);
      return;
    }
    
    try {
      console.log("Starting quiz with:", { quizId, cid });
      
      // Ensure we have valid IDs
      if (!quizId || !cid) {
        setError('Missing quiz or course information.');
        return;
      }
      
      // Pass both parameters
      const attempt = await createQuizAttempt(quizId, cid);
      setAttemptId(attempt._id);
      setQuizStarted(true);
    } catch (err: any) {
      console.error('Failed to start quiz:', err);
      // Show the specific error message from the server if available
      setError(err.response?.data?.message || 'Failed to start quiz. Please try again.');
    }
  };
  
  // Handle answer updates
  const handleAnswerUpdate = async (questionId: string, answer: any) => {
    // Update local state first for immediate UI feedback
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // If we have an attempt ID, submit the answer to the server
    if (attemptId) {
      try {
        await submitAnswer(attemptId, questionId, answer);
      } catch (err) {
        console.error('Failed to submit answer:', err);
        // Optionally show an error, but don't block the UI
      }
    }
  };
  
  // Navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion && userAnswers[currentQuestion._id] !== undefined;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!questions.length) return 0;
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };
  
  if (loading) {
    return <div className="quiz-taking-loading">Loading quiz...</div>;
  }
  
  if (error || !quiz) {
    return <div className="quiz-taking-error">{error || 'Quiz not found'}</div>;
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="quiz-taking-container">
        <Card className="quiz-start-card">
          <Card.Header>
            <h2>{quiz.title}</h2>
          </Card.Header>
          <Card.Body>
            <div className="quiz-info">
              <p>{quiz.description}</p>
              <hr />
              <div className="quiz-meta">
                <div>
                  <strong>Time Limit:</strong> {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No time limit'}
                </div>
                <div>
                  <strong>Questions:</strong> {questions.length}
                </div>
                <div>
                  <strong>Points:</strong> {quiz.points}
                </div>
                {quiz.attemptsAllowed && quiz.attemptsAllowed > 1 && (
                  <div>
                    <strong>Attempts Allowed:</strong> {quiz.attemptsAllowed}
                  </div>
                )}
              </div>
              
              {quiz.accessCode && (
                <div className="access-code-section">
                  <Alert variant="warning">
                    This quiz requires an access code to begin.
                  </Alert>
                  <div className="mb-3">
                    <label htmlFor="accessCode">Access Code:</label>
                    <input 
                      type="text" 
                      id="accessCode" 
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className={accessCodeError ? "form-control is-invalid" : "form-control"}
                    />
                    {accessCodeError && (
                      <div className="invalid-feedback">
                        Incorrect access code
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="instructions">
                <h5>Instructions:</h5>
                <ul>
                  <li>Once you start, the timer will begin counting down.</li>
                  <li>Answer all questions before submitting.</li>
                  <li>You can navigate between questions using the buttons provided.</li>
                  {quiz.oneQuestionAtATime && quiz.lockQuestionsAfterAnswering && (
                    <li className="text-warning">
                      <strong>Note:</strong> Once you answer a question and move to the next one, you cannot go back.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleStartQuiz}
              className="start-quiz-btn"
            >
              Start Quiz
            </Button>
          </Card.Footer>
        </Card>
      </div>
    );
  }
  
  // Quiz taking interface
  return (
    <div className="quiz-taking-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        {timeRemaining !== null && (
          <div className="time-remaining">
            Time Remaining: <span className={timeRemaining < 60 ? 'text-danger' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>
      
      <div className="quiz-progress mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Progress: {Object.keys(userAnswers).length} of {questions.length} answered</span>
          <span>{calculateProgress()}%</span>
        </div>
        <ProgressBar now={calculateProgress()} />
      </div>
      
      {questions.length > 0 ? (
        <>
          <div className="question-container">
            <QuizDisplay
              question={questions[currentQuestionIndex]}
              answer={userAnswers[questions[currentQuestionIndex]?._id]}
              onAnswerUpdate={handleAnswerUpdate}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          </div>
          
          <div className="quiz-navigation">
            <div className="navigation-buttons">
              <Button 
                variant="outline-secondary" 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0 || (quiz.oneQuestionAtATime && quiz.lockQuestionsAfterAnswering && isCurrentQuestionAnswered())}
              >
                Previous
              </Button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <Button 
                  variant="primary" 
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
            
            {!quiz.oneQuestionAtATime && (
              <div className="question-pagination">
                {questions.map((q, index) => (
                  <button 
                    key={q._id} 
                    onClick={() => handleJumpToQuestion(index)}
                    className={`pagination-btn ${index === currentQuestionIndex ? 'active' : ''} ${userAnswers[q._id] ? 'answered' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <Alert variant="warning">This quiz doesn't have any questions yet.</Alert>
      )}
    </div>
  );
};

export default QuizTaking;