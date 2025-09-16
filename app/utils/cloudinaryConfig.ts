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
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface CustomFile extends Express.Multer.File {
  path: string;
}


async function uploadToCloudinary(file: File): Promise<{ secure_url: string }> {
  if (!file || file.size === 0) {
    throw new Error("Fichier vide ou invalide.");
  }

  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: file.type });

  const form = new FormData();
  form.append("file", blob, file.name);

  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!preset) throw new Error("upload_preset manquant dans .env");

  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Cloudinary response:", error);
    throw new Error(error.message || "Échec de l'upload Cloudinary");
  }

  return await res.json();
}


const multerMiddleware: RequestHandler = multer({
  dest: "uploads/",
}).array("image", 4);



export { cloudinary, multerMiddleware, uploadToCloudinary };