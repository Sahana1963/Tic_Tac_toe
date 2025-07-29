const board = document.getElementById("board");
const statusText = document.getElementById("status");

let game = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let isGameOver = false;

function renderBoard() {
  board.innerHTML = "";
  game.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = val;
    cell.addEventListener("click", () => makeMove(i));
    board.appendChild(cell);
  });
}

function makeMove(index) {
  if (game[index] === "" && !isGameOver) {
    game[index] = human;
    if (checkWinner(game, human)) {
      statusText.textContent = "You Win! 🎉";
      isGameOver = true;
      return;
    } else if (isDraw()) {
      statusText.textContent = "It's a Draw 🤝";
      isGameOver = true;
      return;
    }
    bestMove();
  }
  renderBoard();
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < game.length; i++) {
    if (game[i] === "") {
      game[i] = ai;
      let score = minimax(game, 0, false);
      game[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  game[move] = ai;
  if (checkWinner(game, ai)) {
    statusText.textContent = "AI Wins! 🤖";
    isGameOver = true;
  } else if (isDraw()) {
    statusText.textContent = "It's a Draw 🤝";
    isGameOver = true;
  } else {
    statusText.textContent = "Your turn (X)";
  }
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, ai)) return 10 - depth;
  if (checkWinner(newBoard, human)) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = human;
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWinner(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // cols
    [0, 4, 8], [2, 4, 6]              // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

function isDraw() {
  return game.every(cell => cell !== "");
}

function restartGame() {
  game = ["", "", "", "", "", "", "", "", ""];
  isGameOver = false;
  statusText.textContent = "Your turn (X)";
  renderBoard();
}

renderBoard();
