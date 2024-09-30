import React, { useEffect, useState } from 'react';
import { getHistory } from '../api/api';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then(setHistory);
    console.log(history)
  }, []);

  return (
    <div>
      <h2>Game History</h2>
      <ul>
        {history.map((game, index) => (
          <li key={index}>
            {game.player1} vs {game.player2} - 
            Game Veridict: {game.winner} (
            {game.player1}: {game.score1}, 
            {game.player2}: {game.score2})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;