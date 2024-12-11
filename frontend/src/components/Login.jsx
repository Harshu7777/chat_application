import React, { useState } from 'react';// Import Bootstrap styles

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) {
      onLogin(username, room);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Join a Chat Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
