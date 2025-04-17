import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { BiDotsVerticalRounded, BiEdit, BiTrash } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { updateQuiz, deleteQuiz } from "../reducer";
import * as client from "../client";
import "../styles/QuizControls.css";
import { FacultyControlsProps } from "../types";

const FacultyQuizControls: React.FC<FacultyControlsProps> = ({ quiz, cid, onQuizUpdated }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePublishToggle = async () => {
    if (!quiz?._id) {
      console.error("Cannot toggle publish status: Quiz ID is missing");
      return;
    }
    
    try {
      let updatedQuiz;
      if (quiz.published) {
        updatedQuiz = await client.unpublishQuiz(quiz._id);
      } else {
        updatedQuiz = await client.publishQuiz(quiz._id);
      }
      
      // Update Redux store with type checking
      if (updatedQuiz && updatedQuiz._id) {
        dispatch(updateQuiz(updatedQuiz));
        
        // Optional: Notify parent component to refresh the quiz list
        if (onQuizUpdated) onQuizUpdated();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error toggling publish status:", error);
      alert(`Failed to ${quiz.published ? "unpublish" : "publish"} quiz: ${error.message || "Unknown error"}`);
    }
  };

  const handleEdit = () => {
    if (!quiz?._id) {
      console.error("Cannot edit quiz: Quiz ID is missing");
      return;
    }
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit`);
  };

  const handlePreview = () => {
    if (!quiz?._id) {
      console.error("Cannot preview quiz: Quiz ID is missing");
      return;
    }
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/preview`);
  };

  const handleDelete = async () => {
    if (!quiz?._id) {
      console.error("Cannot delete quiz: Quiz ID is missing");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await client.deleteQuiz(quiz._id);
        
        // Update Redux store
        dispatch(deleteQuiz(quiz._id));
        
        // Notify parent component to refresh the quiz list
        if (onQuizUpdated) onQuizUpdated();
      } catch (error: any) {
        console.error("Error deleting quiz:", error);
        alert(`Failed to delete quiz: ${error.message || "Unknown error"}`);
      }
    }
  };

  // Toggle the dropdown menu
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    if (showMenu) setShowMenu(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="quiz-controls faculty">
      <div className="primary-controls">
        <button
          className={`publish-btn ${quiz.published ? "published" : "unpublished"}`}
          onClick={handlePublishToggle}
          title={quiz.published ? "Unpublish" : "Publish"}
        >
          {quiz.published ? "Published" : "Unpublished"}
        </button>

        <div className="dropdown">
          <button className="menu-btn" onClick={toggleMenu} title="More options">
            <BiDotsVerticalRounded />
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleEdit} title="Edit quiz">
                <BiEdit /> Edit
              </button>
              <button onClick={handlePreview} title="Preview quiz">
                <AiOutlineEye /> Preview
              </button>
              <button onClick={handleDelete} title="Delete quiz" className="delete-btn">
                <BiTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyQuizControls;