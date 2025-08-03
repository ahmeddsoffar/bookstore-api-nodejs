import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Admin from "./pages/Admin";

// Home component for the root path
const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to BookStore API
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern full-stack application built with Node.js, Express,
            MongoDB, and React
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              🔐 Authentication
            </h3>
            <p className="text-gray-600">
              Secure user registration and login with JWT tokens
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              📚 Book Management
            </h3>
            <p className="text-gray-600">
              Full CRUD operations for managing your book collection
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              👥 Role-based Access
            </h3>
            <p className="text-gray-600">
              Different access levels for users and administrators
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              🎨 Modern UI
            </h3>
            <p className="text-gray-600">
              Responsive design with Tailwind CSS and Lucide icons
            </p>
          </div>
        </div>

        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Account
          </a>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Built with ❤️ for learning backend concepts with Node.js</p>
        </div>
      </div>
    </div>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
