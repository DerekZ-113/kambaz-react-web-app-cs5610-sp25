import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountState, User } from "./types";

const initialState: AccountState = {
  currentUser: null,
  users: [],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    // other reducers...
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;