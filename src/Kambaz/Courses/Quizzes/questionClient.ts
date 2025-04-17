import axios from "axios";
import { Question } from "./types"; // Import your Question type

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

// Get all questions for a quiz
export const fetchQuestions = async (quizId: string): Promise<Question[]> => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/questions`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching questions:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (question: Partial<Question>): Promise<Question> => {
  try {
    // No _id should be included here - backend will generate it
    const response = await axiosWithCredentials.post(
      `${QUIZZES_API}/${question.quizId}/questions`, 
      question
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating question:", error.response?.data || error.message);
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (questionId: string, updates: Partial<Question>): Promise<Question> => {
  try {
    const response = await axiosWithCredentials.put(
      `${QUESTIONS_API}/${questionId}`, 
      updates
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating question ${questionId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionId: string): Promise<Question> => {
  try {
    const response = await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting question ${questionId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Reorder a question
export const reorderQuestion = async (questionId: string, updates: { position: number }): Promise<Question> => {
  try {
    const response = await axiosWithCredentials.put(
      `${QUESTIONS_API}/${questionId}/reorder`,
      updates
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error reordering question ${questionId}:`, error.response?.data || error.message);
    throw error;
  }
};