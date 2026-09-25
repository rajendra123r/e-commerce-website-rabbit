import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// console.log("CLOUDINARY_CLOUD_NAME: ", process.env.CLOUDINARY_CLOUD_NAME);




const  uploadOnCloudinary = async (localFilePath) => {
    cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})
    try{
        if(!localFilePath) return null;
        // uplaod the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        // file has been uploaded successfully
        
        console.log('File uploaded to Cloudinary:', response.url);
        fs.unlinkSync(localFilePath);
        return response;
        
        
        // remove the locally saved temparary file as the uplaod opration is successful
    } catch (error) {
       fs.unlinkSync(localFilePath);
       // remove the locally saved temparary file as the uplaod opration got failed
       console.error('Error uploading to Cloudinary:', error);
        return null;
    }
}

export  { uploadOnCloudinary }; 