import React, { useEffect, useState } from 'react';
import { getHistory } from '../api/api';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  return (
    <div>
      <h2>Game History</h2>
      <ul>
        {history.map((game, index) => (
          <li key={index}>
            {game.players.player1} vs {game.players.player2} - 
            Game Veridict: {game.winner} (
            {game.players.player1}: {game.scores.player1}, 
            {game.players.player2}: {game.scores.player2})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;