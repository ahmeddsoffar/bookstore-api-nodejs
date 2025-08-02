const Book = require("../models/book");

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find();
    if (allBooks.length > 0) {
      res.status(200).json({
        success: true,
        message: "Books fetched successfully",
        books: allBooks,
      });
    } else {
      res.status(404).json({ success: false, message: "No books found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    const book = await Book.findById(getCurrentBookId);
    if (book) {
      res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        book,
      });
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const addBook = async (req, res) => {
  try {
    const newBookFormData = req.body;
    const newlyCreatedBook = await Book.create(newBookFormData);
    if (newlyCreatedBook) {
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        book: newlyCreatedBook,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    const updatedBookFormData = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      getCurrentBookId,
      updatedBookFormData,
      {
        new: true,
      }
    );
    if (updatedBook) {
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book: updatedBook,
      });
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(getCurrentBookId);
    if (deletedBook) {
      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
};
