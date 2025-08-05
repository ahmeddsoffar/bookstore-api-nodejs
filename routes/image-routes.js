const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  getAllImagesController,
  getImageByIdController,
  deleteImageController,
} = require("../controller/image-controller");

const router = express.Router();

// upload image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

// get all images
router.get("/allimages", authMiddleware, getAllImagesController);

//get image by id
router.get(
  "/singleimage/:id",
  authMiddleware,
  adminMiddleware,
  getImageByIdController
);

//delete image
router.delete(
  "/deleteimage/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);

module.exports = router;
