import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { nanoid } from 'nanoid';

const App = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socketRef = useRef();
  const clientId = useRef(nanoid());

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('new_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      id: clientId.current,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socketRef.current.emit('send_message', msgData);
    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Chat App</h2>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          Send
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h4>Messages:</h4>
        <ul>
          {chat.map((msg, index) => (
            <li key={index}>
              <strong>{msg.id.slice(0, 5)}</strong>: {msg.text} <em>({msg.time})</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
