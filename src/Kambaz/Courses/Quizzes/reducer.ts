import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz, Question } from "./types";

// Define the state interface for better type safety
interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  questions: [],
  loading: false,
  error: null
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.error = null;
    },
    
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes = [...state.quizzes, action.payload];
      state.currentQuiz = action.payload;
    },
    
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes = state.quizzes.map((q: Quiz) =>
        q._id === action.payload._id ? action.payload : q
      );
      if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
        state.currentQuiz = action.payload;
      }
    },
    
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q: Quiz) => q._id !== action.payload);
      if (state.currentQuiz && state.currentQuiz._id === action.payload) {
        state.currentQuiz = null;
      }
    },
    
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions = [...state.questions, action.payload];
      
      // Update question count in the current quiz
      if (state.currentQuiz && state.currentQuiz._id === action.payload.quizId) {
        state.currentQuiz = {
          ...state.currentQuiz,
          questionCount: (state.currentQuiz.questionCount || 0) + 1
        };
      }
    },
    
    updateQuestion: (state, action: PayloadAction<Question>) => {
      state.questions = state.questions.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    
    deleteQuestion: (state, action: PayloadAction<string>) => {
      const question = state.questions.find(q => q._id === action.payload);
      state.questions = state.questions.filter((q) => q._id !== action.payload);
      
      // Update question count in the current quiz
      if (question && state.currentQuiz && state.currentQuiz._id === question.quizId) {
        state.currentQuiz = {
          ...state.currentQuiz,
          questionCount: Math.max(0, (state.currentQuiz.questionCount || 0) - 1)
        };
      }
    },
    
    reorderQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setQuizzes,
  setCurrentQuiz,
  clearCurrentQuiz,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  setLoading,
  setError
} = quizzesSlice.actions;

export default quizzesSlice.reducer;