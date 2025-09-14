import React from 'react';

const DownloadButton = ({ imageUrl, filename }) => {
  const handleDownload = () => {
    if (!imageUrl) {
      console.error('Image URL is not provided.');
      return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!imageUrl}
      style={{
        padding: '10px 20px',
        backgroundColor: imageUrl ? '#4CAF50' : '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: imageUrl ? 'pointer' : 'not-allowed',
      }}
    >
      Download Image
    </button>
  );
};

export default DownloadButton;
