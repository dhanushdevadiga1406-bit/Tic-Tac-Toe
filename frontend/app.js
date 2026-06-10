const baseUrl = 'http://localhost:3000';
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
let currentState = null;

function setMessage(text = '', type = 'info') {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`;
}

async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Server error');
    }
    return response.json();
  } catch (error) {
    setMessage(error.message || 'Unable to reach server', 'error');
    throw error;
  }
}

async function fetchState() {
  currentState = await safeFetch(`${baseUrl}/state`);
}

function renderBoard() {
  boardElement.innerHTML = '';
  currentState.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const button = document.createElement('button');
      button.className = 'cell';
      button.textContent = cell;
      if (cell || currentState.winner || currentState.isDraw) {
        button.classList.add('disabled');
        button.disabled = true;
      } else {
        button.addEventListener('click', () => handleMove(rowIndex, colIndex));
      }
      boardElement.appendChild(button);
    });
  });

  if (currentState.winner) {
    statusElement.textContent = `Winner: ${currentState.winner}`;
    setMessage('Game finished. Press Reset to start again.', 'info');
  } else if (currentState.isDraw) {
    statusElement.textContent = 'Draw - no winner';
    setMessage('Game finished with a draw. Press Reset to play again.', 'info');
  } else {
    statusElement.textContent = `Next player: ${currentState.nextPlayer}`;
    setMessage('Tap any empty square to play.', 'info');
  }
}

async function handleMove(row, col) {
  const payload = {
    row,
    col,
    player: currentState.nextPlayer
  };

  try {
    currentState = await safeFetch(`${baseUrl}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    renderBoard();
  } catch (error) {
    // Error state handled by safeFetch.
  }
}

async function resetGame() {
  try {
    currentState = await safeFetch(`${baseUrl}/reset`, { method: 'POST' });
    renderBoard();
  } catch (error) {
    // Error state handled by safeFetch.
  }
}

resetButton.addEventListener('click', resetGame);

(async function init() {
  try {
    await fetchState();
    renderBoard();
  } catch (error) {
    statusElement.textContent = 'Unable to load game state';
  }
})();
