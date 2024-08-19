const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');

canvas.width = 800;
canvas.height = 600;

const birdImage = new Image();
birdImage.src = 'img/bird.png'; // Ganti dengan path ke gambar burung Anda

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.7,
    lift: -15,
    jump: false
};

let pipes = [];
let pipeWidth = 80;
let pipeGap = 200;
let frame = 0;
let score = 0;
let gameInterval;

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    gameOverScreen.classList.add('hidden');
    pipes = [];
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    score = 0;
    frame = 0;
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function restartGame() {
    clearInterval(gameInterval);
    startGame();
}

function updateGame() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.height || bird.y < 0) {
        endGame();
    }

    if (frame % 90 === 0) {
        let pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
        pipes.push({
            x: canvas.width,
            height: pipeHeight
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

        if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
            score++;
            pipe.passed = true;
        }

        if (collision(pipe)) {
            endGame();
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Gambarkan burung dengan gambar
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function collision(pipe) {
    if (bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipeWidth &&
        (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap)) {
        return true;
    }
    return false;
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('startButton').style.display = 'none';
    gameOverScreen.classList.remove('hidden');
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', restartGame);
