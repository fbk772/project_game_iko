const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const singlePlayerButton = document.getElementById('singlePlayerButton');
const multiPlayerButton = document.getElementById('multiPlayerButton');

let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let isSinglePlayer = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (boardState[cellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        messageElement.textContent = `${currentPlayer} wins!`;
        gameActive = false;
    } else if (boardState.includes('') === false) {
        messageElement.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (isSinglePlayer && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    let availableCells = [];
    boardState.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    boardState[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

    if (checkWinner()) {
        messageElement.textContent = `${currentPlayer} wins!`;
        gameActive = false;
    } else if (boardState.includes('') === false) {
        messageElement.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return boardState[index] === currentPlayer;
        });
    });
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
    gameActive = true;
    messageElement.textContent = '';
}

singlePlayerButton.addEventListener('click', () => {
    resetGame();
    isSinglePlayer = true;
});

multiPlayerButton.addEventListener('click', () => {
    resetGame();
    isSinglePlayer = false;
});

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
