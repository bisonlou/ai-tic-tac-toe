import React from 'react';
import Square from './Square';

const Board = ({ squares, onClick }) => {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onClick(i)}
    />
  );

  return (
    <div>
      <div className="board-row">
        {
          [0, 1, 2].map(squareNumber => (
            renderSquare(squareNumber)
          ))
        }
      </div>
      <div className="board-row">
        {
          [3, 4, 5].map(squareNumber => (
            renderSquare(squareNumber)
          ))
        }
      </div>
      <div className="board-row">
        {
          [6, 7, 8].map(squareNumber => (
            renderSquare(squareNumber)
          ))
        }
      </div>
    </div>
  );
};

export default Board;
