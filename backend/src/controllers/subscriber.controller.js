import { Subscriber } from "../models/subscriber.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toSubscriber = asyncHandler( async (req, res) => {

    const { email } = req.body;

    if(!email){
        throw new ApiError(400, "Email is required.");
    }

    // Check if the email is already subscriber

    const subscriber = await Subscriber.findOne({ email });

    if(subscriber){
        throw new ApiError(400, "email is already subscriber.");
    }

    // create a new subscriber

    const newSubscriber = await Subscriber.create({
        email
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,
           newSubscriber,
           "Successfully subscribed to the newsletter!"

        )
    )
})

export{
    toSubscriber
}