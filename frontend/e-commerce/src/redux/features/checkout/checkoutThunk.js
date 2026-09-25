import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async ( checkoutdata, {rejectWithValue}) => {
        try {
            const response = await api.post(`/api/checkout`,
                checkoutdata,
               
                // {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                //     }
                // }
            );
        
            return response?.data?.data
        }catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)