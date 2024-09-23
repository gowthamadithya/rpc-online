import React, { useState } from "react";
import { saveGame } from "../api/api";

export default function Game() {
    const options = ['rock', 'paper', 'scissors'];
    const [playerData, setPlayerData] = useState({
        player1: { name: '', choice: '', score: 0 },
        player2: { name: '', choice: '', score: 0 },
    });
    const [round, setRound] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');

    const handleInputChange = (playerKey, field, value) => {
        setPlayerData(prevState => ({
            ...prevState,
            [playerKey]: {
                ...prevState[playerKey],
                [field]: value,
            },
        }));
    };

    const nextRound = () => {
        if (round >= 5) {
            setGameOver(true);
            checkWinner();
            return;
        }

        const { player1, player2 } = playerData;

        if (!player1.name || !player2.name) {
            alert('Player names are required')
            return
        }

        if (player1.choice === player2.choice) {
        } else if (
            (player1.choice === 'rock' && player2.choice === 'scissors') ||
            (player1.choice === 'paper' && player2.choice === 'rock') ||
            (player1.choice === 'scissors' && player2.choice === 'paper')
        ) {
            player1.score += 1;
        } else {
            player2.score += 1;
        }

        setPlayerData(prevState => ({
            ...prevState,
            player1: { ...prevState.player1, choice: '' },
            player2: { ...prevState.player2, choice: '' },
        }));

        setRound(prevRound => prevRound + 1);
    };

    const checkWinner = () => {
        const { player1, player2 } = playerData;
        let gameVeridict;
        if (player1.score > player2.score) {
            gameVeridict =`${player1.name || 'Player 1'} wins`;
        } else if (player1.score < player2.score) {
            gameVeridict = `${player2.name || 'Player 2'} wins`;
        } else {
            gameVeridict = "Tie";
        }

        setWinner(gameVeridict)

        // Send game data to the server
        const gameDataPayload = {
            players: {
                player1: player1.name,
                player2: player2.name,
            },
            scores: {
                player1: player1.score,
                player2: player2.score,
            },
            winner: gameVeridict,
        };

        saveGame(gameDataPayload)
            .then(response => {
                console.log('Game saved successfully:', response);
            })
            .catch(error => {
                console.error('Error saving game:', error);
            });
    };
    

    if (gameOver) {
        return (
            <h1>{winner}</h1>
        );
    }

    return (
        <div>
            <h1>Current round no: {round + 1}</h1>
            {Object.keys(playerData).map((playerKey) => (
                <div key={playerKey}>
                    <h4>{playerData[playerKey].name || playerKey}</h4>
                    <input
                        type="text"
                        placeholder={`Enter name for ${playerKey}`}
                        required
                        onChange={(e) => handleInputChange(playerKey, 'name', e.target.value)}
                    />
                    <ul style={{ display: 'flex', listStyleType: 'none', padding: '0' }}>
                        {options.map((option) => (
                            <li key={option} style={{ marginRight: '10px' }}>
                                <button onClick={() => handleInputChange(playerKey, 'choice', option)}>
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p>Choice: {playerData[playerKey].choice || 'None'}</p>
                    <p>Score: {playerData[playerKey].score}</p>
                </div>
            ))}
            {playerData['player1'].choice && playerData['player2'].choice && !gameOver ? (
                <button onClick={nextRound}>Next Round</button>
            ) : null}
        </div>
    );
}
