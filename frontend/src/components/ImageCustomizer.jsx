import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DownloadButton from './DownloadButton';
import { useAuth } from '../context/AuthContext';

const ImageCustomizer = () => {
  const { imageId } = useParams();
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/image/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const imageUrl = `http://localhost:5000/api/image/file/${res.data.filename}`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        img.onload = () => {
          setOriginalImage(img);
        };
      } catch (err) {
        console.error('Failed to fetch image:', err);
      }
    };

    fetchImage();
  }, [imageId, user]);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);

      if (text) {
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }
    }
  }, [originalImage, text]);

  const getCanvasDataUrl = () => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL('image/png');
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customize Image</h2>
      <div className="mb-4">
        <canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Add Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <DownloadButton imageUrl={getCanvasDataUrl()} filename={`custom-image-${imageId}.png`} />
    </div>
  );
};

export default ImageCustomizer;
