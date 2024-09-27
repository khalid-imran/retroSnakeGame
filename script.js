let gameBoard = document.querySelector('.game-board');
let currentScore = document.querySelector('.current');
let highScore = document.querySelector('.high');

let gridSize = 25;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let started = false;
let gameInterval = null;
let snakeSpeed = 1000;

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
        food = generateFood()
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveSnake();
            drawGame();
        }, snakeSpeed)
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
    started = true;
    snake = [{x: 10, y: 10}];
    gameInterval = setInterval(() => {
        moveSnake();
        drawGame();
    }, snakeSpeed)
}

function stopGame() {
    started = false;
    clearInterval(gameInterval);
}

document.addEventListener('keydown', handleKeyPress);
