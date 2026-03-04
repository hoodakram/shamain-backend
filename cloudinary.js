import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config(); // ✅ Add this here

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log("Cloudinary configured with:", process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.error("CLOUDINARY_CLOUD_NAME not set in .env file");
}

export default cloudinary;