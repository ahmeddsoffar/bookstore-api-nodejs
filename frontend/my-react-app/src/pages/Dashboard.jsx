import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookApi } from "../api/bookApi";
import { Home, Book, Users, Activity } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [stats, setStats] = useState({
    totalBooks: 0,
    loading: true,
  });

  useEffect(() => {
    fetchWelcomeMessage();
    fetchStats();
  }, []);

  const fetchWelcomeMessage = async () => {
    try {
      const response = await api.get("/home/welcome");
      setWelcomeMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching welcome message:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const totalBooks = await bookApi.getBooksCount();
      setStats({
        totalBooks: totalBooks,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({ totalBooks: 0, loading: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {welcomeMessage || `Welcome, ${user?.username}!`}
              </h1>
              <p className="text-gray-600">
                Role:{" "}
                <span className="font-semibold capitalize">{user?.role}</span>
                {user?.role === "admin" && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Admin Access
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.loading ? "..." : stats.totalBooks}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Book className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Role</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {user?.role}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/books"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Book className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">Manage Books</h3>
                <p className="text-sm text-gray-600">
                  View, add, edit, and delete books
                </p>
              </div>
            </a>

            {user?.role === "admin" && (
              <a
                href="/admin"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-800">Admin Panel</h3>
                  <p className="text-sm text-gray-600">
                    Access admin-only features
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Account Information
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
                User ID
              </label>
              <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Role
              </label>
              <p className="text-gray-900 font-semibold capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
