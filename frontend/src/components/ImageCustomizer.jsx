import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DownloadButton from './DownloadButton';

const ImageCustomizer = () => {
  const { imageId } = useParams();
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  // In a real app, you would fetch image data based on imageId
  const imageUrl = `https://via.placeholder.com/800x450.png?text=Image+${imageId}`;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // To avoid tainted canvas error
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      if (text) {
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      }
    }
  }, [image, text]);

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
