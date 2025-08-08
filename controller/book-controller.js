const Book = require("../models/book");
const ImageModel = require("../models/image");
const { deleteImageFromCloudinary } = require("../helpers/cloudinary-helper");
const Category = require("../models/category");

const getAllBooks = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to 1st page
    const limit = parseInt(req.query.limit) || 6; // Default to 6 books per page
    const skip = (page - 1) * limit;

    // Build filter by category if provided (supports id or slug via `category`)
    const { categoryId, category } = req.query;
    const filter = {};
    if (category) {
      // If a slug is provided, resolve it to an ObjectId first
      const categoryDoc = await Category.findOne({ slug: category });
      if (!categoryDoc) {
        return res.status(200).json({
          success: true,
          message: "No books found",
          books: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalBooks: 0,
            hasNextPage: false,
            hasPrevPage: page > 1,
            limit: limit,
          },
        });
      }
      filter.categoryId = categoryDoc._id;
    } else if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Get total count for pagination info based on filter
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    // Fetch books with pagination and populate image data
    const allBooks = await Book.find(filter)
      .populate("imageId", "imageUrl")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Transform books to include coverImage field
    const booksWithCovers = allBooks.map((book) => ({
      ...book.toObject(),
      coverImage: book.imageId?.imageUrl || null,
    }));

    res.status(200).json({
      success: true,
      message:
        allBooks.length > 0 ? "Books fetched successfully" : "No books found",
      books: booksWithCovers,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBooks: totalBooks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const getCurrentBookId = req.params.id;
    // CHANGED: Added .populate() to include image data
    const book = await Book.findById(getCurrentBookId)
      .populate("imageId", "imageUrl")
      .populate("categoryId", "name slug");

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
    // Validate category if provided
    if (newBookFormData.categoryId) {
      const categoryExists = await Category.findById(
        newBookFormData.categoryId
      );
      if (!categoryExists) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category selected" });
      }
    }
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
      updatedBookFormData.imageId.toString() !==
        currentBook.imageId?.toString();

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

    // Validate category if provided
    if (updatedBookFormData.categoryId) {
      const categoryExists = await Category.findById(
        updatedBookFormData.categoryId
      );
      if (!categoryExists) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category selected" });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      getCurrentBookId,
      updatedBookFormData,
      {
        new: true,
      }
    )
      .populate("imageId", "imageUrl")
      .populate("categoryId", "name slug");

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
