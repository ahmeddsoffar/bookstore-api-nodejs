import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Book, Home, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Book className="h-6 w-6" />
            BookStore API
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${
                    isActive("/dashboard") ? "bg-blue-700" : "hover:bg-blue-500"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/books"
                  className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${
                    isActive("/books") ? "bg-blue-700" : "hover:bg-blue-500"
                  }`}
                >
                  <Book className="h-4 w-4" />
                  Books
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1 px-3 py-2 rounded transition-colors ${
                      isActive("/admin") ? "bg-blue-700" : "hover:bg-blue-500"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm">
                    Hello,{" "}
                    <span className="font-semibold">{user?.username}</span>
                    {isAdmin && (
                      <span className="text-yellow-300 ml-1">(Admin)</span>
                    )}
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive("/login") ? "bg-blue-700" : "hover:bg-blue-500"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 bg-green-500 hover:bg-green-600 rounded transition-colors ${
                    isActive("/register") ? "bg-green-700" : ""
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
