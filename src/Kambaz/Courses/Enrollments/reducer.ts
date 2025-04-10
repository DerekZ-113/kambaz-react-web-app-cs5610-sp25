import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as client from "./client";

// Define types for our state and enrollments
interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null
};

// Async thunk for fetching all enrollments
export const fetchEnrollments = createAsyncThunk<
  Enrollment[], // Return type
  void, // Argument type
  { rejectValue: string }
>(
  'enrollments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await client.fetchAllEnrollments();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch enrollments");
    }
  }
);

// Async thunk for enrolling in a course
export const enrollInCourse = createAsyncThunk<
  Enrollment | null, // Return type
  { userId: string; courseId: string }, // Argument type
  { rejectValue: string }
>(
  'enrollments/enroll',
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      const data = await client.enrollInCourse(userId, courseId);
      return data;
    } catch (error) {
      return rejectWithValue("Failed to enroll in course");
    }
  }
);

// Async thunk for unenrolling from a course
export const unenrollFromCourse = createAsyncThunk<
  { userId: string; courseId: string }, // Return type
  { userId: string; courseId: string }, // Argument type
  { rejectValue: string }
>(
  'enrollments/unenroll',
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      await client.unenrollFromCourse(userId, courseId);
      return { userId, courseId };
    } catch (error) {
      return rejectWithValue("Failed to unenroll from course");
    }
  }
);

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // Add synchronous actions for local state updates
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addEnrollment: (state, action: PayloadAction<Enrollment>) => {
      return {
        ...state,
        enrollments: Array.isArray(state.enrollments) 
          ? [...state.enrollments, action.payload]
          : [action.payload]
      };
    },
    removeEnrollment: (state, action: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
    clearEnrollments: (state) => {
      state.enrollments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      
      // Enroll in course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.enrollments = Array.isArray(state.enrollments) 
            ? [...state.enrollments, action.payload]
            : [action.payload];
        }
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      
      // Unenroll from course
      .addCase(unenrollFromCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, courseId } = action.payload;
        state.enrollments = state.enrollments.filter(
          (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
        );
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  }
});

export const { setEnrollments, addEnrollment, removeEnrollment, clearEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;