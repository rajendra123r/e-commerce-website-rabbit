import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    refreshToken: {
            type: String,
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    }
},{ timestamps: true });

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return null;
    
    const salt = await bcrypt.genSalt(10);
   this.password =  await bcrypt.hash(this.password, salt)
   
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//token generate

userSchema.methods.generatedAccessToken = function(){
   return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    }
)
}

userSchema.methods.generatedRefreshToken = function(){
   return jwt.sign(
    {
        _id: this._id,
        role: this.role,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
)
}


export const User = mongoose.model("User", userSchema)