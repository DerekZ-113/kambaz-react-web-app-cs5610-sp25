import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { findQuizById } from '../client';
import { fetchQuestions } from '../questionClient';
import { getQuizAttempt } from '../quizAttemptClient';
import './styles/QuizResults.css';
import { Quiz, Question } from '../types';

interface QuizResultsProps {
  currentUser: any;
}

const QuizResults: React.FC<QuizResultsProps> = ({ currentUser }) => {
  const { cid, quizId, attemptId } = useParams<{ 
    cid: string; 
    quizId: string;
    attemptId: string;
  }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadResultsData = async () => {
      try {
        setLoading(true);
        if (!quizId || !attemptId) {
          throw new Error("Missing quiz ID or attempt ID");
        }
        
        // Load quiz details
        const quizData = await findQuizById(quizId);
        setQuiz(quizData);
        
        // Load questions
        const questionsData = await fetchQuestions(quizId);
        setQuestions(questionsData);
        
        // Load attempt details
        const attemptData = await getQuizAttempt(attemptId);
        setAttempt(attemptData);
        
        // Add permission check
        if (attempt && attempt.user !== currentUser._id && 
            currentUser.role !== 'FACULTY' && currentUser.role !== 'ADMIN') {
          setError('You do not have permission to view these results');
          return;
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load quiz results:', err);
        setError('Failed to load quiz results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadResultsData();
  }, [quizId, attemptId, currentUser]);
  
  const handleRetakeQuiz = () => {
    if (cid && quizId) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/take`);
    }
  };
  
  const handleBackToCourse = () => {
    if (cid) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Calculate time spent in minutes and seconds
  const calculateTimeSpent = () => {
    if (!attempt || !attempt.startTime || !attempt.endTime) return 'N/A';
    
    const start = new Date(attempt.startTime).getTime();
    const end = new Date(attempt.endTime).getTime();
    const diffSeconds = Math.floor((end - start) / 1000);
    
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
  };
  
  // Get the question text for a given question ID
  const getQuestionById = (questionId: string) => {
    return questions.find(q => q._id === questionId);
  };
  
  // Render user answer based on question type
  const renderUserAnswer = (question: Question, answer: any) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return question.choices && question.choices[answer] 
          ? question.choices[answer].text 
          : 'No answer';
          
      case 'TRUE_FALSE':
        return answer === true ? 'True' : 'False';
        
      case 'FILL_BLANK':
        return answer || 'No answer';
        
      default:
        return 'Unknown answer type';
    }
  };
  
  // Render correct answer based on question type
  const renderCorrectAnswer = (question: Question) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return question.choices && typeof question.correctChoiceIndex === 'number'
          ? question.choices[question.correctChoiceIndex].text
          : 'Unknown';
          
      case 'TRUE_FALSE':
        return question.correctAnswer === true ? 'True' : 'False';
        
      case 'FILL_BLANK':
        return question.possibleAnswers && question.possibleAnswers.length > 0
          ? question.possibleAnswers.join(' or ')
          : 'Unknown';
          
      default:
        return 'Unknown answer type';
    }
  };
  
  // Render a single answer result
  const renderAnswerResult = (answerData: any) => {
    const question = getQuestionById(answerData.questionId);
    if (!question) return null;
    
    return (
      <Card key={answerData.questionId} className={`question-result ${answerData.correct ? 'correct' : 'incorrect'}`}>
        <Card.Header>
          <div className="question-result-header">
            <h5>{question.title}</h5>
            <div>
              {answerData.correct ? 
                <Badge bg="success">Correct: {answerData.points} points</Badge> :
                <Badge bg="danger">Incorrect: 0 points</Badge>
              }
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="question-text mb-3">{question.questionText}</div>
          
          <div className="answer-details">
            <div className="user-answer">
              <strong>Your answer:</strong> {renderUserAnswer(question, answerData.answer)}
            </div>
            
            {!answerData.correct && (
              <div className="correct-answer">
                <strong>Correct answer:</strong> {renderCorrectAnswer(question)}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  if (loading) {
    return <div className="quiz-results-loading">Loading results...</div>;
  }
  
  if (error || !quiz || !attempt) {
    return <div className="quiz-results-error">{error || 'Results not found'}</div>;
  }
  
  const scorePercentage = quiz.points ? Math.round((attempt.score / quiz.points) * 100) : 0;
  
  return (
    <div className="quiz-results-container">
      <div className="results-header">
        <h2>Quiz Results: {quiz.title}</h2>
      </div>
      
      <Card className="score-card mb-4">
        <Card.Body>
          <div className="score-details">
            <div className="score-percentage">
              <h3>{scorePercentage}%</h3>
              <div className="text-muted">Score Percentage</div>
              <ProgressBar 
                now={scorePercentage} 
                variant={scorePercentage >= 70 ? 'success' : scorePercentage >= 50 ? 'warning' : 'danger'} 
                className="mt-2 progress-lg"
              />
            </div>
            
            <div className="score-points">
              <h3>{attempt.score}/{quiz.points}</h3>
              <div className="text-muted">Points</div>
            </div>
            
            <div className="score-time">
              <h3>{calculateTimeSpent()}</h3>
              <div className="text-muted">Time Spent</div>
            </div>
            
            <div className="score-submitted">
              <h5>Submitted</h5>
              <div>{formatDate(attempt.endTime)}</div>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <div className="answers-review">
        <h3>Question Review</h3>
        <div className="questions-list">
          {attempt.answers && attempt.answers.map((answer: any) => renderAnswerResult(answer))}
        </div>
      </div>
      
      <div className="results-actions">
        {quiz.multipleAttempts && (
          <Button 
            variant="primary" 
            onClick={handleRetakeQuiz}
            className="me-3"
          >
            Retake Quiz
          </Button>
        )}
        <Button 
          variant="outline-primary" 
          onClick={handleBackToCourse}
        >
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;