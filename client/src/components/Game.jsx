import React, { useState, useReducer } from "react";
import { saveGame } from "../api/api";
const initialState =  {
        player1: { name: '', choice: '', score: 0 },
        player2: { name: '', choice: '', score: 0 },
        round: 0,
        gameOver: false,
        winner: ''
    }
function rpcReducer(playerData, action) {
  switch (action.type) {
    case 'setInput': {
        const {playerKey, field, value} = action.payload
      return {
            ...playerData,
            [playerKey]: {
                ...playerData[playerKey],
                [field]: value,
            },
        }
    }
    case 'roundIncrement': {
      return {
          ...playerData, round : (playerData.round  || 0) + 1
      };
    }
    case 'setWinner': {
        const {gameVeridict} = action.payload
      return {
          ...playerData, winner : gameVeridict
      };
    }
    case 'setGameOver': {
      return {
          ...playerData, gameOver: true
      }
    }
    case 'reset': {
      return initialState
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function Game() {
    const options = ['rock', 'paper', 'scissors'];

    const [playerData, dispatch] = useReducer(rpcReducer, initialState)

    // console.log(playerData)

    const handleInputChange = (playerKey, field, value) => {
        dispatch({type: 'setInput', payload: {playerKey, field, value}});
    };

    const nextRound = () => {
        if (playerData.round >= 5) {
            checkWinner();
            dispatch({type: 'setGameOver'})
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
            dispatch({type: 'setInput', payload: {
                playerKey: 'player1', field: 'score', value: player1.score + 1
            }});

        } else {
            dispatch({type: 'setInput', payload: {
                playerKey: 'player2', field: 'score', value: player2.score + 1
            }});
        }

         dispatch({type: 'setInput', payload: {
                playerKey: 'player1', field: 'choice', value: ''
            }});

        dispatch({type: 'setInput', payload: {
                playerKey: 'player2', field: 'choice', value: ''
            }});



        dispatch({type: 'roundIncrement'})
    }


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

        dispatch({type: 'setWinner', payload: {gameVeridict}})
        

        // Send game data to the server
        const gameDataPayload = {
            player1: player1.name,
            player2: player2.name,
            score1: player1.score,
            score2: player2.score,
            winner: gameVeridict
        }
        // for mongo schema
        // const gameDataPayload = {
        //     players: {
        //         player1: player1.name,
        //         player2: player2.name,
        //     },
        //     scores: {
        //         player1: player1.score,
        //         player2: player2.score,
        //     },
        //     winner: gameVeridict,
        // };
        
        saveGame(gameDataPayload)
            .then(response => {
                console.log('Game saved successfully:', response);
            })
            .catch(error => {
                console.error('Error saving game:', error);
            });


    };
    

    if (playerData.gameOver) {
        return (
        <div>
            <h1>{playerData.winner}</h1>
            <button onClick={() => dispatch({ type: 'reset' })}>Play Again</button>
        </div>
        );
    }

    return (
        <div>
            <h1>Current round no: {playerData.round + 1}</h1>
            {Object.keys(playerData).filter(item => item.includes('player')).map((playerKey) => (
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
            {playerData['player1'].choice && playerData['player2'].choice && !playerData.gameOver ? (
                <button onClick={nextRound}>Next Round</button>
            ) : null}
        </div>
    );
}
