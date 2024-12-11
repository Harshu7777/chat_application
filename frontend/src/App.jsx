import React, { useState } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleLogin = (user, selectedRoom) => {
    setUsername(user);
    setRoom(selectedRoom);
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} room={room} />
      )}
    </div>
  );
}

export default App;