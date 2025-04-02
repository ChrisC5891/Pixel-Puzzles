import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styled, { keyframes } from 'styled-components';
import PixelPuzzles from '../game';
import Login from './Login';

// Animations
const glow = keyframes`
  0% { box-shadow: 0 0 5px #00FF00; }
  50% { box-shadow: 0 0 20px #00FF00, 0 0 30px #00FF00; }
  100% { box-shadow: 0 0 5px #00FF00; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

// Styled Components
const Container = styled.div`
  background: #000000;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1s ease-in;
  font-size: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px; /* Wider header */
  padding: 15px 20px;
  background: linear-gradient(90deg, #00FF00, #000000); /* Green-to-black gradient */
  border-bottom: 3px solid #00FF00;
  box-shadow: 0 0 15px #00FF00;
  margin-bottom: 30px;
`;

const Title = styled.h1` /* Changed to h1 for prominence */
  color: #00FF00;
  font-family: 'Courier New', monospace;
  font-size: 2.5rem; /* Bigger and bolder */
  font-weight: bold;
  text-shadow: 0 0 10px #00FF00, 0 0 20px #00FF00;
  margin: 0;
  animation: ${glitch} 2s infinite alternate; /* Glitch effect */
  letter-spacing: 2px; /* Spacing for futuristic feel */
`;

const Button = styled.button`
  background: #00FF00;
  color: #000000;
  border: 2px solid #00FF00;
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px #00FF00;
  }
  &:focus {
    outline: 3px solid #00FF00;
    outline-offset: 2px;
  }
  &:disabled {
    background: #666;
    border-color: #666;
    cursor: not-allowed;
  }
`;

const GameArea = styled.div`
  background: ${props => props.background || '#111'};
  border: 2px solid #00FF00;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  animation: ${glow} 2s infinite;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border: 1px solid #00FF00;
  border-radius: 5px;
`;

const Message = styled.p`
  color: #000000;
  font-family: 'Courier New', monospace;
  text-align: center;
  margin: 10px 0;
  font-size: 1.25rem;
  text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 3px;
`;

const Guesses = styled.p`
  color: #000000;
  font-family: 'Courier New', monospace;
  margin: 10px 0;
  font-size: 1.25rem;
  text-shadow: 0 0 5px #00FF00, 0 0 10px #00FF00;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 3px;
`;

const customSelectStyles = {
  control: (base) => ({
    ...base,
    background: '#000',
    borderColor: '#00FF00',
    color: '#00FF00',
    boxShadow: 'none',
    fontSize: '1rem',
    padding: '5px',
    '&:hover': { borderColor: '#00FF00' },
    '&:focus': { borderColor: '#00FF00', boxShadow: '0 0 0 2px #00FF00' }
  }),
  input: (base) => ({
    ...base,
    color: '#00FF00'
  }),
  menu: (base) => ({
    ...base,
    background: '#000',
    border: '1px solid #00FF00',
    zIndex: 999
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    background: isSelected ? '#00FF00' : isFocused ? '#00FF00' : '#000',
    color: isSelected || isFocused ? '#000' : '#00FF00',
    fontSize: '1rem',
    '&:hover': { background: '#00FF00', color: '#000' }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#00FF00'
  })
};

const Game = () => {
  const [game] = useState(() => new PixelPuzzles(import.meta.env.VITE_RAWG_API_KEY));
  const [currentImage, setCurrentImage] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(5);
  const [message, setMessage] = useState('Loading...');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [options, setOptions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userData = users[user] || { score: 0, playedGames: [] };
      if (!users[user]) {
        users[user] = userData;
        localStorage.setItem('users', JSON.stringify(users));
      }
      const start = async () => {
        try {
          const { image, guessesLeft } = await game.startGame(userData.playedGames);
          setCurrentImage(image);
          setGuessesLeft(guessesLeft);
          setOptions(game.allGames.map(name => ({ value: name, label: name })));
          setMessage('');
          setScore(userData.score);
        } catch (error) {
          setMessage(`Error: ${error.message}`);
        }
      };
      start();
    }
  }, [user, game]);

  const handleGuess = (selectedOption) => {
    if (!selectedOption || gameOver) return;
    const guess = selectedOption.value;
    const result = game.guess(guess);
    setCurrentImage(result.image || currentImage);
    setGuessesLeft(result.guessesLeft !== undefined ? result.guessesLeft : 0);
    setMessage(result.message);
    setBackgroundColor(result.background || 'white');
    setGameOver(result.gameOver || false);
    if (result.score > 0) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[user].score += result.score;
      users[user].playedGames = game.getPlayedGames();
      localStorage.setItem('users', JSON.stringify(users));
      setScore(users[user].score);
    }
  };

  const resetGame = async () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const { image, guessesLeft } = await game.startGame(users[user].playedGames);
      setCurrentImage(image);
      setGuessesLeft(guessesLeft);
      setMessage('');
      setBackgroundColor('white');
      setGameOver(false);
      setOptions(game.allGames.map(name => ({ value: name, label: name })));
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScore(0);
    setCurrentImage('');
    setGuessesLeft(5);
    setMessage('Loading...');
    setBackgroundColor('white');
    setGameOver(false);
    setOptions([]);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Container role="main" aria-label="Neo Puzzle Game">
      <Header>
        <Title>Neo Puzzle: {user} | Score: {score}</Title>
        <Button onClick={handleLogout} aria-label="Logout">Logout</Button>
      </Header>
      <GameArea background={backgroundColor} role="region" aria-label="Game Area">
        <Image src={currentImage} alt="Game screenshot" />
        <Message aria-live="polite">{message}</Message>
        <Guesses>Guesses left: {guessesLeft}</Guesses>
        <Select
          options={options}
          onChange={handleGuess}
          isDisabled={gameOver}
          placeholder="Type your guess..."
          styles={customSelectStyles}
          aria-label="Guess the game"
        />
        {gameOver && <Button onClick={resetGame} aria-label="Play Again">Play Again</Button>}
      </GameArea>
    </Container>
  );
};

export default Game;