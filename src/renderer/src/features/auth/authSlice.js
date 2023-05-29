import { createSlice } from "@reduxjs/toolkit";

const initialState = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : { user: null, accessToken: null, refreshToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      sessionStorage.setItem(
        "user",
        JSON.stringify({ user, accessToken, refreshToken })
      );
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      sessionStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
