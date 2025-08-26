// Game variables and constants
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("./items/eat.mp3");
const gameOverSound = new Audio("./items/gameOver.mp3");
const moveSound = new Audio('./items/move.mp3');
const musicSound = new Audio("./items/gameBg.mp3");
let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let hiscoreval = 0;
let playerName = "Guest";
let gameStarted = false;
let leaderboard = [];

// DOM Elements
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const playerNameBox = document.getElementById('playerName');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const submitName = document.getElementById('submitName');
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const speedSelect = document.getElementById('speedSelect');
const musicToggle = document.getElementById('musicToggle');
const saveSettings = document.getElementById('saveSettings');
const closeSettings = document.getElementById('closeSettings');
const leaderboardList = document.getElementById('leaderboardList');
const clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');

// GAME FUNCTIONS
function main(ctime) {
    if (!gameStarted) return;
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function generateFood() {
    let a = 2, b = 16;
    let newFood;
    do {
        newFood = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    } while (snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function updateLeaderboard() {
    if (score > 0) {
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
    displayLeaderboard();
}

function displayLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        let entryDiv = document.createElement('div');
        entryDiv.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(entryDiv);
    });
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        moveSound.pause();
        musicSound.pause();
        updateLeaderboard();
        inputDir = { x: 0, y: 0 };
        alert("Game over, press any key to play again");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score<br>" + score;
        if (musicToggle.checked) musicSound.play();
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High-Score<br>" + hiscoreval;
        }
        scoreBox.innerHTML = "Score<br>" + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = generateFood();
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// MAIN LOGIC
// Load high score
let hiscore = localStorage.getItem('hiscore');
if (hiscore !== null) {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High-Score<br>" + hiscoreval;
}

// Load leaderboard
let savedLeaderboard = localStorage.getItem('leaderboard');
if (savedLeaderboard !== null) {
    leaderboard = JSON.parse(savedLeaderboard);
    displayLeaderboard();
}

// Load settings
let savedSpeed = localStorage.getItem('speed');
if (savedSpeed !== null) {
    speed = parseInt(savedSpeed);
    speedSelect.value = speed;
}
let savedMusic = localStorage.getItem('music');
if (savedMusic !== null) {
    musicToggle.checked = JSON.parse(savedMusic);
}

// Show name input modal
nameModal.style.display = 'flex';
nameInput.focus();

// Handle name submission
submitName.addEventListener('click', () => {
    playerName = nameInput.value.trim() || "Guest";
    playerNameBox.innerHTML = "Player: " + playerName;
    nameModal.style.display = 'none';
    gameStarted = true;
    if (musicToggle.checked) musicSound.play();
    window.requestAnimationFrame(main);
});

// Handle settings button
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
    gameStarted = false;
});

// Handle save settings
saveSettings.addEventListener('click', () => {
    speed = parseInt(speedSelect.value);
    localStorage.setItem('speed', speed);
    localStorage.setItem('music', musicToggle.checked);
    if (!musicToggle.checked) musicSound.pause();
    else if (gameStarted) musicSound.play();
    settingsModal.style.display = 'none';
    gameStarted = true;
    window.requestAnimationFrame(main);
});

// Handle close settings without saving
closeSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    gameStarted = true;
    window.requestAnimationFrame(main);
});

// Handle clear leaderboard
clearLeaderboardBtn.addEventListener('click', () => {
    leaderboard = [];
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    hiscoreval = 0;
    localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
    hiscoreBox.innerHTML = "High-Score<br>0";
    displayLeaderboard();
});

// DETEKSI INPUT TOMBOL ARAH
window.addEventListener('keydown', e => {
    if (!gameStarted) return;
    inputDir = { x: 0, y: 1 };
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    }
});