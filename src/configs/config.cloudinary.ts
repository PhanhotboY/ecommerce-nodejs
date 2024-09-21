import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.DEV_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.DEV_CLOUDINARY_API_KEY,
  api_secret: process.env.DEV_CLOUDINARY_API_SECRET,
});

export { cloudinary };
