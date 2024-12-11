import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';// Import Bootstrap

const ENDPOINT = 'http://localhost:3000';

function Chat({ username, room }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(ENDPOINT);

    socketRef.current.emit('join', { username, room });

    socketRef.current.on('message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socketRef.current.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username, room]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socketRef.current.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header bg-success text-white p-3">
        <h2>Room: {room}</h2>
      </div>
      <div className="chat-messages p-3" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user === username ? 'sent' : 'received'}`}>
            <p className="m-0">
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input p-3 d-flex align-items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="form-control"
          style={{ borderRadius: '30px', marginRight: '10px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '30px' }}>
          Send
        </button>
      </form>
      <div className="user-list p-3 bg-light">
        <h3>Users in Room:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Chat;
