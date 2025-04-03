import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #00FF00; }
  50% { box-shadow: 0 0 20px #00FF00; }
  100% { box-shadow: 0 0 5px #00FF00; }
`;

const Container = styled.div`
  background: #000000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginBox = styled.div`
  background: #111;
  border: 2px solid #00FF00;
  border-radius: 10px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  animation: ${glowAnimation} 2s infinite;
`;

const Title = styled.h2`
  color: #00FF00;
  text-align: center;
  font-family: 'Courier New', monospace;
  margin-bottom: 20px;
  text-shadow: 0 0 5px #00FF00;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background: #000;
  border: 1px solid #00FF00;
  color: #00FF00;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px #00FF00;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: #00FF00;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;

  &:hover {
    background: #00CC00;
    box-shadow: 0 0 10px #00FF00;
  }
`;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      const { username: savedUsername, password: savedPassword } = JSON.parse(savedUser);
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username].password === password) {
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      onLogin(username);
    } else if (!users[username]) {
      users[username] = { password, score: 0, playedGames: [] };
      localStorage.setItem('users', JSON.stringify(users));
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
      }
      onLogin(username);
    } else {
      alert('Wrong password!');
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>NEO PUZZLES LOGIN</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label style={{ color: '#00FF00', display: 'block', marginTop: '10px' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {' '}Remember me
        </label>
        <Button onClick={handleLogin}>LOGIN / REGISTER</Button>
      </LoginBox>
    </Container>
  );
};

export default Login;
