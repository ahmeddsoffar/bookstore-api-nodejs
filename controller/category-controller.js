const Category = require("../models/category");
const Book = require("../models/book");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name: name.trim(), description });
    res
      .status(201)
      .json({ success: true, message: "Category created", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Recompute slug when name changes so URLs stay in sync
    const updateFields = {};
    if (typeof name === "string" && name.trim()) {
      updateFields.name = name.trim();
      updateFields.slug = name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    if (typeof description === "string") {
      updateFields.description = description;
    }

    const updated = await Category.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent delete if category in use
    const inUseCount = await Book.countDocuments({ categoryId: id });
    if (inUseCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category while it is assigned to books",
        inUseCount,
      });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
