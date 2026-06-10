const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let game = {
  board: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ],
  nextPlayer: 'X',
  winner: null,
  isDraw: false
};

function checkWinner(board) {
  const lines = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]]
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const first = board[a[0]][a[1]];
    if (first && first === board[b[0]][b[1]] && first === board[c[0]][c[1]]) {
      return first;
    }
  }
  return null;
}

function computeDraw(board) {
  return board.every(row => row.every(cell => cell !== ''));
}

function resetGame() {
  game = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    nextPlayer: 'X',
    winner: null,
    isDraw: false
  };
}

app.get('/state', (req, res) => {
  res.json(game);
});

app.post('/move', (req, res) => {
  const { row, col, player } = req.body;

  if (game.winner || game.isDraw) {
    return res.status(400).json({ error: 'Game over. Reset to play again.' });
  }
  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return res.status(400).json({ error: 'Row and col must be integers.' });
  }
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    return res.status(400).json({ error: 'Row and col must be between 0 and 2.' });
  }
  if (player !== game.nextPlayer) {
    return res.status(400).json({ error: `It is ${game.nextPlayer}'s turn.` });
  }
  if (game.board[row][col] !== '') {
    return res.status(400).json({ error: 'Cell is already occupied.' });
  }

  game.board[row][col] = player;
  const winner = checkWinner(game.board);
  if (winner) {
    game.winner = winner;
  } else if (computeDraw(game.board)) {
    game.isDraw = true;
  } else {
    game.nextPlayer = player === 'X' ? 'O' : 'X';
  }

  res.json(game);
});

app.post('/reset', (req, res) => {
  resetGame();
  res.json(game);
});

app.listen(port, () => {
  console.log(`Tic Tac Toe backend listening on http://localhost:${port}`);
});
