import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import {
  Shield,
  Users,
  Activity,
  Database,
  Image as ImageIcon,
} from "lucide-react";
import AdminImageManager from "../components/AdminImageManager";

const Admin = () => {
  const { user } = useAuth();
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/welcome");
      setAdminMessage(response.data.message);
    } catch (error) {
      setError("Failed to fetch admin data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-purple-100">
                Welcome, <span className="font-semibold">{user?.username}</span>
                ! You have administrator privileges.
              </p>
              {adminMessage && (
                <p className="text-purple-100 mt-2 italic">"{adminMessage}"</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Level</p>
                <p className="text-2xl font-bold text-purple-600">
                  Super Admin
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Access Level
                </p>
                <p className="text-2xl font-bold text-green-600">Full Access</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Status
                </p>
                <p className="text-2xl font-bold text-blue-600">Online</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              System Management
            </h2>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800">Database Status</h3>
                <p className="text-sm text-gray-600">
                  MongoDB connection is active and healthy
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800">API Status</h3>
                <p className="text-sm text-gray-600">
                  All endpoints are responding normally
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Privileges */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Admin Privileges
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Book Management
                </span>
                <span className="text-green-600 font-semibold">
                  Full Access
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  User Management
                </span>
                <span className="text-green-600 font-semibold">
                  Full Access
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  System Settings
                </span>
                <span className="text-green-600 font-semibold">
                  Full Access
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Analytics
                </span>
                <span className="text-green-600 font-semibold">
                  Full Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Admin Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/books"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">Manage Books</h3>
                <p className="text-sm text-gray-600">Full CRUD operations</p>
              </div>
            </a>

            <div className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg opacity-50">
              <Users className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-500">User Management</h3>
                <p className="text-sm text-gray-400">Coming soon</p>
              </div>
            </div>

            <div className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
              <ImageIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Image Management
                </h3>
                <p className="text-sm text-gray-600">
                  Upload and manage images
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Current Admin Session
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <p className="text-gray-900 font-semibold">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <p className="text-purple-600 font-semibold uppercase">
                {user?.role}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Session Status
              </label>
              <p className="text-green-600 font-semibold">Active</p>
            </div>
          </div>
        </div>

        {/* Image Management Section */}
        <div className="mt-8">
          <AdminImageManager />
        </div>
      </div>
    </div>
  );
};

export default Admin;
