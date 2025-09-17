import React, { useState, useEffect, useRef } from 'react';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '' && !isLoading) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const currentInputValue = inputValue;
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentInputValue }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from the server.');
        }

        const data = await response.json();
        const botMessage = { text: data.reply, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex-1 overflow-y-auto mb-4 pr-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex items-end mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">B</div>
            )}
            <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${message.sender === 'user' ? 'bg-green-200' : 'bg-white border border-gray-200'}`}>
              <p className="text-sm text-gray-800">{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold ml-3">U</div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">B</div>
            <div className="p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-sm text-gray-500">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          className="bg-blue-500 text-white rounded-full py-2 px-6 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatUI;