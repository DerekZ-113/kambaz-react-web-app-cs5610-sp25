import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { Quiz } from '../types';
import './styles/DetailsTab.css';

interface DetailsTabProps {
  quiz: Quiz;
  onQuizUpdate: (quiz: Quiz) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ quiz, onQuizUpdate }) => {
  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onQuizUpdate({
        ...quiz,
        [name]: checked,
      });
      return;
    }
    
    // Handle number fields
    if (type === 'number') {
      onQuizUpdate({
        ...quiz,
        [name]: parseInt(value, 10) || 0,
      });
      return;
    }
    
    // Handle other fields
    onQuizUpdate({
      ...quiz,
      [name]: value,
    });
  };

  // Format date string for datetime-local input
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDThh:mm
  };

  return (
    <div className="details-tab">
      <Form>
        <Card className="mb-4">
          <Card.Header>Basic Information</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={quiz.title || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={quiz.description || ''}
                onChange={handleInputChange}
                rows={3}
              />
              <Form.Text className="text-muted">
                Describe the purpose of this quiz
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Type</Form.Label>
                  <Form.Select
                    name="quizType"
                    value={quiz.quizType || 'GRADED_QUIZ'}
                    onChange={handleInputChange}
                  >
                    <option value="GRADED_QUIZ">Graded Quiz</option>
                    <option value="PRACTICE_QUIZ">Practice Quiz</option>
                    <option value="GRADED_SURVEY">Graded Survey</option>
                    <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Points</Form.Label>
                  <Form.Control
                    type="number"
                    name="points"
                    value={quiz.points || 0}
                    onChange={handleInputChange}
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                name="assignmentGroup"
                value={quiz.assignmentGroup || 'QUIZZES'}
                onChange={handleInputChange}
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Quiz Settings</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="timeLimit"
                    value={quiz.timeLimit || 20}
                    onChange={handleInputChange}
                    min={0}
                  />
                  <Form.Text className="text-muted">
                    Set to 0 for no time limit
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="shuffleAnswers"
                    label="Shuffle Answers"
                    checked={quiz.shuffleAnswers !== false} // Default to true
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="multipleAttempts"
                    label="Allow Multiple Attempts"
                    checked={quiz.multipleAttempts || false}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Attempts Allowed</Form.Label>
                  <Form.Control
                    type="number"
                    name="attemptsAllowed"
                    value={quiz.attemptsAllowed || 1}
                    onChange={handleInputChange}
                    min={1}
                    disabled={!quiz.multipleAttempts}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Show Correct Answers</Form.Label>
              <Form.Select
                name="showCorrectAnswers"
                value={quiz.showCorrectAnswers || 'AFTER_SUBMISSION'}
                onChange={handleInputChange}
              >
                <option value="IMMEDIATELY">Immediately</option>
                <option value="AFTER_SUBMISSION">After Submission</option>
                <option value="AFTER_DUE_DATE">After Due Date</option>
                <option value="NEVER">Never</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Access Code (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="accessCode"
                value={quiz.accessCode || ''}
                onChange={handleInputChange}
                placeholder="Leave blank for no access code"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="oneQuestionAtATime"
                    label="Show One Question at a Time"
                    checked={quiz.oneQuestionAtATime || false}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="webcamRequired"
                    label="Require Webcam"
                    checked={quiz.webcamRequired || false}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="lockQuestionsAfterAnswering"
                label="Lock Questions After Answering"
                checked={quiz.lockQuestionsAfterAnswering || false}
                onChange={handleInputChange}
                disabled={!quiz.oneQuestionAtATime}
              />
              <Form.Text className="text-muted">
                Only applicable when "One Question at a Time" is enabled
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Availability</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Available From</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="availableDate"
                    value={formatDateForInput(quiz.availableDate)}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    value={formatDateForInput(quiz.dueDate)}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Until</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="untilDate"
                    value={formatDateForInput(quiz.untilDate)}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default DetailsTab;