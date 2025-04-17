import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ATTEMPT_API = `${REMOTE_SERVER}/api/quiz-attempts`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

// Improve error handling
export const createQuizAttempt = async (quizId: string, cid?: string) => {
  try {
    if (cid) {
      const response = await axiosWithCredentials.post(
        `${REMOTE_SERVER}/api/courses/${cid}/quizzes/${quizId}/attempts`
      );
      return response.data;
    }
    
    const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`);
    return response.data;
  } catch (error: any) {
    console.error("Creating quiz attempt failed:", error.response?.data || error);
    throw error;
  }
};

// Submit an answer for a specific question
export const submitAnswer = async (attemptId: string, questionId: string, answer: any) => {
  const response = await axiosWithCredentials.post(
    `${ATTEMPT_API}/${attemptId}/questions/${questionId}`,
    { answer }
  );
  return response.data;
};

// Complete a quiz attempt
export const submitQuizAttempt = async (attemptId: string) => {
  const response = await axiosWithCredentials.post(`${ATTEMPT_API}/${attemptId}/submit`);
  return response.data;
};

// Fetch a specific quiz attempt
export const getQuizAttempt = async (attemptId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPT_API}/${attemptId}`);
  return response.data;
};

// Fetch all attempts for a user and quiz
export const getUserQuizAttempts = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/my-attempts`);
  return response.data;
};

// Fetch all attempts for a quiz (faculty only)
export const fetchAllQuizAttempts = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};