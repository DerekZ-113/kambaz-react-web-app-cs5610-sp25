import React from "react";
import { useParams } from "react-router-dom";
import QuizTaking from "../QuizTaking";

interface QuizPreviewProps {
  currentUser: any;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ currentUser }) => {
  const { cid, quizId } = useParams<{ cid: string; quizId: string }>();
  
  return (
    <div className="quiz-preview-container">
      <div className="preview-banner alert alert-info">
        <strong>Preview Mode</strong> - This is how students will see the quiz
      </div>
      
      <QuizTaking 
        currentUser={currentUser} 
        previewMode={true}
        cid={cid}
        quizId={quizId}
      />
    </div>
  );
};

export default QuizPreview;