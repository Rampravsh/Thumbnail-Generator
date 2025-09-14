import React, { useState } from 'react';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
      // Here you would typically send the message to a backend
      // and receive a response. For this example, we'll just
      // simulate a bot response.
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: 'This is a bot response.', sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: message.sender === 'user' ? '#dcf8c6' : '#fff',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '8px',
            maxWidth: '70%',
            wordWrap: 'break-word'
          }}>
            {message.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{ flex: 1, border: '1px solid #ccc', borderRadius: '20px', padding: '8px 12px', marginRight: '10px' }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} style={{ border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '20px', padding: '8px 15px', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
