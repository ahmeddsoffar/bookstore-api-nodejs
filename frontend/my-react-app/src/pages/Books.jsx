import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Book, Plus, Edit, Trash2, Eye, X } from "lucide-react";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/books/get-books");
      setBooks(response.data.books || []);
    } catch (error) {
      setError("Failed to fetch books");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (modalType === "add") {
        await api.post("/books/create-book", formData);
      } else if (modalType === "edit") {
        await api.put(`/books/update-book/${selectedBook._id}`, formData);
      }

      closeModal();
      fetchBooks();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await api.delete(`/books/delete-book/${bookId}`);
      fetchBooks();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete book");
    }
  };

  const openModal = (type, book = null) => {
    setModalType(type);
    setSelectedBook(book);

    if (type === "add") {
      setFormData({ title: "", author: "", year: "" });
    } else if (type === "edit" && book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year.toString(),
      });
    }

    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setFormData({ title: "", author: "", year: "" });
    setError("");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            <h1 className="text-3xl font-bold text-gray-800">
              Books Management
            </h1>
          </div>
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Book
          </button>
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
              Start by adding your first book to the collection.
            </p>
            <button
              onClick={() => openModal("add")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-sm text-gray-500">
                      Published: {book.year}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => openModal("view", book)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
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
              ) : (
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {modalType === "add" ? "Add Book" : "Update Book"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
