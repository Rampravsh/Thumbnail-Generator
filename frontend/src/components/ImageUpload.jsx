import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setUploading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      // Optionally, you can redirect or update the gallery
    } catch (error) {
      console.error("Image upload error details:", error);
      toast.error(error.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Select Image
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default ImageUpload;
