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

function gameEngine() {

    // PERIKSA TABRAKAN
    if (isCollide(snakeArr)) {
        gameOverSound.play(); // Mainkan suara game over
        moveSound.pause(); // Hentikan suara gerakan
        inputDir = { x: 0, y: 0 }; // Hentikan pergerakan ular
        alert("Game over , press any key to play again"); // Tampilkan pesan game over
        snakeArr = [{ x: 13, y: 15 }]; // Reset posisi ular
        musicSound.play(); // Mainkan musik latar
        score = 0; // Reset skor
    }

    // JIKA MAKANAN DIMAKAN
    if (snakeArr[0].y == food.y && snakeArr[0].x == food.x) {
        foodSound.play(); // Mainkan suara makan
        score += 1; // Tambah skor

        // Update skor tertinggi jika skor saat ini lebih tinggi
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval)); // Simpan skor tertinggi ke localStorage
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval; // Tampilkan skor tertinggi
        }

        scoreBox.innerHTML = "Current score : " + score; // Update skor saat ini
        // Tambahkan segmen baru di kepala ular
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        // Regenerasi makanan di posisi acak
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // GERAKKAN BADAN ULAR
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }; // Pindahkan setiap bagian tubuh ke posisi sebelumnya
    }

    // GERAKKAN KEPALA ULAR
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // TAMPILKAN ULAR DI BOARD
    board.innerHTML = ""; // Kosongkan board
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div'); // Buat elemen div baru
        snakeElement.style.gridRowStart = e.y; // Atur posisi vertikal
        snakeElement.style.gridColumnStart = e.x; // Atur posisi horizontal

        if (index === 0) {
            snakeElement.classList.add('head'); // Tambahkan class untuk kepala ular
        } else {
            snakeElement.classList.add('snake'); // Tambahkan class untuk tubuh ular
        }

        board.appendChild(snakeElement); // Tambahkan elemen ke board
    });

    // TAMPILKAN MAKANAN DI BOARD
    foodElement = document.createElement('div'); // Buat elemen makanan
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food'); // Tambahkan class makanan
    board.appendChild(foodElement); // Tambahkan ke board
}

// MAIN LOGIC

musicSound.play(); // Mulai musik latar

// AMBIL SKOR TERTINGGI DARI LOCAL STORAGE
let hiscore = localStorage.getItem('hiscore');

if (hiscore == null) {
    hiscoreval = 0; // Jika belum ada, inisialisasi ke 0
    localStorage.setItem('hiscore', JSON.stringify(hiscoreval)); // Simpan ke localStorage
} else {
    hiscoreval = JSON.parse(hiscore); // Ambil dan parse data
    hiscoreBox.innerHTML = "HiScore: " + hiscore; // Tampilkan skor tertinggi
}

window.requestAnimationFrame(main); // Mulai loop game

// DETEKSI INPUT TOMBOL ARAH
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }; // Mulai game dengan arah bawah default
    moveSound.play(); // Mainkan suara gerakan

    // Ubah arah berdasarkan tombol panah yang ditekan
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

        default:
            break; // Abaikan tombol lain
    }
});