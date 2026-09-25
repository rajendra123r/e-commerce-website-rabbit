import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchAdminProducts", async () => {
    const response = await api.get(`/api/admin/product`);

    return response?.data?.data
})

// async funcctionn to create a new product

export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData) => {
        const response = await api.post(`/api/admin/product`,
            productData,
        );

        return response?.data?.data;

    });

    // async thunk to update an existing product

export const updateProduct = createAsyncThunk(
        "adminProducts/updateProduct",
        async ({id, productData }) => {
            const response = await api.put(`/api/admin/product/${id}`,
                 productData,
                );

                return response?.data?.data
});

// async thunk to delete a product

export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id) => {
        await api.delete(`/api/product/${id}`);

            return id
    });

    


