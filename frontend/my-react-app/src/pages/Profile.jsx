import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword, changeUsername } from "../api/api";
import {
  User,
  Key,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [usernameData, setUsernameData] = useState({
    newUsername: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState({
    password: false,
    username: false,
  });
  const [message, setMessage] = useState({
    password: "",
    username: "",
  });
  const [messageType, setMessageType] = useState({
    password: "",
    username: "",
  }); // "success" or "error"

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    // Clear message when user starts typing
    if (message.password) {
      setMessage({ ...message, password: "" });
      setMessageType({ ...messageType, password: "" });
    }
  };

  const handleUsernameInputChange = (e) => {
    setUsernameData({
      ...usernameData,
      [e.target.name]: e.target.value,
    });
    // Clear message when user starts typing
    if (message.username) {
      setMessage({ ...message, username: "" });
      setMessageType({ ...messageType, username: "" });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ ...message, password: "" });
    setMessageType({ ...messageType, password: "" });

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ ...message, password: "New passwords don't match" });
      setMessageType({ ...messageType, password: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        ...message,
        password: "New password must be at least 6 characters long",
      });
      setMessageType({ ...messageType, password: "error" });
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setMessage({
        ...message,
        password: "New password must be different from old password",
      });
      setMessageType({ ...messageType, password: "error" });
      return;
    }

    setLoading({ ...loading, password: true });

    try {
      const result = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setMessage({ ...message, password: result.message });
        setMessageType({ ...messageType, password: "success" });
        // Reset form
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({ ...message, password: result.message });
        setMessageType({ ...messageType, password: "error" });
      }
    } catch (error) {
      setMessage({ ...message, password: "An unexpected error occurred" });
      setMessageType({ ...messageType, password: "error" });
    }

    setLoading({ ...loading, password: false });
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setMessage({ ...message, username: "" });
    setMessageType({ ...messageType, username: "" });

    // Validate username
    if (!usernameData.newUsername.trim()) {
      setMessage({ ...message, username: "Username is required" });
      setMessageType({ ...messageType, username: "error" });
      return;
    }

    if (usernameData.newUsername.trim().length < 3) {
      setMessage({
        ...message,
        username: "Username must be at least 3 characters long",
      });
      setMessageType({ ...messageType, username: "error" });
      return;
    }

    if (usernameData.newUsername.trim() === user?.username) {
      setMessage({
        ...message,
        username: "New username must be different from current username",
      });
      setMessageType({ ...messageType, username: "error" });
      return;
    }

    setLoading({ ...loading, username: true });

    try {
      const result = await changeUsername({
        newUsername: usernameData.newUsername.trim(),
      });

      if (result.success) {
        setMessage({ ...message, username: result.message });
        setMessageType({ ...messageType, username: "success" });
        // Update the user data in context and localStorage
        updateUser(result.user);
        // Reset form
        setUsernameData({
          newUsername: "",
        });
      } else {
        setMessage({ ...message, username: result.message });
        setMessageType({ ...messageType, username: "error" });
      }
    } catch (error) {
      setMessage({ ...message, username: "An unexpected error occurred" });
      setMessageType({ ...messageType, username: "error" });
    }

    setLoading({ ...loading, username: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
              <p className="text-gray-600">
                Manage your account information and settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Account Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 font-semibold">
                    {user?.username}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 font-semibold">
                    {user?.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  User ID
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-900 font-mono text-sm">
                    {user?.id}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Role
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 font-semibold capitalize">
                    {user?.role}
                  </span>
                  {user?.role === "admin" && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Admin Access
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Change Username */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Change Username
            </h2>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              {message.username && (
                <div
                  className={`p-4 rounded-md flex items-center gap-2 ${
                    messageType.username === "success"
                      ? "bg-green-100 border border-green-400 text-green-700"
                      : "bg-red-100 border border-red-400 text-red-700"
                  }`}
                >
                  {messageType.username === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  {message.username}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Username
                </label>
                <div className="p-3 bg-gray-100 rounded-md text-gray-600">
                  {user?.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Username
                </label>
                <input
                  type="text"
                  name="newUsername"
                  value={usernameData.newUsername}
                  onChange={handleUsernameInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your new username"
                />
              </div>

              {/* Username Requirements */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600 mb-2">
                  Username requirements:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 3 characters long</li>
                  <li>• Must be unique (not taken by another user)</li>
                  <li>• Different from your current username</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading.username}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="h-4 w-4" />
                {loading.username ? "Changing Username..." : "Change Username"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {message.password && (
                <div
                  className={`p-4 rounded-md flex items-center gap-2 ${
                    messageType.password === "success"
                      ? "bg-green-100 border border-green-400 text-green-700"
                      : "bg-red-100 border border-red-400 text-red-700"
                  }`}
                >
                  {messageType.password === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  {message.password}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.oldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("oldPassword")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.oldPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600 mb-2">
                  Password requirements:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Different from your current password</li>
                  <li>• Both new password fields must match</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading.password}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Key className="h-4 w-4" />
                {loading.password ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
