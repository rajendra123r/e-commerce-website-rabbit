import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchProductsByFilters = createAsyncThunk("products/fetchByFilters",
    async(
       {
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
       }
    ) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);

        const response = await api.get(`/api/product/get?${query.toString()}`);

        return response?.data?.data
    }
)
// Async thunk to fetch a single product by ID

export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails", 
    async (id) => {
        const response = await api.get(`/api/product/get/${id}`);

        return response?.data?.data
    } 
);

//Async thunk to fetch similar products

export const updateProduct = createAsyncThunk("products/updateProduct",
    async ({id, productData}) => {
        const response = await api.put(`/api/product/${id}`,
            productData,
           
        );
        return response?.data?.data;
    }
)

// Async thunk to fetch similar product

export const fetchSimilarProducts = createAsyncThunk("products/fetchSimilarProducts",
    async ({id}) => {
        const response = await api.get(`/api/product/get/similar/${id}`);
        return response?.data?.data
    }
)