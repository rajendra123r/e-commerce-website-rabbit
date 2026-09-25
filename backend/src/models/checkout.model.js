import mongoose,{ Schema } from "mongoose";

const checkoutItemSchema = new Schema({
    productId: {

        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    size: String,
    color: String,

},{ _id: false });

const checkoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending",
    },
    paymentDetails: {
        type: Schema.Types.Mixed, // store payment-related details(transaction ID, paypal response)
    },
    isFinalized:{
        type: Boolean,
        default: false,
    },
    finalizedAt: {
        type: Date,
    }
},{ timestamps: true }
)



export const Checkout = mongoose.model("Checkout", checkoutSchema)