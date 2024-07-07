// Game Elements
const dinosaur = document.getElementById('person');
const gameContainer = document.getElementById('game_container');
const scoreDisplay = document.querySelector('.score');
const highScoreDisplay = document.querySelector('.high_score');
const gameOverDisplay = document.getElementById('game_over');
const startMessage = document.getElementById('start_message');
const restartButton = document.getElementById('restart_button');

// Game State
let obstacles = [];
let isJumping = false;
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let highScore = 0;

// Jump Mechanics
const gravity = 0.7;
const jumpHeight = 12;

// Obstacle Mechanics
let obstacleSpeed = 3;
const minSpawnInterval = 1000;
const maxSpawnInterval = 2000;
let obstacleCount = 0;

// Additional Variables
let gameLoopId;
let obstacleSpawnId;

// Initialization Function
function initializeGame() {
    score = 0;
    isJumping = false;
    isGameOver = false;
    isGameStarted = false;
    obstacles = [];
    obstacleSpeed = 3;
    obstacleCount = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    highScoreDisplay.textContent = 'High Score: ' + highScore;

    // Clear previous obstacles
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    gameOverDisplay.classList.add('hidden');
    startMessage.classList.remove('hidden');
    dinosaur.style.bottom = '0px';
}

// Function to Start the Game
function startGame() {
    if (!isGameStarted) {
        isGameStarted = true;
        startMessage.classList.add('hidden');
        gameOverDisplay.classList.add('hidden');
        gameLoop();
        spawnObstacle();
    }
}

// Function to Handle Jumping
function handleJump() {
    if (!isJumping) {
        let velocity = jumpHeight;
        isJumping = true;

        const jumpInterval = setInterval(() => {
            let position = parseInt(window.getComputedStyle(dinosaur).getPropertyValue('bottom'));

            if (position <= 0 && velocity < 0) {
                clearInterval(jumpInterval);
                isJumping = false;
                dinosaur.style.bottom = '0px';
            } else {
                position += velocity;
                velocity -= gravity;
                dinosaur.style.bottom = Math.max(0, position) + 'px';
            }
        }, 20);
    }
}

// Function to Move Obstacles
function moveObstacles() {
    obstacles.forEach(obstacle => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));

        obstacle.style.left = (obstacleLeft - obstacleSpeed) + 'px';

        if (obstacleLeft <= -obstacle.offsetWidth) {
            obstacle.remove();
            obstacles.shift();
            score++;
            updateScore();
        }
    });
}

// Function to Check for Collisions
function checkCollision() {
    obstacles.forEach(obstacle => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        let obstacleBottom = parseInt(window.getComputedStyle(obstacle).getPropertyValue('bottom'));
        let dinosaurBottom = parseInt(window.getComputedStyle(dinosaur).getPropertyValue('bottom'));
        let dinosaurHeight = dinosaur.offsetHeight;

        if (
            obstacleLeft <= 110 && obstacleLeft >= 50 &&
            (
                (obstacleBottom === 0 && dinosaurBottom < 60) ||
                (obstacleBottom > 0 && dinosaurBottom + dinosaurHeight > obstacleBottom)
            )
        ) {
            obstacleSpeed = 0;
            isJumping = false;
            gameOver();
        }
    });
}

// Function to Update Score
function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = 'High Score: ' + highScore;
    }
}

// Function to Handle Game Over
function gameOver() {
    isGameOver = true;
    clearInterval(gameLoopId);
    clearTimeout(obstacleSpawnId);
    gameOverDisplay.classList.remove('hidden');
}

// Event Listener for Jump Action and Restart
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (isGameOver) {
            initializeGame();
            startGame();
        } else if (!isGameStarted) {
            startGame();
        } else {
            handleJump();
        }
    }
});

// Event Listener for Touch Action and Restart
document.addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (isGameOver) {
        initializeGame();
        startGame();
    } else if (!isGameStarted) {
        startGame();
    } else {
        handleJump();
    }
});

restartButton.addEventListener('click', () => {
    initializeGame();
    startGame();
});

// Add touch event listener to the restart button
restartButton.addEventListener('touchstart', () => {
    initializeGame();
    startGame();
});

// Function to Spawn Obstacles at Random Intervals
function spawnObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    let obstacleHeight;

    if (obstacleCount < 6) {
        obstacleHeight = 0;
    } else {
        obstacleHeight = Math.random() > 0.5 ? 0 : 63;
    }

    obstacleCount++;

    const obstacleType = Math.floor(Math.random() * 3) + 1;
    obstacle.classList.add('obstacle', `obstacle${obstacleType}`);

    obstacle.style.bottom = obstacleHeight + 'px';
    obstacle.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);

    obstacleSpawnId = setTimeout(spawnObstacle, Math.random() * (maxSpawnInterval - minSpawnInterval) + minSpawnInterval);
}

// Main Game Loop
function gameLoop() {
    if (!isGameOver) {
        moveObstacles();
        checkCollision();
        updateScore();
        obstacleSpeed += 0.0001;
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Initialize the game on load
initializeGame();