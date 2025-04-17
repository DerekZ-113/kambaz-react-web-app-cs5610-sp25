import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClockCircle, AiOutlineFileText } from "react-icons/ai";
import FacultyQuizControls from "./FacultyQuizControls";
import StudentQuizControls from "./StudentQuizControls";
import "../styles/QuizCard.css";
import { QuizCardProps } from "../types";

const QuizCard: React.FC<QuizCardProps> = ({ quiz, userRole, cid, onQuizUpdated }) => {
  // Format dates for display
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determine quiz availability status
  const getAvailabilityStatus = (): string => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
      return `Not available until ${formatDate(quiz.availableDate)}`;
    } else if (untilDate && now > untilDate) {
      return "Closed";
    } else if (availableDate && untilDate) {
      return "Available";
    }
    return "Available";
  };

  return (
    <div className={`quiz-card ${!quiz.published ? "unpublished" : ""}`}>
      <div className="quiz-card-header">
        <div className="quiz-status-indicator">
          {!quiz.published ? (
            <span className="unpublished-icon" title="Unpublished">🚫</span>
          ) : (
            <span className="published-icon" title="Published">✅</span>
          )}
        </div>
        <h3 className="quiz-title">
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/details`}>
            {quiz.title}
          </Link>
        </h3>
      </div>

      <div className="quiz-card-body">
        <div className="quiz-meta">
          <div className="quiz-info">
            <span className="quiz-availability">{getAvailabilityStatus()}</span>
            {quiz.dueDate && (
              <div className="quiz-due-date">
                <AiOutlineClockCircle /> Due: {formatDate(quiz.dueDate)}
              </div>
            )}
            <div className="quiz-points">
              <AiOutlineFileText /> {quiz.points} points
            </div>
            <div className="quiz-questions">
              Questions: {quiz.questionCount || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-card-footer">
        {userRole === "FACULTY" || userRole === "ADMIN" ? (
          <FacultyQuizControls 
            quiz={quiz} 
            cid={cid} 
            onQuizUpdated={onQuizUpdated} 
          />
        ) : (
          <StudentQuizControls 
            quiz={quiz} 
            cid={cid} 
          />
        )}
      </div>
    </div>
  );
};

export default QuizCard;