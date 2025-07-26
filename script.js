let gameBoard;
let scoreDisplay;
let highScoreDisplay;
let gameOverOverlay;
let finalScoreDisplay;
let continueButton;

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = getRandomFoodPosition();
let direction = 'right';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let gameRunning = true;
let isPaused = false;

function main() {
    if (isPaused) return;

    if (!gameRunning) {
        console.log("Game Over detected. Attempting to show overlay.");
        clearInterval(gameInterval);
        updateHighScore();
        finalScoreDisplay.textContent = `Your score: ${score}. High Score: ${highScore}`;
        gameOverOverlay.classList.add('visible');
        console.log("Overlay class added.");
        return;
    }

    update();
    draw();
}

function update() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    checkCollision();
}

function draw() {
    gameBoard.innerHTML = '';
    drawSnake();
    drawFood();
}

function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
    }
    return newFoodPosition;
}

function onSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function checkCollision() {
    const head = snake[0];
    console.log("checkCollision() called. Snake head: (" + head.x + ", " + head.y + ")");

    if (
        head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize
    ) {
        gameRunning = false;
        console.log("Collision with wall. gameRunning set to false.");
        document.getElementById('hitWallSound').play();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
            console.log("Collision with self. gameRunning set to false.");
            document.getElementById('hitWallSound').play();
            break;
        }
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pause');
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}


document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
        case 'p':
            togglePause();
            break;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.getElementById('gameBoard');
    scoreDisplay = document.getElementById('score');
    highScoreDisplay = document.getElementById('highScore');
    gameOverOverlay = document.getElementById('gameOverOverlay');
    finalScoreDisplay = document.getElementById('finalScore');
    continueButton = document.getElementById('continueButton');

    document.getElementById('up').addEventListener('click', () => { if (direction !== 'down') direction = 'up'; });
    document.getElementById('down').addEventListener('click', () => { if (direction !== 'up') direction = 'down'; });
    document.getElementById('left').addEventListener('click', () => { if (direction !== 'right') direction = 'left'; });
    document.getElementById('right').addEventListener('click', () => { if (direction !== 'left') direction = 'right'; });
    document.getElementById('pause').addEventListener('click', togglePause);
    continueButton.addEventListener('click', resetGame);

    highScoreDisplay.textContent = `High Score: ${highScore}`;
    gameInterval = setInterval(main, 200);
});

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = getRandomFoodPosition();
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameRunning = true;
    isPaused = false;
    const pauseButton = document.getElementById('pause');
    pauseButton.textContent = 'Pause';
    gameOverOverlay.classList.remove('visible');
    clearInterval(gameInterval);
    gameInterval = setInterval(main, 200);
}
