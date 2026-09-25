import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("authorization")?.replace("Bearer ", "");
        console.log(token);
    
        if(!token){
            throw new ApiError(401, "unauthorized request")
        };
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
    
        req.user = user;
    
        next()
    }catch(error){
        console.log(error);
        throw new ApiError(401, error?.message || " Invalid Access Token");  
    }
})

const verifyAdmin = asyncHandler( async (req, res, next) => {
      if(req.user.role !== "admin"){
        throw new ApiError(403, " access denied ")
    }
    next();

})



export {
    verifyJWT,
    verifyAdmin
    
}