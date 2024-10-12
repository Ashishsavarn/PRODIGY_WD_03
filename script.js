const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

const xWinsLabel = document.getElementById("xWins");
const oWinsLabel = document.getElementById("oWins");
const drawsLabel = document.getElementById("draws");

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let gameHistory = [];
let xWins = 0;
let oWins = 0;
let draws = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    moveSound.play(); // Play sound for the move

    checkResult();
}

function aiMove() {
    const emptyCells = gameState
        .map((value, index) => (value === '' ? index : null))
        .filter(index => index !== null);
    
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].innerText = 'O';
    moveSound.play(); // Play sound for the move
    checkResult();
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            for (let index of winningConditions[i]) {
                cells[index].classList.add("winner"); // Add celebration animation
            }
            winSound.play(); // Play sound for winning
            updateScore(currentPlayer);
            break;
        }
    }

    if (roundWon) {
        message.innerText = `${currentPlayer} has won!`;
        isGameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        message.innerText = "It's a draw!";
        draws++;
        drawsLabel.innerText = draws;
        drawSound.play(); // Play sound for draw
        isGameActive = false;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateScore(winner) {
    if (winner === 'X') {
        xWins++;
        xWinsLabel.innerText = xWins;
    } else if (winner === 'O') {
        oWins++;
        oWinsLabel.innerText = oWins;
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    message.innerText = '';

    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove("winner"); // Remove animation class
    });
}

function checkPreviousMatch() {
    if (gameHistory.length === 0) {
        message.innerText = "No previous matches!";
    } else {
        message.innerText = `Previous winner: ${gameHistory[gameHistory.length - 1]}`;
    }
}

function startGameWithAI() {
    resetGame();
    currentPlayer = 'X'; // Player always starts first
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });
    isGameActive = true;
}

document.getElementById("playFriends").addEventListener("click", resetGame);
document.getElementById("playAI").addEventListener("click", startGameWithAI);
document.getElementById("checkHistory").addEventListener("click", checkPreviousMatch);
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});
resetBtn.addEventListener("click", resetGame);

// AI turn
cells.forEach(cell => {
    cell.addEventListener("click", function() {
        handleCellClick(event);
        if (isGameActive && currentPlayer === 'O') {
            aiMove();
        }
    });
});
