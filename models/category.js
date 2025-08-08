const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true,
    unique: true,
    maxlength: [50, "Category name must be less than 50 characters"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, "Description must be less than 200 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
