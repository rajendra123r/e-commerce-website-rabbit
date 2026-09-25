import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMyOrder = asyncHandler( async (req, res) => {
    // Find orders for the authenticated user

    const orders = await Order.find({ user: req.user._id}).sort({
        createdAt: -1,
    }); // sort by most recent orders

    if(!orders){
        throw new ApiError(400, "order not found.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            orders,
            "Orders get successfully."
        )
    )
});

const orderDetails = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        throw new ApiError(400, "Order not found.");
    }

    // Return the full order details

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Get Order Details successfully."
        )
    )



})

export {
    getMyOrder,
    orderDetails

}