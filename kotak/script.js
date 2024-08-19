const startBtn = document.getElementById('start-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const gameBoard = document.getElementById('game-board');
const gameOverScreen = document.getElementById('game-over');

let coinsCollected = 0;
let attemptsLeft = 3;
let maze = [];
let player = { x: 0, y: 0 };
let exit = { x: 0, y: 0 };
let coins = [];
let enemies = [];
const boardSize = 500;
const cellSize = 25;
const rows = boardSize / cellSize;
const cols = boardSize / cellSize;
const totalCoins = 10;
const numEnemies = 2;

function startGame() {
    generateMaze();
    placeCoins(totalCoins);
    createExit();
    setupPlayer();
    setupEnemies();
    startBtn.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameBoard.style.display = 'block'; // Show game board
    document.addEventListener('keydown', movePlayer);

    // Move enemies periodically
    setInterval(moveEnemies, 1000); // Move every second
}

function generateMaze() {
    gameBoard.innerHTML = ''; // Clear previous maze
    maze = [];

    // Initialize maze grid with fewer walls
    for (let y = 0; y < rows; y++) {
        maze[y] = [];
        for (let x = 0; x < cols; x++) {
            maze[y][x] = Math.random() > 0.2 ? 0 : 1; // Decrease the wall density to 10%
        }
    }

    // Ensure starting and ending positions are clear
    maze[0][0] = 0;
    maze[Math.floor(rows - 1)][Math.floor(cols - 1)] = 0;

    // Draw maze on gameBoard
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.className = maze[y][x] === 1 ? 'maze-wall' : 'maze-path';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.left = `${x * cellSize}px`;
            cell.style.top = `${y * cellSize}px`;
            gameBoard.appendChild(cell);
        }
    }
}

function placeCoins(number) {
    coins = [];
    let placed = 0;
    while (placed < number) {
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);

        if (maze[y][x] === 0) { // Ensure the coin is placed on a path
            const coin = document.createElement('div');
            coin.className = 'coin';
            coin.style.width = `${cellSize / 2}px`;
            coin.style.height = `${cellSize / 2}px`;
            coin.style.left = `${x * cellSize + cellSize / 4}px`;
            coin.style.top = `${y * cellSize + cellSize / 4}px`;
            gameBoard.appendChild(coin);
            coins.push({ x, y, element: coin });
            placed++;
        }
    }
}

function createExit() {
    let x, y;
    do {
        x = Math.floor(Math.random() * cols);
        y = Math.floor(Math.random() * rows);
    } while (maze[y][x] !== 0);

    exit = { x, y };
    const exitElement = document.createElement('div');
    exitElement.className = 'exit';
    exitElement.style.width = `${cellSize}px`;
    exitElement.style.height = `${cellSize}px`;
    exitElement.style.left = `${x * cellSize}px`;
    exitElement.style.top = `${y * cellSize}px`;
    exitElement.style.backgroundColor = 'gray'; // Initially inaccessible
    gameBoard.appendChild(exitElement);
}

function setupPlayer() {
    player.x = 0;
    player.y = 0;
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.style.width = `${cellSize}px`;
    playerElement.style.height = `${cellSize}px`;
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
    gameBoard.appendChild(playerElement);
}

function setupEnemies() {
    enemies = [];
    for (let i = 0; i < numEnemies; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * cols);
            y = Math.floor(Math.random() * rows);
        } while (maze[y][x] !== 0 || (x === player.x / cellSize && y === player.y / cellSize));

        const enemy = { x, y, element: createEnemyElement(x, y) };
        gameBoard.appendChild(enemy.element);
        enemies.push(enemy);
    }
}

function createEnemyElement(x, y) {
    const enemyElement = document.createElement('div');
    enemyElement.className = 'enemy';
    enemyElement.style.width = `${cellSize}px`;
    enemyElement.style.height = `${cellSize}px`;
    enemyElement.style.left = `${x * cellSize}px`;
    enemyElement.style.top = `${y * cellSize}px`;
    enemyElement.style.backgroundColor = 'red'; // Enemy color
    return enemyElement;
}

function movePlayer(event) {
    const playerElement = document.querySelector('.player');
    const keys = { 'ArrowUp': [0, -1], 'ArrowDown': [0, 1], 'ArrowLeft': [-1, 0], 'ArrowRight': [1, 0] };
    
    if (keys[event.key]) {
        const [dx, dy] = keys[event.key];
        const newX = player.x / cellSize + dx;
        const newY = player.y / cellSize + dy;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
            player.x += dx * cellSize;
            player.y += dy * cellSize;
            playerElement.style.left = `${player.x}px`;
            playerElement.style.top = `${player.y}px`;
            
            checkCollisions();
        }
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // Up, Down, Left, Right
        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        const newX = enemy.x + dx;
        const newY = enemy.y + dy;

        if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0 &&
            !(newX === player.x / cellSize && newY === player.y / cellSize)) {
            enemy.x = newX;
            enemy.y = newY;
            enemy.element.style.left = `${newX * cellSize}px`;
            enemy.element.style.top = `${newY * cellSize}px`;
        }
    });
}

function checkCollisions() {
    // Check for collisions with coins
    coins.forEach((coin, index) => {
        if (player.x === coin.x * cellSize && player.y === coin.y * cellSize) {
            gameBoard.removeChild(coin.element);
            coins.splice(index, 1);
            coinsCollected++;
            if (coinsCollected === totalCoins) {
                showExit();
            }
        }
    });
    
    // Check for collision with exit
    if (coinsCollected === totalCoins && player.x === exit.x * cellSize && player.y === exit.y * cellSize) {
        alert('You win!');
        startGame();
    }
    
    // Check for collision with enemies
    enemies.forEach(enemy => {
        if (player.x === enemy.x * cellSize && player.y === enemy.y * cellSize) {
            gameOver();
        }
    });
}

function showExit() {
    const exitElement = document.querySelector('.exit');
    exitElement.style.backgroundColor = 'green'; // Make exit accessible
}

function gameOver() {
    // Display the game over screen
    gameOverScreen.style.display = 'block';
    
    // Hide the game board and other elements
    gameBoard.style.display = 'none';
    startBtn.style.display = 'none';

    // Remove event listeners to stop player movement
    document.removeEventListener('keydown', movePlayer);

    // Clear any remaining enemies
    enemies.forEach(enemy => gameBoard.removeChild(enemy.element));
}

function tryAgain() {
    attemptsLeft = 3; // Reset attempts
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    gameBoard.style.display = 'block'; // Show the game board
    startBtn.style.display = 'none'; // Hide the start button (not needed)

    // Clear the game board
    gameBoard.innerHTML = '';

    // Restart the game
    startGame();
}

startBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', tryAgain);
