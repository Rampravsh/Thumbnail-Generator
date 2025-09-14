import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [images, setImages] = useState([]);

  // In a real app, you would fetch this data from your backend API
  useEffect(() => {
    const mockImages = [
      { id: '1', url: 'https://via.placeholder.com/300x200.png?text=Image+1', name: 'Image 1' },
      { id: '2', url: 'https://via.placeholder.com/300x200.png?text=Image+2', name: 'Image 2' },
      { id: '3', url: 'https://via.placeholder.com/300x200.png?text=Image+3', name: 'Image 3' },
      { id: '4', url: 'https://via.placeholder.com/300x200.png?text=Image+4', name: 'Image 4' },
      { id: '5', url: 'https://via.placeholder.com/300x200.png?text=Image+5', name: 'Image 5' },
      { id: '6', url: 'https://via.placeholder.com/300x200.png?text=Image+6', name: 'Image 6' },
    ];
    setImages(mockImages);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Gallery</h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <div key={image.id} className="border rounded-lg overflow-hidden">
              <Link to={`/customize/${image.id}`}>
                <img src={image.url} alt={image.name} className="w-full h-auto object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="font-bold">{image.name}</h3>
                <Link to={`/customize/${image.id}`} className="text-blue-500 hover:underline">
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
