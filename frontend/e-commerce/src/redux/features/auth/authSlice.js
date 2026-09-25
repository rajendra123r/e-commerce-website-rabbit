import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk"
import { registerUser } from "./authThunk";

// Retrive user info and token from localStorage if available

const userFromStorage = localStorage.getItem("userInfo")
? JSON.parse(localStorage.getItem("userInfo"))
: null;

// Check for an existing guest ID in the localStorage or generate a new One

const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // like a functions

        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
            localStorage.removeItem("userInfo");
            localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
        },

        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
    },
     extraReducers: (builder) => {

      builder.addCase(loginUser.pending, (state) => {
         state.loading = true;
         state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
         state.loading = false;
         state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
         state.loading = true;
         state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
         state.loading = false;
         state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload.message;
      })
      
   }
});

export const { logout, generateNewGuestId } = authSlice.actions

export default authSlice.reducer;