import { createSlice } from "@reduxjs/toolkit";
import { addUser, deleteUser, fetchUsers, updateUser } from "./adminThunk";


const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            const updatedUser = action.payload;
            const userIndex = state.users.findIndex(
                (user) => user._id === updatedUser._id
            );
            if(userIndex !== -1){
                state.users[userIndex] = updatedUser;
            }
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.payload._id);
        })
        .addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload); // add a new to the state
        })
        .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })
    }
})

export default adminSlice.reducer