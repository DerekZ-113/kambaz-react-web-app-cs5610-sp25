import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../Kambaz/store';

// Memoized selector for questions by quiz ID
export const selectQuestionsByQuizId = createSelector(
  [
    (state: RootState) => state.quizzesReducer.questions,
    (_, quizId: string) => quizId
  ],
  (questions, quizId) => questions.filter(q => q.quizId === quizId)
);

// Memoized selector for sorted questions by quiz ID
export const selectSortedQuestionsByQuizId = createSelector(
  [selectQuestionsByQuizId],
  (questions) => [...questions].sort((a, b) => (a.position || 0) - (b.position || 0))
);

// Other selectors
export const selectQuizzesLoading = (state: RootState) => state.quizzesReducer.loading;
export const selectQuizzesError = (state: RootState) => state.quizzesReducer.error;