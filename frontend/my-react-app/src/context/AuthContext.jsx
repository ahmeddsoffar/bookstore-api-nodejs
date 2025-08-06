import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { accessToken, user } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    console.log("🚀 Frontend: Attempting registration with data:", userData);
    try {
      console.log("📡 Frontend: Making API call to /auth/register");
      const response = await api.post("/auth/register", userData);
      console.log("✅ Frontend: Registration successful", response.data);
      return {
        success: true,
        message:
          response.data.message || "Registration successful! Please login.",
      };
    } catch (error) {
      console.log("❌ Frontend: Registration failed", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
