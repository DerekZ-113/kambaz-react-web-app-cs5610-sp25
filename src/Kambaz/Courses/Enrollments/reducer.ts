import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    enrollments: db.enrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollInCourse: (state, { payload }) => {
            const { userId, courseId } = payload;
            
            // Check if already enrolled
            const existingEnrollment = state.enrollments.find(
                e => e.user === userId && e.course === courseId
            );
            
            if (!existingEnrollment) {
                state.enrollments.push({
                    _id: uuidv4(),
                    user: userId,
                    course: courseId
                });
            }
        },
        
        unenrollFromCourse: (state, { payload }) => {
            const { userId, courseId } = payload;
            
            state.enrollments = state.enrollments.filter(
                e => !(e.user === userId && e.course === courseId)
            );
        }
    }
});

export const { enrollInCourse, unenrollFromCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;