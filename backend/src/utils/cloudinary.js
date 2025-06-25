import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

 cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });
    


export const uploadToCloudinary = async (filepath) => {
    try {
        const response = await cloudinary.uploader.upload(filepath, {
                    resource_type: "auto",
                    
                })
        fs.unlinkSync(filepath)
        return response;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(filepath)
        throw error
        return null;
    }
}
