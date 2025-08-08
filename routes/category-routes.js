const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category-controller");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
