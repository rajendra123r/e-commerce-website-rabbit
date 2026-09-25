import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProductAdmin = asyncHandler( async (req, res) => {

    const products = await Product.find({});
    if(!products){
        throw new ApiError(400, "products not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            products,
            "All Product get successfully."
        )
    )
})

export {
    getProductAdmin
}