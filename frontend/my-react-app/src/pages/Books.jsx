import React, { useState, useEffect } from "react";
import { bookApi } from "../api/bookApi";
import { imageApi } from "../api/imageApi";
import { useAuth } from "../context/AuthContext";
import {
  Book,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

const Books = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    imageId: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchBooks(1, true); // Initial load
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load more when 1000px from bottom
      ) {
        if (hasNextPage && !loadingMore && !loading) {
          loadMoreBooks();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loadingMore, loading, currentPage]);

  const fetchBooks = async (page = 1, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setBooks([]);
      } else {
        setLoadingMore(true);
      }

      const response = await bookApi.getBooks(page, 6);
      const { books: newBooks, pagination } = response;

      if (isInitial) {
        setBooks(newBooks || []);
      } else {
        setBooks((prevBooks) => [...prevBooks, ...(newBooks || [])]);
      }

      setCurrentPage(pagination.currentPage);
      setHasNextPage(pagination.hasNextPage);
      setTotalBooks(pagination.totalBooks);
    } catch (error) {
      setError("Failed to fetch books");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreBooks = async () => {
    if (hasNextPage && !loadingMore) {
      await fetchBooks(currentPage + 1, false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate that an image is provided
    if (modalType === "add" && !selectedImage) {
      setError("Book cover is required. Please select an image.");
      return;
    }

    if (modalType === "edit" && !selectedImage && !formData.imageId) {
      setError("Book cover is required. Please select an image.");
      return;
    }

    try {
      let imageId = formData.imageId;

      // If there's a new image selected, upload it first
      if (selectedImage) {
        setUploadingImage(true);
        try {
          const imageResponse = await imageApi.uploadImage(selectedImage);
          imageId = imageResponse.image._id;
        } catch (imageError) {
          setError("Failed to upload image. Please try again.");
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Create or update book with imageId
      const bookData = {
        ...formData,
        imageId: imageId,
      };

      if (modalType === "add") {
        await bookApi.createBook(bookData);
      } else if (modalType === "edit") {
        await bookApi.updateBook(selectedBook._id, bookData);
      }

      closeModal();
      fetchBooks(1, true); // Reload from first page
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
      setUploadingImage(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await bookApi.deleteBook(bookId);
      fetchBooks(1, true); // Reload from first page
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete book");
    }
  };

  const openModal = (type, book = null) => {
    setModalType(type);
    setSelectedBook(book);

    if (type === "add") {
      setFormData({ title: "", author: "", year: "", imageId: "" });
      setPreviewImage(null);
    } else if (type === "edit" && book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year.toString(),
        imageId: book.imageId || "",
      });
      setPreviewImage(book.coverImage || null);
    }

    setSelectedImage(null);
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFormData({ title: "", author: "", year: "", imageId: "" });
    setSelectedImage(null);
    setPreviewImage(null);
    setUploadingImage(false);
    setError("");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const removeImage = () => {
    // In add mode, don't allow removing image since it's required
    if (modalType === "add") {
      setError("Book cover is required and cannot be removed.");
      return;
    }

    // In edit mode, only allow removal if there's already an existing image
    if (modalType === "edit" && !formData.imageId) {
      setError("Book cover is required and cannot be removed.");
      return;
    }

    setSelectedImage(null);
    setPreviewImage(null);
    setFormData({ ...formData, imageId: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Book className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isAdmin ? "Books Management" : "Books Collection"}
              </h1>
              {totalBooks > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing {books.length} of {totalBooks} books
                </p>
              )}
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => openModal("add")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add New Book
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No books found
            </h2>
            <p className="text-gray-500 mb-4">
              {isAdmin
                ? "Start by adding your first book to the collection."
                : "No books are available in the collection yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => openModal("add")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Book
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Book Cover */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Book className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No Cover</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-1">by {book.author}</p>
                      <p className="text-sm text-gray-500">
                        Published: {book.year}
                      </p>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => openModal("view", book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => openModal("edit", book)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Edit Book"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">
                  Loading more books...
                </span>
              </div>
            )}

            {/* Load More Button (fallback) */}
            {hasNextPage && !loadingMore && books.length > 0 && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMoreBooks}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Load More Books
                </button>
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && books.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You've reached the end of the collection!
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Showing all {totalBooks} books
                </p>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {modalType === "add" && "Add New Book"}
                  {modalType === "edit" && "Edit Book"}
                  {modalType === "view" && "Book Details"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {modalType === "view" && selectedBook ? (
                <div className="space-y-4">
                  {/* Book Cover Display */}
                  {selectedBook.coverImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Book Cover
                      </label>
                      <img
                        src={selectedBook.coverImage}
                        alt={`${selectedBook.title} cover`}
                        className="w-40 h-52 object-cover rounded border shadow-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Title
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {selectedBook.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Author
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {selectedBook.author}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Year
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {selectedBook.year}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <p className="text-gray-900 text-sm">
                      {new Date(selectedBook.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedBook.updatedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Last Updated
                      </label>
                      <p className="text-gray-900 text-sm">
                        {new Date(selectedBook.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : isAdmin ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter book title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1000"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter publication year"
                    />
                  </div>

                  {/* Book Cover Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Cover <span className="text-red-500">*</span>
                    </label>

                    {previewImage ? (
                      <div className="space-y-3">
                        <div className="relative inline-block">
                          <img
                            src={previewImage}
                            alt="Book cover preview"
                            className="w-32 h-40 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {modalType === "add"
                            ? "Select a new image below to replace this one (cover is required)"
                            : "Click the X to remove or select a new image below"}
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center hover:border-red-400 transition-colors bg-red-50">
                        <ImageIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-red-600 mb-2">
                          <span className="font-medium">Required:</span> Upload
                          a book cover image
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          JPG, PNG or GIF (max 5MB)
                        </p>
                      </div>
                    )}

                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors mt-2">
                      <Upload className="h-4 w-4" />
                      {previewImage ? "Change Cover" : "Select Cover"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploadingImage && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      )}
                      {uploadingImage
                        ? "Uploading..."
                        : modalType === "add"
                        ? "Add Book"
                        : "Update Book"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">
                    <X className="h-12 w-12 mx-auto mb-2" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Access Denied
                  </h3>
                  <p className="text-gray-600">
                    You don't have permission to {modalType} books.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
