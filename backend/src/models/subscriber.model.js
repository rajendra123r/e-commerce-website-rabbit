import mongoose, { Schema } from "mongoose";

const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    }
});

export const Subscriber = mongoose.model("Subscriber", subscriberSchema)