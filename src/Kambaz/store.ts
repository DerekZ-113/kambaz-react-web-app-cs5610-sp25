import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../Kambaz/Account/reducer';
import enrollmentsReducer from '../Kambaz/Courses/Enrollments/reducer';
import modulesReducer from '../Kambaz/Courses/Modules/reducer';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    accountReducer,
    enrollmentsReducer,
    modulesReducer,
    // Add other reducers
  },
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;