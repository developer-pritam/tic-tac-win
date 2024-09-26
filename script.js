// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Your Firebase configuration
import firebaseConfig from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UI elements
const lobby = document.getElementById('lobby');
const startGameButton = document.getElementById('startGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameContainer = document.getElementById('game-container');
const turnIndicator = document.getElementById('turn-indicator');
const restartGameButton = document.getElementById('restartGameButton');

// Game state variables
let gameId = null;
let playerSymbol = null;
let currentPlayer = null;

restartGameButton.addEventListener('click', restartGame);

// Start New Game
startGameButton.addEventListener('click', async () => {
  const gameRef = await addDoc(collection(db, 'games'), {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    players: {},
    moveHistoryCross: [],
    moveHistoryCircle: [],
    gameOver: false,
  });

  gameId = gameRef.id;
  playerSymbol = Math.random() < 0.5 ? 'X' : 'O';

  await updateDoc(gameRef, {
    [`players.${playerSymbol}`]: true,
  });

  alert(`Game Code: ${gameId}`);

  lobby.style.display = 'none';
  gameContainer.style.display = 'flex';
  document.getElementById('board').style.display = 'grid';

  listenToGameState();
});

// Join Game
joinGameButton.addEventListener('click', async () => {
  const code = gameCodeInput.value.trim();
  if (code === '') {
    alert('Please enter a game code.');
    return;
  }

  const gameRef = doc(db, 'games', code);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    alert('Game not found.');
    return;
  }

  gameId = code;
  const gameData = gameSnap.data();
  const players = gameData.players || {};

  if (players['X'] && players['O']) {
    alert('Game is full.');
    return;
  }

  playerSymbol = !players['X'] ? 'X' : 'O';

  await updateDoc(gameRef, {
    [`players.${playerSymbol}`]: true,
  });

  lobby.style.display = 'none';
  gameContainer.style.display = 'flex';
  document.getElementById('board').style.display = 'grid';

  listenToGameState();
});

// Listen to game state changes
function listenToGameState() {
  const gameRef = doc(db, 'games', gameId);

  onSnapshot(gameRef, (gameSnap) => {
    if (!gameSnap.exists()) {
      alert('Game has been deleted.');
      return;
    }

    const gameData = gameSnap.data();
    updateBoard(gameData.board);
    currentPlayer = gameData.currentPlayer;

    if (playerSymbol === currentPlayer) {
      turnIndicator.textContent = 'Your turn';
    } else {
      turnIndicator.textContent = "Opponent's turn";
    }

    if (gameData.gameOver) {
      showWinner(gameData.winner);
    } else {
      document.getElementById('modal').style.display = 'none';
    }
  });
}

// Update board UI
function updateBoard(boardArray) {
  document.querySelectorAll('.cell').forEach((cell, idx) => {
    cell.textContent = boardArray[idx];
    cell.classList.remove('text-red-900');
  });
}

// Cell click handler
document.querySelectorAll('.cell').forEach((cell, idx) => {
  cell.addEventListener('click', async function () {
    if (!gameId || !playerSymbol) {
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    const gameData = gameSnap.data();

    if (gameData.gameOver) {
      return;
    }

    if (gameData.currentPlayer !== playerSymbol) {
      alert('Not your turn.');
      return;
    }

    if (gameData.board[idx] !== '') {
      return;
    }

    gameData.board[idx] = playerSymbol;
    const moveHistoryKey =
      playerSymbol === 'X' ? 'moveHistoryCross' : 'moveHistoryCircle';
    let moveHistory = gameData[moveHistoryKey] || [];
    moveHistory.push(idx);

    if (moveHistory.length > 3) {
      const lastThirdMove = moveHistory.shift();
      gameData.board[lastThirdMove] = '';
    }

    gameData.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
    const winner = checkForWinner(gameData.board);

    if (winner) {
      gameData.gameOver = true;
      gameData.winner = winner;
    }

    await updateDoc(gameRef, {
      board: gameData.board,
      currentPlayer: gameData.currentPlayer,
      [moveHistoryKey]: moveHistory,
      gameOver: gameData.gameOver || false,
      winner: gameData.winner || null,
    });
  });
});

// Check for winner
function checkForWinner(board) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Show winner
function showWinner(winner) {
  const modal = document.getElementById('modal');
  const winnerAnnouncement = document.getElementById('winner-announcement');
  winnerAnnouncement.textContent = `${winner} wins the game!`;
  modal.style.display = 'flex';
}

// Restart game
async function restartGame() {
  const gameRef = doc(db, 'games', gameId);

  await updateDoc(gameRef, {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    moveHistoryCross: [],
    moveHistoryCircle: [],
    gameOver: false,
    winner: null,
  });

  document.getElementById('modal').style.display = 'none';
}
