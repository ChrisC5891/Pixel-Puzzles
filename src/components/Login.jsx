import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
      onLogin(username);
    } else if (!users[username]) {
      users[username] = { password, score: 0, playedGames: [] };
      localStorage.setItem('users', JSON.stringify(users));
      onLogin(username);
    } else {
      alert('Wrong password!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login / Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;