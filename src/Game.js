import React, { Component } from 'react';
import Board from './components/Board';

//styles
import './App.css';

class Game extends Component {
  state = {
    squareValues: Array(9).fill(null),
    isGameDone: false,
    winner: null,
    huPlayer: 'O',
    aiPlayer: 'X',
    nextPlayer: 'O',
  };

  handleClick = (position) => {
    const { squareValues, huPlayer, winner } = this.state;

    if (squareValues[position] === null && winner === null) {
      this.turn(position, huPlayer);
    }
  };

  play = (position, player) => {
    const { squareValues } = this.state;
    const newSquareValues = [...squareValues];
    newSquareValues[position] = player;

    return newSquareValues;
  };

  turn = (position, player) => {
    const { aiPlayer, huPlayer } = this.state;
    // human plays
    const newSquareValues = this.play(position, player);

    this.setState({
      squareValues: newSquareValues,
      nextPlayer: aiPlayer
    }, () => {
      const { aiPlayer, squareValues } = this.state;

      // check for a draw
      // if no draw then the computer plays
      if (!this.isGameDrawn(squareValues)) {
        // computer finds best square
        const bestSpot = this.bestSpot(squareValues);

        // computer plays
        const newSquareValues = this.play(bestSpot, aiPlayer);

        this.setState({
          squareValues: newSquareValues,
          nextPlayer: huPlayer,
        }, () => {
          const { squareValues, aiPlayer } = this.state;

          // check if computer has won
          if (this.checkWin(squareValues, aiPlayer) !== null) {
            this.setState({ winner: aiPlayer });
          }
        });
      }
    })
  };

  checkWin = (squareValues, player) => {
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

    let plays = squareValues.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;

    //check through the winning combinations
    for (let [index, win] of winningLines.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  };


  isGameDrawn = (newSquareValues) => {
    const { winner } = this.state;

    const nullSquares = newSquareValues.filter(square => square === null);
    if (nullSquares.length === 0 && winner === null) {
      this.setState({ isGameDone: true });
      return true;
    }
    return false;
  };

  emptySquares = newSquareValues => {
    const emptySquares = [];

    // check for empty squares
    for (let i = 0; i < newSquareValues.length; i++) {
      if (newSquareValues[i] === null) {
        emptySquares.push(i);
      }
    }
    return emptySquares;
  };

  bestSpot = (newSquareValues) => {
    const { aiPlayer } = this.state;

    const bestSpot = this.minimax(newSquareValues, aiPlayer);
    return bestSpot.index;
  }

  minimax = (newSquareValues, player) => {
    const { huPlayer, aiPlayer } = this.state;
    const availSpots = this.emptySquares(newSquareValues);

    if (this.checkWin(newSquareValues, huPlayer)) {
      return { score: -10 };
    } else if (this.checkWin(newSquareValues, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = availSpots[i];

      newSquareValues[availSpots[i]] = player;

      if (player === aiPlayer) {
        const result = this.minimax(newSquareValues, huPlayer);
        move.score = result.score;
      } else {
        const result = this.minimax(newSquareValues, aiPlayer);
        move.score = result.score;
      }

      newSquareValues[availSpots[i]] = null;

      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -10000;

      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  render() {
    const { winner, isGameDone, squareValues, nextPlayer } = this.state;
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
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

export default Game;
