import api from "./api";

// Book API functions for interacting with backend

export const bookApi = {
  // Get paginated books list
  getBooks: async (page = 1, limit = 6) => {
    const response = await api.get(
      `/books/get-books?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get single book by ID (currently unused in frontend)
  getBookById: async (bookId) => {
    const response = await api.get(`/books/get-book/${bookId}`);
    return response.data;
  },

  // Create new book
  createBook: async (bookData) => {
    const response = await api.post("/books/create-book", bookData);
    return response.data;
  },

  // Update existing book
  updateBook: async (bookId, bookData) => {
    const response = await api.put(`/books/update-book/${bookId}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (bookId) => {
    const response = await api.delete(`/books/delete-book/${bookId}`);
    return response.data;
  },

  // Get total books count (optimized for dashboard stats)
  getBooksCount: async () => {
    const response = await api.get("/books/get-books?page=1&limit=1");
    return response.data.pagination?.totalBooks || 0;
  },
};

export default bookApi;
