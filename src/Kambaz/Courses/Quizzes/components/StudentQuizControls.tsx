import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AiOutlinePlayCircle } from "react-icons/ai";
import "../styles/QuizControls.css";
import { StudentControlsProps } from "../types";

const StudentQuizControls: React.FC<StudentControlsProps> = ({ quiz, cid }) => {
  const navigate = useNavigate();

  // Check if quiz is available
  const isAvailable = (): boolean => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    // FIX: Change untilDate to use quiz.untilDate instead of referencing itself
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    return (
      quiz.published &&
      (!availableDate || now >= availableDate) &&
      (!untilDate || now <= untilDate)
    );
  };

  const handleTakeQuiz = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/take`);
  };

  return (
    <div className="quiz-controls student">
      <Button
        variant={isAvailable() ? "primary" : "secondary"}
        onClick={handleTakeQuiz}
        disabled={!isAvailable()}
        title={isAvailable() ? "Start Quiz" : "Quiz is not available"}
      >
        <AiOutlinePlayCircle className="me-2" />
        {!quiz.published ? "Not Available" : isAvailable() ? "Start Quiz" : "Not Available Yet"}
      </Button>
    </div>
  );
};

export default StudentQuizControls;