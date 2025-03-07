import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import accountReducer from "./Account/reducer";
import enrollmentsReducer from "./Courses/Enrollments/reducer";


const store = configureStore({
    reducer: {
        modulesReducer,
        assignmentsReducer,
        accountReducer,
        enrollmentsReducer
    }
});

export default store;