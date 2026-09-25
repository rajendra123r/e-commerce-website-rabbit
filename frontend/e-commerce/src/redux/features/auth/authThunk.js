import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await api.post(`/api/users/login`,
            userData, 
        );
        
        localStorage.setItem("userInfo", JSON.stringify(response?.data?.data?.user));
        // console.log("this is user information.",localStorage.getItem("userInfo", JSON.stringify(response.data.data.user)))

        return response?.data?.data?.user

    } catch(error){
        console.log(error)
        return rejectWithValue(error.response.data.data);
    
    }
})

export const registerUser = createAsyncThunk("auth/register", async (userData, {rejectWithValue}) => {
    try {
        const response = await api.post(`/api/users/register`,
            userData,       
        )

        return response?.data?.data
        
    } catch(error){
        return rejectWithValue(error.response.data.data)
        
    }
})

export const logoutUser = createAsyncThunk("auth/logout", async ({rejectWithValue}) => {
    try {
        const response = await api.post(`/api/users/logout`,
            {},           
        );

        return response?.data?.data
    } catch (error) {
        return rejectWithValue(error.response.data.data);
        
    }
})

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async(_, {rejectWithValue}) => {
    try {
        const response = await api.post(`/api/users/refresh-token`,
            {},           
        );

        return response?.data?.data
    }catch(error){
         console.log(error);

            return rejectWithValue(
                error.response?.data?.message ||
                "Unable to refresh access token"
            );
    }
})