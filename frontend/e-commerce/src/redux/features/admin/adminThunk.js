// fetch all users (admin only)

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
    const response = await api.get(`/api/admin/users`);

    return response?.data?.data
});

// Add the create user action

export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue  }) => {
    try {
        const response = await api.post(`/api/admin/add-user`,
            userData,           
        );

        return response?.data?.data
    } catch (error) {
        return rejectWithValue(error.response.data.data)
    }
});

// Update user info

export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name, email, role}) => {
    const response = await api.put(`/api/admin/update-user/${id}`,
        {name, email, role},
        
    );
    return response?.data?.data
});

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId) => {
     const response = await api.delete(`/api/admin/delete-user/${userId}`,
    
);

return response?.data?.data;

});

