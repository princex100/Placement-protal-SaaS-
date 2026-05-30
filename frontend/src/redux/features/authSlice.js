import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  role: storedUser ? JSON.parse(storedUser).role : null,
  isAuthenticated: !!storedUser,
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
      // Persist to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.loading = false;
      // Remove from localStorage
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setLoading, setCredentials, clearCredentials, updateUser } = authSlice.actions;

export default authSlice.reducer;
