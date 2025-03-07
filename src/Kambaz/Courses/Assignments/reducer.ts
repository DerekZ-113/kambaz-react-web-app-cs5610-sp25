import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    assignments: db.assignments,
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment: (state, { payload: assignment }) => {
            // Use the assignment ID if provided, otherwise generate one
            const newAssignment = {
                _id: assignment._id || uuidv4(),
                title: assignment.title,
                description: assignment.description,
                course: assignment.course,
                availableFrom: assignment.availableFrom || new Date().toISOString(),
                dueDate: assignment.dueDate || new Date().toISOString(),
                points: assignment.points || 100,
                modules: assignment.modules || ["Multiple Modules"],
            };
            state.assignments = [...state.assignments, newAssignment];
        },
        
        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(
                assignment => assignment._id !== assignmentId
            );
        },
        
        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map(a => 
                a._id === assignment._id ? { ...a, ...assignment } : a
            );
        },
        
        editAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.map(a => 
                a._id === assignmentId ? { ...a, editing: true } : a
            );
        },
        
        cancelEditAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.map(a => 
                a._id === assignmentId ? { ...a, editing: false } : a
            );
        }
    },
});

export const { 
    addAssignment, 
    deleteAssignment, 
    updateAssignment,
    editAssignment,
    cancelEditAssignment
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;