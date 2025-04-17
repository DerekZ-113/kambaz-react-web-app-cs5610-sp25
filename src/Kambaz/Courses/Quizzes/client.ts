import axios from "axios";
import { Quiz } from "./types";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

// Get all quizzes for a course
export const findQuizzesForCourse = async (cid: string): Promise<Quiz[]> => {
  try {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${cid}/quizzes`);
    return response.data;
  } catch (error: any) {
    console.error(`Error finding quizzes for course ${cid}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get a single quiz by ID
export const findQuizById = async (quizId: string): Promise<Quiz> => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error finding quiz ${quizId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Create a new quiz
export const createQuiz = async (cid: string, quiz: Partial<Quiz>): Promise<Quiz> => {
  try {
    // No _id should be included here - backend will generate it
    const response = await axiosWithCredentials.post(`${COURSES_API}/${cid}/quizzes`, quiz);
    return response.data;
  } catch (error: any) {
    console.error("Error creating quiz:", error.response?.data || error.message);
    throw error;
  }
};

// Update an existing quiz
export const updateQuiz = async (quizId: string, updates: Partial<Quiz>): Promise<Quiz> => {
  try {
    const response = await axiosWithCredentials.put(
      `${QUIZZES_API}/${quizId}`, 
      updates
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error updating quiz ${quizId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (quizId: string): Promise<void> => {
  try {
    await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  } catch (error: any) {
    console.error(`Error deleting quiz ${quizId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Publish a quiz
export const publishQuiz = async (quizId: string): Promise<Quiz> => {
  try {
    const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`);
    return response.data;
  } catch (error: any) {
    console.error(`Error publishing quiz ${quizId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Unpublish a quiz
export const unpublishQuiz = async (quizId: string): Promise<Quiz> => {
  try {
    const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/unpublish`);
    return response.data;
  } catch (error: any) {
    console.error(`Error unpublishing quiz ${quizId}:`, error.response?.data || error.message);
    throw error;
  }
};