const cloudinary = require("../config/cloudinray");

//this is used for the actual upload of the image to cloudinary

const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath); // this is what is used to upload to cloudinary
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error uploading image to cloudinary", error);
    throw new Error("Error uploading image to cloudinary");
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error deleting image from cloudinary", error);
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
