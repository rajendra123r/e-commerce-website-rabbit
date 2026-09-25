import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find({});


    return res
    .status(200)
    .json(
        new ApiResponse(200,
            users,
            "Get all users successfully."
        )
    )
})


const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const createdUser = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: role || "customer",
    });

    const userResponse = await User.findById(createdUser._id)
        .select("-password");

    return res.status(201).json(
        new ApiResponse(
            201,
            userResponse,
            "User created successfully"
        )
    );
});

const editUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);
    

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
    }

    const updatedUser = await user.save();
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,
           updatedUser,
            "user update successfully."
        )
    )
})


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({
        _id: req.params.id
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User deleted successfully."
            )
        );
});

export {
    getAllUsers,
    addUser,
    editUser,
    deleteUser

}