import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) =>{
   try {
     const user = await User.findById(userId);
    const accessToken = user.generatedAccessToken();
    const refreshToken = user.generatedRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false});

    return { accessToken, refreshToken }
    
   } catch(error){
    console.log(error)
    throw new ApiError(500, "something went wrong while generating access token and refresh token")
    
   }

}

const registerUser = asyncHandler( async (req, res) => {
    
    const {  name, email, password } = req.body;

    if([name, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(409, "all field are required!")
    }

    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(401, " user are already exist")
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")

    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
           createdUser,
            "User registered successfully"
        )
    )
})

const loginUser = asyncHandler( async (req,res) => {
    const { email, password } = req.body;

    if([email, password].some((field) => {
        field.trim() === " ";
    })){
        throw new ApiError(401, "all field are required!")
    }

     const user = await User.findOne({email});
     if(!user){
        throw new ApiError(400, "invalid credentials")
     }

     const isPasswordvalid = await user.isPasswordCorrect(password);
     if(!isPasswordvalid){
        throw new ApiError(400, "invalid credentials")
     }

     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

     const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )

     const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
     }

     return res
     .status(201)
     .cookie("accessToken", accessToken, options )
     .cookie("refreshToken", refreshToken, options)
     .json(
        new ApiResponse(
            201,
            {
                user: loggedInUser,
            },
            "User Logged In Successfully"
        )
     )
})

const logoutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logout successFully.")
    )
    
})

const profileUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200,
            req.user,
            "Current user fetched Successffully"
        )
    )

})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const inCommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!inCommingRefreshToken){
        throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(inCommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id);

    if(!user){
        throw new ApiError(401, "Invalid refresh token")
    }

    if(inCommingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "refresh token is expired or used");
    } 

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {},
            "access token refreshed"
        )
    )


})

export {
    registerUser,
    loginUser,
    profileUser,
    logoutUser,
    refreshAccessToken

}