import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, ListGroup, Dropdown, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../Kambaz/store';
import { 
  setQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion, 
  reorderQuestions,
  setError as setGlobalError,
  setLoading
} from '../reducer';
import { 
  selectQuestionsByQuizId, 
  selectSortedQuestionsByQuizId,
  selectQuizzesLoading,
  selectQuizzesError
} from '../selectors';
import { Question } from '../types';
import * as questionClient from '../questionClient'; 
import './styles/QuestionsTab.css';

interface QuestionsTabProps {
  quizId: string;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ quizId }) => {
  const dispatch = useDispatch();
  
  // Use memoized selectors
  const questions = useSelector((state: RootState) => selectQuestionsByQuizId(state, quizId));
  const sortedQuestions = useSelector((state: RootState) => selectSortedQuestionsByQuizId(state, quizId));
  const loading = useSelector(selectQuizzesLoading);
  const error = useSelector(selectQuizzesError);
  
  // State for adding/editing questions
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('MULTIPLE_CHOICE');
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: '',
    questionText: '',
    points: 1,
    questionType: 'MULTIPLE_CHOICE',
    choices: [{ _id: '1', text: '' }, { _id: '2', text: '' }],
    correctChoiceIndex: 0
  });
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate total points
  const totalPoints = sortedQuestions.reduce((sum, question) => sum + (question.points || 0), 0);

  // Fetch questions when component mounts or quiz changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        dispatch(setLoading(true));
        if (quizId) {
          console.log("Fetching questions for quiz:", quizId);
          const data = await questionClient.fetchQuestions(quizId);
          console.log("Received questions:", data);
          dispatch(setQuestions(data));
        }
      } catch (err: any) {
        console.error('Failed to load questions:', err);
        dispatch(setGlobalError('Failed to load questions. Please try again later.'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadQuestions();
  }, [quizId, dispatch]);

  // Reset validation error when form values change
  useEffect(() => {
    setValidationError(null);
  }, [newQuestion]);

  // Handle question type selection - this creates a new question with default values
  const handleQuestionTypeSelect = useCallback((type: string) => {
    setValidationError(null);
    setSelectedQuestionType(type);
    
    // Initialize form state based on question type
    let initialState: Partial<Question> = {
      title: '',
      questionText: '',
      points: 1,
      quizId: quizId,
      position: questions.length
    };

    switch (type) {
      case 'MULTIPLE_CHOICE':
        initialState = {
          ...initialState,
          questionType: 'MULTIPLE_CHOICE',
          choices: [
            { _id: '1', text: 'Option 1' }, 
            { _id: '2', text: 'Option 2' }
          ],
          correctChoiceIndex: 0
        };
        break;
      case 'TRUE_FALSE':
        initialState = {
          ...initialState,
          questionType: 'TRUE_FALSE',
          correctAnswer: true
        };
        break;
      case 'FILL_BLANK':
        initialState = {
          ...initialState,
          questionType: 'FILL_BLANK',
          possibleAnswers: ['']
        };
        break;
    }

    setNewQuestion(initialState);
    setEditingQuestion(null);
    setShowModal(true);
  }, [questions.length, quizId]);

  // Validate question form
  const validateQuestionForm = (): boolean => {
    if (!newQuestion.title?.trim()) {
      setValidationError('Question title is required');
      return false;
    }
    
    if (!newQuestion.questionText?.trim()) {
      setValidationError('Question text is required');
      return false;
    }
    
    if (!newQuestion.points || newQuestion.points < 1) {
      setValidationError('Points must be at least 1');
      return false;
    }
    
    if (newQuestion.questionType === 'MULTIPLE_CHOICE') {
      // Check if there are at least 2 choices
      if (!newQuestion.choices || newQuestion.choices.length < 2) {
        setValidationError('Multiple choice questions require at least 2 options');
        return false;
      }
      
      // Check if all choices have text
      const emptyChoices = newQuestion.choices.filter(c => !c.text?.trim());
      if (emptyChoices.length > 0) {
        setValidationError('All choices must have text');
        return false;
      }
    }
    
    if (newQuestion.questionType === 'FILL_BLANK') {
      // Check if there is at least one possible answer
      if (!newQuestion.possibleAnswers || newQuestion.possibleAnswers.length === 0) {
        setValidationError('Fill in the blank questions require at least one possible answer');
        return false;
      }
      
      // Check if all possible answers have text
      const emptyAnswers = newQuestion.possibleAnswers.filter(a => !a?.trim());
      if (emptyAnswers.length > 0) {
        setValidationError('All possible answers must have text');
        return false;
      }
    }
    
    return true;
  };

  // Handle question form submission
  const handleSaveQuestion = async () => {
    if (!validateQuestionForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingQuestion) {
        // Update existing question
        console.log("Updating question with ID:", editingQuestion);
        console.log("With data:", newQuestion);
        
        const updatedQuestion = await questionClient.updateQuestion(
          editingQuestion, 
          newQuestion as Question
        );
        
        console.log("Question updated successfully:", updatedQuestion);
        dispatch(updateQuestion(updatedQuestion));
      } else {
        // Create new question
        console.log("Creating new question with data:", newQuestion);
        
        const createdQuestion = await questionClient.createQuestion({
          ...newQuestion,
          quizId: quizId,
          position: questions.length
        } as Question);
        
        console.log("Question created successfully:", createdQuestion);
        dispatch(addQuestion(createdQuestion));
      }
      
      // Close modal and reset form
      setShowModal(false);
      setEditingQuestion(null);
      setNewQuestion({
        title: '',
        questionText: '',
        points: 1,
        questionType: 'MULTIPLE_CHOICE',
        choices: [{ _id: '1', text: '' }, { _id: '2', text: '' }],
        correctChoiceIndex: 0
      });
    } catch (err: any) {
      console.error('Failed to save question:', err);
      setValidationError(err.message || 'Failed to save question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing an existing question
  const handleEditQuestion = (questionId: string) => {
    // Use sortedQuestions to find the question
    const questionToEdit = sortedQuestions.find(q => q._id === questionId);
    if (questionToEdit) {
      console.log("Editing question:", questionToEdit);
      
      // Create a deep copy to avoid reference issues
      const questionCopy = JSON.parse(JSON.stringify(questionToEdit));
      
      setNewQuestion(questionCopy);
      setSelectedQuestionType(questionCopy.questionType);
      setEditingQuestion(questionId);
      setValidationError(null);
      setShowModal(true);
    } else {
      console.error("Question not found for editing. ID:", questionId);
      dispatch(setGlobalError('Could not find question to edit. Please try again.'));
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionClient.deleteQuestion(questionId);
        dispatch(deleteQuestion(questionId));
        
        // Reorder positions for remaining questions
        const updatedQuestions = sortedQuestions
          .filter(q => q._id !== questionId)
          .map((q, index) => ({
            ...q,
            position: index
          }));
          
        // Update positions in backend
        for (const q of updatedQuestions) {
          await questionClient.reorderQuestion(q._id, { position: q.position });
        }
        
        dispatch(reorderQuestions(updatedQuestions));
      } catch (err: any) {
        console.error('Failed to delete question:', err);
        dispatch(setGlobalError('Failed to delete question. Please try again.'));
      }
    }
  };

  // Handle question reordering via drag and drop
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sortedQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update positions
    const updatedQuestions = items.map((item, index) => ({
      ...item,
      position: index
    }));
    
    dispatch(reorderQuestions(updatedQuestions));
    
    // Save new positions to backend
    try {
      await questionClient.reorderQuestion(reorderedItem._id, {
        position: result.destination.index
      });
    } catch (err: any) {
      console.error('Failed to reorder questions:', err);
      dispatch(setGlobalError('Failed to reorder questions. Please try again.'));
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewQuestion({
        ...newQuestion,
        [name]: checked,
      });
      return;
    }
    
    // Handle number fields
    if (type === 'number') {
      setNewQuestion({
        ...newQuestion,
        [name]: parseInt(value, 10) || 0,
      });
      return;
    }
    
    // Handle other fields
    setNewQuestion({
      ...newQuestion,
      [name]: value,
    });
  };

  // Multiple choice question specific handlers
  const handleAddChoice = () => {
    if (newQuestion.choices) {
      setNewQuestion({
        ...newQuestion,
        choices: [
          ...newQuestion.choices,
          { _id: `${Date.now()}`, text: `Option ${newQuestion.choices.length + 1}` }
        ]
      });
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (newQuestion.choices && newQuestion.choices.length > 2) {
      const updatedChoices = [...newQuestion.choices];
      updatedChoices.splice(index, 1);
      
      // Update correct choice index if needed
      let updatedCorrectIndex = newQuestion.correctChoiceIndex || 0;
      if (index === updatedCorrectIndex) {
        updatedCorrectIndex = 0;
      } else if (index < updatedCorrectIndex) {
        updatedCorrectIndex--;
      }
      
      setNewQuestion({
        ...newQuestion,
        choices: updatedChoices,
        correctChoiceIndex: updatedCorrectIndex
      });
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    if (newQuestion.choices) {
      const updatedChoices = [...newQuestion.choices];
      updatedChoices[index] = { ...updatedChoices[index], text: value };
      
      setNewQuestion({
        ...newQuestion,
        choices: updatedChoices
      });
    }
  };

  const handleCorrectChoiceChange = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      correctChoiceIndex: index
    });
  };

  // Fill in the blank specific handlers
  const handleAddPossibleAnswer = () => {
    setNewQuestion({
      ...newQuestion,
      possibleAnswers: [...(newQuestion.possibleAnswers || []), '']
    });
  };

  const handleRemovePossibleAnswer = (index: number) => {
    if (newQuestion.possibleAnswers && newQuestion.possibleAnswers.length > 1) {
      const updatedAnswers = [...newQuestion.possibleAnswers];
      updatedAnswers.splice(index, 1);
      setNewQuestion({
        ...newQuestion,
        possibleAnswers: updatedAnswers
      });
    }
  };

  const handlePossibleAnswerChange = (index: number, value: string) => {
    if (newQuestion.possibleAnswers) {
      const updatedAnswers = [...newQuestion.possibleAnswers];
      updatedAnswers[index] = value;
      setNewQuestion({
        ...newQuestion,
        possibleAnswers: updatedAnswers
      });
    }
  };

  // True/False specific handlers
  const handleCorrectAnswerChange = (value: boolean) => {
    setNewQuestion({
      ...newQuestion,
      correctAnswer: value
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (editingQuestion || Object.values(newQuestion).some(val => val !== '')) {
      if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        setShowModal(false);
        setEditingQuestion(null);
        setValidationError(null);
      }
    } else {
      setShowModal(false);
    }
  };

  // Render loading state
  if (loading && sortedQuestions.length === 0) {
    return (
      <div className="questions-loading text-center py-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-3">Loading questions...</p>
      </div>
    );
  }

  // Render the component
  return (
    <div className="questions-tab">
      <div className="questions-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Quiz Questions {sortedQuestions.length > 0 && <span>({sortedQuestions.length})</span>}</h3>
          <div className="text-muted">
            Total Points: {totalPoints}
          </div>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="primary">
            Add Question
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={() => handleQuestionTypeSelect('MULTIPLE_CHOICE')}>
              Multiple Choice
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleQuestionTypeSelect('TRUE_FALSE')}>
              True/False
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleQuestionTypeSelect('FILL_BLANK')}>
              Fill in the Blank
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {sortedQuestions.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Questions Yet</Card.Title>
            <Card.Text>Click "Add Question" to create your first quiz question.</Card.Text>
            <Button 
              variant="primary" 
              onClick={() => handleQuestionTypeSelect('MULTIPLE_CHOICE')}
            >
              Add Multiple Choice Question
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <ListGroup 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="questions-list"
              >
                {sortedQuestions.map((question, index) => (
                  <Draggable 
                    key={question._id} 
                    draggableId={question._id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <ListGroup.Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`question-item ${snapshot.isDragging ? 'is-dragging' : ''}`}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <div className="question-number me-3">{index + 1}</div>
                          <div className="question-title flex-grow-1">
                            <h5>{question.title}</h5>
                          </div>
                          <div className="question-points me-3">
                            <Badge bg="secondary">
                              {question.points} {question.points === 1 ? 'point' : 'points'}
                            </Badge>
                          </div>
                          <div className="question-type me-3">
                            <Badge bg="info">
                              {question.questionType === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 
                               question.questionType === 'TRUE_FALSE' ? 'True/False' : 
                               'Fill in the Blank'}
                            </Badge>
                          </div>
                          <div className="question-actions">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditQuestion(question._id)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteQuestion(question._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        <div className="question-preview">
                          <div className="question-text mb-2">
                            {question.questionText}
                          </div>
                          
                          {/* Preview for Multiple Choice */}
                          {question.questionType === 'MULTIPLE_CHOICE' && question.choices && (
                            <div className="choices-preview ms-3">
                              {question.choices.map((choice, idx) => (
                                <div key={choice._id} className="choice-item">
                                  <Form.Check
                                    type="radio"
                                    id={`preview-${question._id}-choice-${idx}`}
                                    name={`preview-${question._id}`}
                                    checked={question.correctChoiceIndex === idx}
                                    readOnly
                                    label={choice.text}
                                    className={question.correctChoiceIndex === idx ? "correct-choice" : ""}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Preview for True/False */}
                          {question.questionType === 'TRUE_FALSE' && (
                            <div className="tf-preview ms-3">
                              <div>
                                <Form.Check
                                  type="radio"
                                  id={`preview-${question._id}-true`}
                                  name={`preview-${question._id}`}
                                  checked={question.correctAnswer === true}
                                  readOnly
                                  label="True"
                                  className={question.correctAnswer === true ? "correct-choice" : ""}
                                />
                              </div>
                              <div>
                                <Form.Check
                                  type="radio"
                                  id={`preview-${question._id}-false`}
                                  name={`preview-${question._id}`}
                                  checked={question.correctAnswer === false}
                                  readOnly
                                  label="False"
                                  className={question.correctAnswer === false ? "correct-choice" : ""}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Preview for Fill in the Blank */}
                          {question.questionType === 'FILL_BLANK' && question.possibleAnswers && (
                            <div className="blank-preview ms-3">
                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="[Student answer]"
                                  disabled
                                  className="fill-blank-input"
                                />
                              </div>
                              <div className="possible-answers mt-2">
                                <small>Possible answers:</small>
                                <ul className="mb-0">
                                  {question.possibleAnswers.map((answer, idx) => (
                                    <li key={idx}>{answer}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </ListGroup.Item>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ListGroup>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Question Modal */}
      <Modal show={showModal} onHide={handleCancelEdit} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert variant="danger" className="mb-3">
              {validationError}
            </Alert>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question Type</Form.Label>
              <Form.Select
                name="questionType"
                value={selectedQuestionType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setSelectedQuestionType(newType);
                  handleQuestionTypeSelect(newType);
                }}
                disabled={isSubmitting}
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="FILL_BLANK">Fill in the Blank</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Question Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newQuestion.title || ''}
                onChange={handleInputChange}
                required
                placeholder="Enter a title for your question"
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Points <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="points"
                value={newQuestion.points || 1}
                onChange={handleInputChange}
                min={1}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Question Text <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                name="questionText"
                value={newQuestion.questionText || ''}
                onChange={handleInputChange}
                rows={3}
                required
                placeholder="Enter the question text"
                disabled={isSubmitting}
              />
            </Form.Group>

            {/* Render different form fields based on question type */}
            {selectedQuestionType === 'MULTIPLE_CHOICE' && (
              <div className="multiple-choice-section">
                <h5>Answer Choices <span className="text-danger">*</span></h5>
                <p className="text-muted small">Select the correct answer using the radio buttons.</p>
                
                {newQuestion.choices?.map((choice, index) => (
                  <Form.Group key={choice._id} className="mb-3 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name="correctChoice"
                      id={`choice-${index}`}
                      checked={newQuestion.correctChoiceIndex === index}
                      onChange={() => handleCorrectChoiceChange(index)}
                      className="me-2"
                      disabled={isSubmitting}
                    />
                    <Form.Control
                      type="text"
                      value={choice.text}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                      className="flex-grow-1"
                      disabled={isSubmitting}
                    />
                    {newQuestion.choices && newQuestion.choices.length > 2 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => handleRemoveChoice(index)}
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    )}
                  </Form.Group>
                ))}
                
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleAddChoice}
                  className="mt-2"
                  disabled={isSubmitting}
                >
                  Add Choice
                </Button>
              </div>
            )}

            {selectedQuestionType === 'TRUE_FALSE' && (
              <Form.Group className="mb-3">
                <Form.Label>Correct Answer <span className="text-danger">*</span></Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    id="tf-true"
                    name="tf-answer"
                    checked={newQuestion.correctAnswer === true}
                    onChange={() => handleCorrectAnswerChange(true)}
                    label="True"
                    className="mb-2"
                    disabled={isSubmitting}
                  />
                  <Form.Check
                    type="radio"
                    id="tf-false"
                    name="tf-answer"
                    checked={newQuestion.correctAnswer === false}
                    onChange={() => handleCorrectAnswerChange(false)}
                    label="False"
                    disabled={isSubmitting}
                  />
                </div>
              </Form.Group>
            )}

            {selectedQuestionType === 'FILL_BLANK' && (
              <div className="fill-blank-section">
                <h5>Possible Answers <span className="text-danger">*</span></h5>
                <p className="text-muted small">
                  Add all acceptable answers. Students must match one of these exactly.
                </p>
                
                {newQuestion.possibleAnswers?.map((answer, index) => (
                  <Form.Group key={index} className="mb-2 d-flex align-items-center">
                    <Form.Control
                      type="text"
                      value={answer}
                      onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                      placeholder={`Answer ${index + 1}`}
                      required
                      className="flex-grow-1"
                      disabled={isSubmitting}
                    />
                    {newQuestion.possibleAnswers && newQuestion.possibleAnswers.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => handleRemovePossibleAnswer(index)}
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    )}
                  </Form.Group>
                ))}
                
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleAddPossibleAnswer}
                  className="mt-2"
                  disabled={isSubmitting}
                >
                  Add Possible Answer
                </Button>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveQuestion}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : (
              editingQuestion ? 'Update Question' : 'Save Question'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionsTab;