const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title must be less than 100 characters"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "publication year is required"],
    min: [1000, "Year must be greater than 1000"],
    max: [new Date().getFullYear(), "Year cannot be in the future"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Book = mongoose.model("Book", BookSchema); // Book is the collection name while BookSchema is the schema I want to use to create the collection

module.exports = Book;
