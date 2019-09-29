import React, { useState } from 'react';
import Board from './components/Board';

//styles
import './App.css';

const Game = () => {
  const [squareValues, setSquareValues] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameDone, setIsGameDone] = useState(false);
  const [winner, setWinner] = useState(null)

  const handleClick = (squarePosition) => {
    if (winner === null) {
      const newSquareValues = [...squareValues];

      newSquareValues[squarePosition] = xIsNext ? "X" : "O";
      setSquareValues(newSquareValues);

      setXIsNext(!xIsNext);
      isGameWon(newSquareValues);
      isGameDrawn(newSquareValues);
    }
  };

  const isGameWon = (newSquareValues) => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (
        newSquareValues[a] === newSquareValues[b]
        && newSquareValues[b] === newSquareValues[c]
        && newSquareValues[a] !== null
        && newSquareValues[b] !== null
        && newSquareValues[c] !== null
      ) {
        newSquareValues[a] === 'X' ? setWinner('X') : setWinner('O');
      }
    }
  };

  const isGameDrawn = (newSquareValues) => {
    const nullSquares = newSquareValues.filter(square => square === null);

    (nullSquares.length === 0 && winner === null)
      && setIsGameDone(true);
  };

  return (
    <div className="game">
      <div className="game-status">
        {
          winner && `${winner} wins`
        }
        {
          isGameDone && !winner && `Draw`
        }
      </div>
      <div className="game-board">
        <Board
          squares={squareValues}
          onClick={handleClick}
        />
      </div>
      {
        !winner && (
          <div className="game-info">
            <div>
              {
                xIsNext ? "X's turn" : "O's turn"
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Game;
