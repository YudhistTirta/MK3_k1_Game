// game variables and constants
let inputDir = { x: 0, y: 0 }; // Arah pergerakan awal ular (diam)
const foodSound = new Audio("./items/eat.mp3"); // Suara saat makan makanan
const gameOverSound = new Audio("./items/gameOver.mp3"); // Suara saat game over
const moveSound = new Audio('./items/move.mp3'); // Suara saat bergerak
const musicSound = new Audio("./items/gameBg.mp3"); // Musik latar
let speed = 9; // Kecepatan permainan
let score = 0; // Skor saat ini
let lastPaintTime = 0; // Waktu terakhir frame dirender
let snakeArr = [ // Posisi awal ular
    { x: 13, y: 15 }
];
food = { x: 6, y: 7 }; // Posisi awal makanan

// GAME FUNCTIONS
function main(ctime) {
    window.requestAnimationFrame(main); // Minta animasi frame berikutnya
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return; // Belum waktunya update frame
    }
    lastPaintTime = ctime; // Simpan waktu frame terakhir
    gameEngine(); // Jalankan logika game
}

function isCollide(snake) {
    // Cek apakah kepala ular menabrak badannya sendiri
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Cek apakah kepala ular menabrak dinding
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false; // Tidak ada tabrakan
}
