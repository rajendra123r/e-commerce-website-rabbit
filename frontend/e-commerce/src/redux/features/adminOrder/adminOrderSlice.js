import { createSlice } from "@reduxjs/toolkit";
import { deleteOrder, fetchAllOrders, updateOrderStatus } from "./adminOrderThunk";

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
        // Fetch all order
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length;

            // calculate total sales
            const totalSales = action.payload.reduce((acc, order) => {
                return acc + order.totalPrice;
            }, 0);
            state.totalSales = totalSales
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        })
        // Update Order Status
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            const  updatedOrder = action.payload;
            const orderIndex = state.orders.findIndex(
                (order) => order._id === updatedOrder._id
            );

            if(orderIndex !== -1){
                state.orders[orderIndex] = updatedOrder;
            }
        })
        // delete order
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(
                (order) => order._id !== action.payload
            )
        });
        
    }

});

export default adminOrderSlice.reducer