import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Uploads an image buffer to Cloudinary and returns the secure URL
 * @param buffer The file buffer from multer
 * @param folder The target folder in Cloudinary
 * @returns Promise resolving to the secure URL of the uploaded image
 */
export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string = "kashgro/products"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Unknown error during upload"));
        }
      }
    );
    stream.end(buffer);
  });
};
