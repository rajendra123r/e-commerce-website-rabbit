import { createSlice } from "@reduxjs/toolkit";
import { createProduct, deleteProduct, fetchAdminProducts, updateProduct } from "./adminProductThunk";

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // create Product
        .addCase(createProduct.fulfilled, (state, action) => {
            state.products.push(action.payload)
        })
        //update Product
        .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex(
                (product) => product._id === action.payload._id
            );
            if(index !== -1){
                state.products[index] = action.payload;
            }
        })
        // Deletee product
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter(
                (product) => product._id !== action.payload
            )
        });
    }

});

export default adminProductSlice.reducer;