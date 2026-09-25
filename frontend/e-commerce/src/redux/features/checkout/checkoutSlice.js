import { createSlice } from "@reduxjs/toolkit";
import { createCheckout } from "./checkoutThunk";

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export default checkoutSlice.reducer