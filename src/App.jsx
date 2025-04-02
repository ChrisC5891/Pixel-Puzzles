import React from 'react';
import Game from './components/Game';
import './App.css'; // We'll add this next

function App() {
  return (
    <div className="app">
      <h1>Pixel Puzzles</h1>
      <Game />
    </div>
  );
}

export default App;