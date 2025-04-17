import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { Question } from '../types';
import './styles/QuizDisplay.css';

interface QuizDisplayProps {
  question: Question;
  answer: any;
  onAnswerUpdate: (questionId: string, answer: any) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ 
  question, 
  answer, 
  onAnswerUpdate, 
  questionNumber, 
  totalQuestions 
}) => {
  if (!question) {
    return <div>Question not found</div>;
  }
  
  // Handle multiple choice selection
  const handleMultipleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const choiceIndex = parseInt(e.target.value, 10);
    onAnswerUpdate(question._id, choiceIndex);
  };
  
  // Handle true/false selection
  const handleTrueFalseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'true';
    onAnswerUpdate(question._id, value);
  };
  
  // Handle fill in the blank input
  const handleFillBlankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onAnswerUpdate(question._id, text);
  };
  
  // Render the appropriate input based on question type
  const renderQuestionInput = () => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="multiple-choice-options">
            {question.choices?.map((choice, index) => (
              <Form.Check
                key={choice._id}
                type="radio"
                id={`choice-${question._id}-${index}`}
                name={`question-${question._id}`}
                label={choice.text}
                value={index.toString()}
                checked={answer === index}
                onChange={handleMultipleChoiceChange}
                className="mb-2"
              />
            ))}
          </div>
        );
        
      case 'TRUE_FALSE':
        return (
          <div className="true-false-options">
            <Form.Check
              type="radio"
              id={`true-${question._id}`}
              name={`question-${question._id}`}
              label="True"
              value="true"
              checked={answer === true}
              onChange={handleTrueFalseChange}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id={`false-${question._id}`}
              name={`question-${question._id}`}
              label="False"
              value="false"
              checked={answer === false}
              onChange={handleTrueFalseChange}
              className="mb-2"
            />
          </div>
        );
        
      case 'FILL_BLANK':
        return (
          <div className="fill-blank-input">
            <Form.Control
              type="text"
              placeholder="Your answer"
              value={answer || ''}
              onChange={handleFillBlankChange}
            />
          </div>
        );
        
      default:
        return <div>Unsupported question type</div>;
    }
  };
  
  // Render appropriate question type
  const renderQuestionContent = () => {
    return (
      <div className="answer-section mt-4">
        {renderQuestionInput()}
      </div>
    );
  };

  return (
    <Card className="question-display-card">
      <Card.Header>
        <div className="question-header">
          <span className="question-number-indicator">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="question-points">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </span>
        </div>
      </Card.Header>
      <Card.Body>
        <h5 className="question-title">{question.title}</h5>
        <p className="question-text">{question.questionText}</p>
        {renderQuestionContent()}
      </Card.Body>
    </Card>
  );
};

export default QuizDisplay;