# Tic Tac Toe

Tic Tac Toe is a simple and interactive two-player game built using HTML, CSS, and JavaScript. Players take turns placing **X** and **O** on a 3×3 grid, aiming to form a row, column, or diagonal with three matching symbols. The game includes win detection, draw detection, and a restart option, providing an engaging way to learn basic web development concepts and game logic.


This project contains a separate JavaScript backend and HTML/CSS frontend for a Tic Tac Toe game.

## Backend

1. Open a terminal in `backend`
2. Run `npm install`
3. Start the backend with `npm start`
4. The API listens on `http://localhost:3000`

Endpoints:
- `GET /state`
- `POST /move` with JSON `{ row, col, player }`
- `POST /reset`

## Frontend

1. Open `frontend/index.html` in a browser using a local static server
   - Example: in `frontend` folder run `python -m http.server 8000`
   - Then navigate to `http://localhost:8000`
2. The frontend will communicate with the backend at `http://localhost:3000`

> Note: Loading `index.html` directly from `file://` may be blocked by browser security. Use a local server if needed.
> Open http://localhost:8000 in your browser to play the game.
