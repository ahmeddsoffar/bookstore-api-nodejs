import axios from "axios";

// Create axios instance with base URL (use Vite proxy in dev)
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post("/auth/change-password", passwordData);
    return {
      success: true,
      message: response.data.message || "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to change password",
    };
  }
};

export const changeUsername = async (usernameData) => {
  try {
    const response = await api.post("/auth/change-username", usernameData);
    return {
      success: true,
      message: response.data.message || "Username changed successfully",
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to change username",
    };
  }
};

export default api;
