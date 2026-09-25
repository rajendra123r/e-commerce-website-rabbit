import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders",
    async(_, {rejectWithValue}) => {
        try {
            const response = await api.get(`/api/order/my-orders`);
        
            return response?.data?.data
        } catch (error) {
            return rejectWithValue(error.respo.data.data)
        }
    }
);

// Async thunk to fetch orders details bt ID

export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/order/${orderId}`,
            // {
            //     headers: {
            //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            //     }
            // }
            
        );
       
        return response?.data?.data
    } catch(error){
        return rejectWithValue(error.response.data.data)
    }
});

