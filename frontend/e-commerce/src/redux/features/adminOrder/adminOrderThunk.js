import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios"
import api from "../../../api/axios";

// fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllorders",
     async (_, { rejectWithValue }) => {
          try {
            const response = await api.get(`/api/admin/orders`);

                return response?.data?.data
            
          } catch (error) {
             return rejectWithValue(error.response.data.data)
          }
})

// update order delivery status

export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
     async ({ id, status }, { rejectWithValue }) => {
          try {
            const response = await api.put(`/api/admin/orders/${id}`,
                { status },            
               );

                return response?.data?.data
            
          } catch (error) {
             return rejectWithValue(error.response.data.data)
          }
})

// Delete an order
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
     async (id, { rejectWithValue }) => {
          try {
            await api.delete(`/api/admin/orders/${id}`);
                
                return id;

          } catch (error) {
             return rejectWithValue(error.response.data.data)
          }
});
