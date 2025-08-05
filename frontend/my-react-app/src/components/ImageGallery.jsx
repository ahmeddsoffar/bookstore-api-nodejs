import React, { useState, useEffect } from "react";
import { imageApi } from "../api/imageApi";
import { Search, Image as ImageIcon, Eye, X, AlertCircle } from "lucide-react";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    // Filter images based on search term
    if (searchTerm.trim() === "") {
      setFilteredImages(images);
    } else {
      // Since we don't have book titles in the image model yet,
      // we'll search by image ID and upload date for now
      const filtered = images.filter(
        (image) =>
          image._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          new Date(image.createdAt).toLocaleDateString().includes(searchTerm)
      );
      setFilteredImages(filtered);
    }
  }, [images, searchTerm]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError("");

      // Note: This will currently fail for non-admin users
      // The backend needs to be modified to allow users to view images
      const response = await imageApi.getAllImages();
      setImages(response.images || []);
    } catch (error) {
      if (error.response?.status === 403) {
        setError(
          "You need admin access to view images. Please ask your administrator to modify the backend to allow user access to image viewing."
        );
      } else {
        setError("Failed to fetch images");
      }
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ImageIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Image Gallery</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Access Restricted</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images by ID or date..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                  Found {filteredImages.length} image
                  {filteredImages.length !== 1 ? "s" : ""}
                  matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Images Grid */}
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? "No images found" : "No images available"}
                </h2>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No images have been uploaded to the gallery yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt="Gallery image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => openPreview(image)}
                      />
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </div>

                        <button
                          onClick={() => openPreview(image)}
                          className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                          title="View full size"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
