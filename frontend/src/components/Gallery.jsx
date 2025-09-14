import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user) {
        setLoading(false);
        return; // Don't fetch if not logged in
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/image/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages(res.data);
      } catch (err) {
        console.error("Failed to fetch images:", err);
        setError("Failed to load images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user]); // Re-run when user changes

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Gallery</h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image._id} className="border rounded-lg overflow-hidden">
              <Link to={`/customize/${image._id}`}>
                <img 
                  src={`http://localhost:5000/api/image/file/${image.filename}`}
                  alt={image.filename}
                  className="w-full h-auto object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-bold">{image.filename}</h3>
                <Link to={`/customize/${image._id}`} className="text-blue-500 hover:underline">
                  Customize
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your gallery is empty. Upload some images to get started!</p>
      )}
    </div>
  );
};

export default Gallery;
