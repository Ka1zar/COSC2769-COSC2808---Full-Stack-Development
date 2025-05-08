// config/cloudinary.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration with multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event_images', // Folder name in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
    transformation: [{ width: 800, height: 600, crop: 'limit' }] // Image transformation
  }
});

// Multer setup to handle the file upload process
const upload = multer({ storage });

module.exports = { cloudinary, upload };
