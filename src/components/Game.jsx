import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PixelPuzzles from '../game';

const Game = () => {
  const [game] = useState(() => new PixelPuzzles('fbfeecab345045f6983d196037b4c977')); // Replace with your key
  const [currentImage, setCurrentImage] = useState('');
  const [guessesLeft, setGuessesLeft] = useState(5);
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [options, setOptions] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const start = async () => {
      const { image, guessesLeft } = await game.startGame();
      setCurrentImage(image);
      setGuessesLeft(guessesLeft);
      setOptions(game.allGames.map(name => ({ value: name, label: name })));
    };
    start();
  }, [game]);

  const handleGuess = (selectedOption) => {
    if (!selectedOption || gameOver) return;

    const guess = selectedOption.value;
    const result = game.guess(guess);

    setCurrentImage(result.image || currentImage);
    setGuessesLeft(result.guessesLeft !== undefined ? result.guessesLeft : 0);
    setMessage(result.message);
    setBackgroundColor(result.background || 'white');
    setGameOver(result.gameOver || false);
  };

  const resetGame = async () => {
    const { image, guessesLeft } = await game.startGame();
    setCurrentImage(image);
    setGuessesLeft(guessesLeft);
    setMessage('');
    setBackgroundColor('white');
    setGameOver(false);
    setOptions(game.allGames.map(name => ({ value: name, label: name })));
  };

  useEffect(() => {
    const start = async () => {
      try {
        const { image, guessesLeft } = await game.startGame();
        setCurrentImage(image);
        setGuessesLeft(guessesLeft);
        setOptions(game.allGames.map(name => ({ value: name, label: name })));
        setMessage('');
      } catch (error) {
        console.error('Game start failed:', error);
        setMessage(`Error: ${error.message}`);
      }
    };
    start();
  }, [game]);
  
  return (
    <div style={{ backgroundColor, padding: '20px', minHeight: '400px' }}>
      <img src={currentImage} alt="Game screenshot" style={{ maxWidth: '100%', height: 'auto' }} />
      <p>{message}</p>
      <p>Guesses left: {guessesLeft}</p>
      <Select
        options={options}
        onChange={handleGuess}
        isDisabled={gameOver}
        placeholder="Type your guess..."
      />
      {gameOver && <button onClick={resetGame}>Play Again</button>}
    </div>
  );
  
};

export default Game;

