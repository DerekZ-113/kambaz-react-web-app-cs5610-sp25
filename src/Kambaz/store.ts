import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../Kambaz/Account/reducer';
import enrollmentsReducer from '../Kambaz/Courses/Enrollments/reducer';
import modulesReducer from '../Kambaz/Courses/Modules/reducer';
import assignmentsReducer from '../Kambaz/Courses/Assignments/reducer';
import quizzesReducer from '../Kambaz/Courses/Quizzes/reducer'; // UPDATED IMPORT

const store = configureStore({
  reducer: {
    accountReducer,
    enrollmentsReducer,
    modulesReducer,
    assignmentsReducer,
    quizzesReducer,
  },
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;