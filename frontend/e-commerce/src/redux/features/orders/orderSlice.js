import { createSlice } from "@reduxjs/toolkit";
import { fetchOrderDetails, fetchUserOrders } from "./orderThunk";

const orderSlice = createSlice({
    name:"orders",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
        // Fetch user orders
        .addCase(fetchUserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
            // console.log(action.payload)
        })
        .addCase(fetchUserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        // Fetch order details
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload;
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export default orderSlice.reducer