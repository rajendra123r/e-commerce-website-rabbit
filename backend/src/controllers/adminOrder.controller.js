import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({}).populate("user", "name email");

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            orders,
            "all orders get successfully."
        )
    )
});

const updateOrderStatus = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if(!order){
        throw new ApiError(400, "order not found.");
    }

    if(order){
        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
    }
    const updatedOrder = await order.save();

    return res
    .status(200)
    .json(
       new ApiResponse(
         200,
        updatedOrder,
        "order status update successfully."
       )
    )
})

const deleteOrder = asyncHandler( async (req, res) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        throw new ApiError(400, "order not found.");
    }

    await Order.findByIdAndDelete(req.params.id)

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {},
            "order delete successfully."
        )
    )

    




})

export {
    getOrders,
    updateOrderStatus,
    deleteOrder
}