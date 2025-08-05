const Book = require("../models/book");
const ImageModel = require("../models/image");
const { deleteImageFromCloudinary } = require("../helpers/cloudinary-helper");

const getAllBooks = async (req, res) => {
  try {
    // CHANGED: Added .populate() to include image data
    const allBooks = await Book.find().populate("imageId", "imageUrl");

    // CHANGED: Always return 200 OK, even for empty collections
    const booksWithCovers = allBooks.map((book) => ({
      ...book.toObject(),
      coverImage: book.imageId?.imageUrl || null, // Add coverImage field
    }));

    res.status(200).json({
      success: true,
      message:
        allBooks.length > 0 ? "Books fetched successfully" : "No books found",
      books: booksWithCovers, // Send transformed books (empty array if no books)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    // CHANGED: Added .populate() to include image data
    const book = await Book.findById(getCurrentBookId).populate(
      "imageId",
      "imageUrl"
    );

    if (book) {
      // CHANGED: Transform book to include coverImage URL for frontend
      const bookWithCover = {
        ...book.toObject(),
        coverImage: book.imageId?.imageUrl || null, // Add coverImage field
      };

      res.status(200).json({
        success: true,
        message: "Book fetched successfully",
        book: bookWithCover, // Send transformed book
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

    // First, get the current book to check for existing image
    const currentBook = await Book.findById(getCurrentBookId);
    if (!currentBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Check if image is being changed
    const isImageChanging =
      updatedBookFormData.imageId &&
      updatedBookFormData.imageId !== currentBook.imageId?.toString();

    // If image is changing, delete the old image from Cloudinary and database
    if (isImageChanging && currentBook.imageId) {
      try {
        const oldImage = await ImageModel.findById(currentBook.imageId);
        if (oldImage) {
          await deleteImageFromCloudinary(oldImage.publicId);
          await ImageModel.findByIdAndDelete(currentBook.imageId);
          console.log(`Cleaned up old image: ${oldImage.publicId}`);
        }
      } catch (cleanupError) {
        console.log("Error cleaning up old image:", cleanupError);
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      getCurrentBookId,
      updatedBookFormData,
      {
        new: true,
      }
    ).populate("imageId", "imageUrl");

    if (updatedBook) {
      // Transform book to include coverImage URL for frontend
      const bookWithCover = {
        ...updatedBook.toObject(),
        coverImage: updatedBook.imageId?.imageUrl || null,
      };

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book: bookWithCover,
      });
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error) {
    console.log("Error updating book:", error);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;

    const bookToDelete = await Book.findById(getCurrentBookId);
    if (!bookToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (bookToDelete.imageId) {
      try {
        const imageToDelete = await ImageModel.findById(bookToDelete.imageId);
        if (imageToDelete) {
          await deleteImageFromCloudinary(imageToDelete.publicId);
          await ImageModel.findByIdAndDelete(bookToDelete.imageId);
          console.log(`Cleaned up image: ${imageToDelete.publicId}`);
        }
      } catch (cleanupError) {
        console.log("Error cleaning up image:", cleanupError);
        // Don't fail the delete if cleanup fails, just log it
      }
    }

    // Delete the book
    const deletedBook = await Book.findByIdAndDelete(getCurrentBookId);
    if (deletedBook) {
      res.status(200).json({
        success: true,
        message: "Book and associated image deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Book not found" });
    }
  } catch (error) {
    console.log("Error deleting book:", error);
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
