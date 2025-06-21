import {asyncHandler} from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import ApiResponse from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    
    const {fullName, email, password, username} = req.body
    console.log(fullName, email, password, username);
    if([fullName, email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUserName = await User.findOne({username})
    const existedEmail = await User.findOne({email})

    if(existedUserName) {
        throw new ApiError(400, "Username already used!!")
    }

    if(existedEmail) {
        throw new ApiError(400, "Email already Exists!! Login!")
    }

    const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password
    })
    
    if(!user) {
        throw new ApiError(400, "User could not be registered!")
    }

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res.status(200).json(
        new ApiResponse(200, "User Successfully Registered", createdUser)
    )

})

export {registerUser}