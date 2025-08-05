const ImageModel = require("../models/image");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../helpers/cloudinary-helper"); // {} to access only the uploadImageToCloudinary function

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const { url, publicId } = await uploadImageToCloudinary(req.file.path);
    const image = new ImageModel({
      imageUrl: url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await image.save();
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log("Error uploading image", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
    });
  }
};

const getAllImagesController = async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json({ success: true, images });
  } catch (error) {
    console.log("Error getting all images", error);
    res.status(500).json({
      success: false,
      message: "Error getting all images",
    });
  }
};

const getImageByIdController = async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    res.status(200).json({ success: true, image });
  } catch (error) {
    console.log("Error getting image by id", error);
    res.status(500).json({
      success: false,
      message: "Error getting image by id",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
    const image = await ImageModel.findByIdAndDelete(req.params.id);
    await deleteImageFromCloudinary(image.publicId);
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.log("Error deleting image", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
    });
  }
};

module.exports = {
  uploadImageController,
  getAllImagesController,
  getImageByIdController,
  deleteImageController,
};
