import React, { useState, useEffect } from "react";
import { imageApi } from "../api/imageApi";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const AdminImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await imageApi.getAllImages();
      setImages(response.images || []);
    } catch (error) {
      setError("Failed to fetch images");
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const response = await imageApi.uploadImage(file);
      setSuccess("Image uploaded successfully!");
      fetchImages(); // Refresh the image list

      // Clear the file input
      event.target.value = "";

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setError("");
      await imageApi.deleteImage(imageId);
      setSuccess("Image deleted successfully!");
      fetchImages(); // Refresh the image list

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete image");
      console.error("Delete error:", error);
    }
  };

  const openPreview = (image) => {
    setSelectedImage(image);
    setShowPreview(true);
  };

  const closePreview = () => {
    setSelectedImage(null);
    setShowPreview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Image Management</h2>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload New Image
          </h3>
          <p className="text-gray-500 mb-4">
            Select an image file to upload (Max 5MB, JPG/PNG/GIF)
          </p>

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Choose File"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Images Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Uploaded Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image._id}
                className="bg-gray-50 rounded-lg p-3 border hover:shadow-md transition-shadow"
              >
                <div className="aspect-square mb-3 overflow-hidden rounded">
                  <img
                    src={image.imageUrl}
                    alt="Uploaded image"
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => openPreview(image)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => openPreview(image)}
                      className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                      title="View full size"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>

                    <button
                      onClick={() => handleDeleteImage(image._id)}
                      className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showPreview && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              <img
                src={selectedImage.imageUrl}
                alt="Full size preview"
                className="max-w-full h-auto rounded"
              />

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Upload Date:</strong>{" "}
                  {new Date(selectedImage.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Image ID:</strong> {selectedImage._id}
                </div>
                <div>
                  <strong>URL:</strong>{" "}
                  <a
                    href={selectedImage.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedImage.imageUrl}
                  </a>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleDeleteImage(selectedImage._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImageManager;
