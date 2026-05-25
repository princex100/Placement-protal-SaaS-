import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setLoading, setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
