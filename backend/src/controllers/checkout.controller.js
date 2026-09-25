import { Checkout } from "../models/checkout.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";

const createCheckout = asyncHandler( async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if(!checkoutItems || checkoutItems.length === 0){
        throw new ApiResponse(400, "no items in checkout.");
    }

    // Create a new checkout session
    const newCheckout = await Checkout.create({
        user: req.user._id,
        checkoutItems: checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Pending",
        isPaid: false,
    });


    return res
    .status(201)
    .json(
        new ApiResponse(201,
            newCheckout,
            "create checkout succesfully."
        )
    )
});

const updateCheckout = asyncHandler( async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    const checkout = await Checkout.findById(req.params.id);

    if(!checkout){
        throw new ApiResponse(404, "Checkout not found.");
    }

    if(paymentStatus === "paid"){
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();
        await checkout. save();

        return res
        .status(200)
        .json(
            new ApiResponse(200,
                checkout,
                "payment status successfully."
            )
        )
    }else{
        throw new ApiError(400, "Invalid Payment Status");
    }
});

const finalCheckout = asyncHandler( async (req, res) => {

    const checkout = await Checkout.findById(req.params.id);

    if(!checkout){
        throw new ApiError(404, "Checkout not found.")
    }

    if(checkout.isPaid && !checkout.isFinalized){
        // create final order based on the checkout details
        const finalOrder = await Order.create({
            user: checkout. user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout. shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout. totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: checkout.paymentDetails,
        });

        // Mark the checkout as finalized
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();
        // Delete the cart associated with the user
        await Cart.findOneAndDelete({ user: checkout.user });
         return res
         .status(201)
         .json(
            new ApiResponse(201,
                finalOrder,
                "final order is finalized successfully"
            )
         )       
    } else if(checkout.isFinalized){
        throw new ApiError(400, "Checkout already finalized.");
    }else{
        throw new ApiError(400, " Checkout is not paid.");
    }


})



export {
    createCheckout,
    updateCheckout,
    finalCheckout
}