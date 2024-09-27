let gameBoard = document.querySelector('.game-board');
let gameHomeScreen = document.querySelector('.game-home-screen');
let gameOverScreen = document.querySelector('.game-over');
let currentScoreEl = document.querySelector('.current');
let highScoreEl = document.querySelector('.high');

let gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let started = false;
let gameInterval = null;
let snakeSpeed = 200;
let currentScore = 0;
let highScore = 0;

function drawGame() {
    gameBoard.innerHTML = '';
    drawSnake();
    drawFood();
}
function drawSnake() {
    snake.forEach((part) => {
        let snakeElement = document.createElement('div');
        snakeElement.classList.add('snake');
        snakeElement.style.gridColumn = part.x;
        snakeElement.style.gridRow = part.y;
        gameBoard.appendChild(snakeElement);
    })
}
function drawFood() {
    let foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridColumn = food.x;
    foodElement.style.gridRow = food.y;
    gameBoard.appendChild(foodElement);
}
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}
function moveSnake() {
    let snakeHead = {...snake[0]}
    switch (direction) {
        case 'up':
            snakeHead.y--;
            break;
        case 'down':
            snakeHead.y++;
            break;
        case 'right':
            snakeHead.x++;
            break;
        case 'left':
            snakeHead.x--;
            break;
    }
    snake.unshift(snakeHead);
    if ((snakeHead.x < 1 || snakeHead.x > gridSize) || snakeHead.y < 1 || snakeHead.y > gridSize) {
        stopGame()
    }
    for (let i = 1; i < snake.length; i++) {
        if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
            stopGame()
        }
    }

    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        food = generateFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            drawGame();
        }, snakeSpeed);
        currentScore++;
        currentScoreEl.textContent = currentScore;
    } else {
        snake.pop();
    }
}

function handleKeyPress(event) {
    if ((event.key === ' ' && !started) || (event.code === 'Space' && !started)) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    direction = 'left';
                }
                break;
        }
    }
}

function startGame() {
    gameHomeScreen.style.display = 'none';
    gameBoard.style.display = 'grid';
    gameBoard.innerHTML = '';
    started = true;
    snake = [{x: 10, y: 10}];
    gameInterval = setInterval(() => {
        moveSnake();
        drawGame();
    }, snakeSpeed)
}

function stopGame() {
    gameBoard.innerHTML = '';
    clearInterval(gameInterval);
    gameOverScreen.classList.add('active');
    updateHighScore();
    setTimeout(() => {
        started = false;
        food = generateFood();
        gameHomeScreen.style.display = 'flex';
        gameBoard.style.display = 'none';
        gameOverScreen.classList.remove('active');
    }, 2500)
}

function updateHighScore() {
    let  highScore = localStorage.getItem('highScore');
    if (highScore != null) {
        highScore = JSON.parse(highScore);
    }
    if (currentScore > highScore) {
        highScore = currentScore;
    }
    localStorage.setItem('highScore', JSON.stringify(highScore));
    showHighScore()
    currentScore = 0;
    currentScoreEl.textContent = currentScore;
}
function showHighScore() {
    let  highScore = localStorage.getItem('highScore');
    if (highScore != null) {
        highScoreEl.textContent = highScore;
    }
}
showHighScore();

document.addEventListener('keydown', handleKeyPress);
