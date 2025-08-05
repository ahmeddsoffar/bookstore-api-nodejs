import api from "./api";

// Image API functions for interacting with backend

export const imageApi = {
  // Upload image (admin only)
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all images (admin only)
  getAllImages: async () => {
    const response = await api.get("/image/allimages");
    return response.data;
  },

  // Get single image by ID (admin only)
  getImageById: async (imageId) => {
    const response = await api.get(`/image/singleimage/${imageId}`);
    return response.data;
  },

  // Delete image (admin only)
  deleteImage: async (imageId) => {
    const response = await api.delete(`/image/deleteimage/${imageId}`);
    return response.data;
  },
};

export default imageApi;
