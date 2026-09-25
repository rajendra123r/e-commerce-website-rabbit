import { createSlice } from "@reduxjs/toolkit";
import { fetchProductDetails, fetchProductsByFilters, fetchSimilarProducts, updateProduct } from "./productsThunk";

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null, // Store the details of the single Product
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            category: "",
            size: "",
            color: "",
            gender: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            material: "",
            collection: "",
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            
        },
        clearFilters: (state) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        },
    },

    extraReducers: (builder) => {
        builder
        // handle fetching products with filter
        .addCase(fetchProductsByFilters.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
            state.loading = false;
            state.products = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchProductsByFilters.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        // handle fetching  single products details
        .addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }) 

        // handle updating product
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload;
            const index = state.products.findIndex(
                (product) => product._id === updateProduct._id
            );
            if(index !== -1){
                state.products[index] = updatedProduct;
            }
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }) 
        .addCase(fetchSimilarProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.similarProducts = action.payload
        })
        .addCase(fetchSimilarProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }) 

    }

})


export const { setFilters, clearFilters } = productsSlice.actions
export default productsSlice.reducer