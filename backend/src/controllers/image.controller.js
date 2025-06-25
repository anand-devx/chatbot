import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadToCloudinary} from '../utils/cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'

const uploadImage = asyncHandler(async(req, res) => {

    const fileBuffer = req.files?.file?.[0]?.buffer

    if(!fileBuffer) {
        throw new ApiError(400, "No File Uploaded")
    }

    const url = await uploadToCloudinary(fileBuffer)
   
    if(!url) {
        throw new ApiError(400, "File Not uploaded to cloudinary")
    }

    return res.status(200).json(
        new ApiResponse(200, "File uploaded", {
            url 
        })
    )
})

export {uploadImage}