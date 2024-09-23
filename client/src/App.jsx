// src/App.js
import React, { useState } from 'react';
import Game from './components/Game';
import History from './components/History';

function App() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div >
      <h1>Rock Paper Scissors</h1>
      <button onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? 'Play Game' : 'View History'}
      </button>
      {showHistory ? <History /> : <Game />}
    </div>
  );
}

export default App;