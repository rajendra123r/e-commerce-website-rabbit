import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId, guestId}, {rejectWithValue}) => {
    try {
        const response = await api.get(`/api/cart`,
            {
                params: { userId, guestId },
            },
            // {
            //     withCredentials: true
            // }        
        );

        return response?.data?.data
        
    } catch(error){
        console.error(error);
        return rejectWithValue(error.response.data)  
    }
});

// Add an item to the cart for a user or guest

export const addToCart = createAsyncThunk("cart/addToCart", async ({productId, quantity, size, color, guestId, userId }, {rejectWithValue}) => {
    try {
        const response = await api.post(`/api/cart`, {
            productId,
            quantity,
            size,
            color,
            guestId,
            userId,
        }
    );
        return response?.data?.data

        
    } catch(error){
        return rejectWithValue(error.response.data); 
    }
});

// Update the quantity of an item in the cart

export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity", async ({ productId, quantity, guestId, userId, size, color},
        {rejectWithValue}) => {
            try {
                const response = await api.put(`/api/cart`,
                    {
                        productId,
                        quantity,
                        guestId,
                        userId,
                        size,
                        color
                    }
                );

                return response?.data?.data
            } catch (error){
                return rejectWithValue(error.response.data)
            }
        }
);

// Remove an item from the cart

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, guestId, userId, size, color }, {rejectWithValue}) => {
    try {
        const response = await api({
            method: "DELETE",
            url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: { productId, guestId, userId, size, color },
        });

        return response?.data?.data
        
    } catch(error){
        return rejectWithValue(error.response.data);  
    }
});

// Merge guest cart into user cart

export const mergeCart = createAsyncThunk("cart/mergeCart", async ({guestId, user}, {rejectWithValue}) => {
    try {
        const response = await api.post(`/api/cart/merge`,
            { guestId, user },
           
        );

        return response?.data?.data
        
    }catch(error){
        return rejectWithValue(error.response.data)
    }
})