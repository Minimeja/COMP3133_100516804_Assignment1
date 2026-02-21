const cloudinary = require("../config/cloudinary");

async function uploadImage(imageInput) {
  if (!imageInput) return null;

  try {
    const result = await cloudinary.uploader.upload(imageInput, {
      folder: "employees",
      resource_type: "image"
    });

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary upload error:", error?.message || error);
    throw new Error(error?.message || "Image upload failed");
  }
}

module.exports = uploadImage;