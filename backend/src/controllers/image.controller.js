import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadToCloudinary} from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'

const uploadImage = asyncHandler(async(req, res) => {

    const fileLocalPath = req.files?.file?.[0].path

    if(!fileLocalPath) {
        throw new ApiError(400, "No File Uploaded")
    }

    const file = await uploadToCloudinary(fileLocalPath)
    console.log((file));
    if(!file) {
        throw new ApiError(400, "File Not uploaded to cloudinary")
    }

    return res.status(200).json(
        new ApiResponse(200, "File uploaded", {
            url : file.secure_url
        })
    )
})

export {uploadImage}