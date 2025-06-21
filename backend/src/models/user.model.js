import jwt from "jsonwebtoken";
import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        unique:[true, "Username already exists"],
        required:[true, "Username is required"],
        lowercase:[true, "Only lowercase letters are allowed in username"],
        trim:true
    },
    email:{
        type:String,
        unique:[true, "Email already exists"],
        required:[true, "Email is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        trim:true
    },
    fullName:{
        type:String,
        required:[true, "Name is Required"],
        trim:true
    },
    // avatar:{
    //     type:String,
    //     trim:true
    // },
    refreshToken:{
        type: String,
        // unique:true,
        trim:true
    }
}, {
    timestamps:true
})

// methods:-

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    return next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
    
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)