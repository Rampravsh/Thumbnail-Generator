import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ThumbnailGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('Gaming');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [longRequestMessage, setLongRequestMessage] = useState('');
  const { user } = useAuth();

  const longRequestTimer = useRef(null);

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (longRequestTimer.current) {
        clearTimeout(longRequestTimer.current);
      }
    };
  }, []);

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

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error("Please select an image.");
      return;
    }
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }

    const fullPrompt = `YouTube thumbnail for a ${category} video. Instructions: ${prompt}`;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("prompt", fullPrompt);

    setGenerating(true);
    setGeneratedResult(null);
    setLongRequestMessage('');

    if (longRequestTimer.current) {
      clearTimeout(longRequestTimer.current);
    }

    longRequestTimer.current = setTimeout(() => {
      setLongRequestMessage('The server is busy, this may take a moment...');
    }, 8000); // 8 seconds

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        setGenerating(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-with-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Thumbnail idea generated and image saved to gallery!");
      setGeneratedResult(response.data.reply);

    } catch (error) {
      console.error("Thumbnail generation error:", error);
      toast.error(error.response?.data?.message || "Thumbnail generation failed.");
    } finally {
      setGenerating(false);
      if (longRequestTimer.current) {
        clearTimeout(longRequestTimer.current);
      }
      setLongRequestMessage('');
    }
  };

  const categories = ["Gaming", "Vlog", "Tech", "Tutorial", "Music", "Comedy", "Other"];

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="mb-4">
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
          Select Base Image
        </label>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </div>

      {preview && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Image Preview:</p>
          <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">What should be in the thumbnail?</label>
        <textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          placeholder="e.g., 'A shiny red car', 'A person looking surprised'"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!selectedFile || generating}
        className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        {generating ? (longRequestMessage || 'Generating...') : 'Generate Thumbnail'}
      </button>

      {generatedResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Generated Idea:</h3>
          <p>{generatedResult}</p>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGenerator;