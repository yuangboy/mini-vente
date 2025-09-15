import multer from "multer";
import {
  v2 as cloudinary,
} from "cloudinary";
import type {  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

import type { RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CustomFile extends Express.Multer.File {
  path: string;
}

const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image",
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result as UploadApiResponse);
    });
  });
};

const multerMiddleware: RequestHandler = multer({
  dest: "uploads/",
}).array("image", 4);


export {
  uploadToCloudinary,
  multerMiddleware
}


// const multerMiddleware:RequestHandler=multer({
//   storage:multer.diskStorage({})
// }).single("image");
