import api from "./api";

export const categoryApi = {
  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data.categories || [];
  },
  createCategory: async (data) => {
    const res = await api.post("/categories", data);
    return res.data.category;
  },
  updateCategory: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.category;
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

export default categoryApi;
