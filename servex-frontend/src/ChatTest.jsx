import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatTest = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    // Cleanup on unmount
    return () => {
      if (socket) socket.off('receive_message');
    };
  }, [socket]);

  const connectSocket = () => {
    if (!token || !bookingId) return alert("Please enter both Token and Booking ID");

    // Connect to your Express/Socket.io backend
    const newSocket = io('http://localhost:5000', {
      auth: { token } // Passes the Firebase token to our backend middleware
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join_project', bookingId); // Join the specific project room
    });

    newSocket.on('connect_error', (err) => {
      console.error("Connection failed:", err.message);
      alert("Connection failed! Check console and token.");
    });

    setSocket(newSocket);
  };

  const sendMessage = () => {
    if (socket && input.trim()) {
      const messageData = {
        bookingId,
        text: input,
        fileUrl: null
      };
      
      socket.emit('send_message', messageData);
      setInput('');
    }
  };

  return (
    <div className="p-8 max-w-md w-full mx-auto bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center tracking-wide">ServeX Live Chat</h2>
      
      {!isConnected ? (
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Paste Firebase ID Token..." 
            value={token} 
            onChange={(e) => setToken(e.target.value)}
            className="p-3 rounded-lg bg-white/50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <input 
            type="text" 
            placeholder="Paste Booking ID..." 
            value={bookingId} 
            onChange={(e) => setBookingId(e.target.value)}
            className="p-3 rounded-lg bg-white/50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button 
            onClick={connectSocket}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors shadow-md mt-2"
          >
            Secure Connect
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="h-72 overflow-y-auto bg-white/50 p-4 rounded-xl border border-white/40 shadow-inner flex flex-col gap-2">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center text-sm mt-auto mb-auto">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="bg-white/70 p-3 rounded-lg shadow-sm border border-white/50 w-fit max-w-[85%]">
                  <span className="font-semibold text-xs text-blue-600 block mb-1">{msg.senderEmail}</span>
                  <span className="text-gray-800 text-sm">{msg.text}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-3 rounded-lg bg-white/60 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Type your message..."
            />
            <button 
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-3 rounded-lg transition-colors shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTest;