const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');

startButton.addEventListener('click', function(){
    startScreen.style.display = 'none';
});
function movePiece(e) {
  let piece = e.target;
  const row = parseInt(piece.getAttribute("row"));
  const column = parseInt(piece.getAttribute("column"));
  let p = new Piece(row, column);

  if (capturedPosition.length > 0) {
    enableToCapture(p);
  } else {
    if (posNewPosition.length > 0) {
      enableToMove(p);
    }
  }

  if (currentPlayer === board[row][column]) {
    player = reverse(currentPlayer);
    if (!findPieceCaptured(p, player)) {
      findPossibleNewPosition(p, player);
    }
  }
}

function enableToCapture(p) {
  let find = false;
  let pos = null;
  capturedPosition.forEach((element) => {
    if (element.newPosition.compare(p)) {
      find = true;
      pos = element.newPosition;
      old = element.pieceCaptured;
      return;
    }
  });

  if (find) {
    board[pos.row][pos.column] = currentPlayer;
    board[readyToMove.row][readyToMove.column] = 0; 
    board[old.row][old.column] = 0;
    readyToMove = null;
    capturedPosition = [];
    posNewPosition = [];
    displayCurrentPlayer();
    builBoard();
    currentPlayer = reverse(currentPlayer);
  } else {
    builBoard();
  }
}

function enableToMove(p) {
  let find = false;
  let newPosition = null;
  posNewPosition.forEach((element) => {
    if (element.compare(p)) {
      find = true;
      newPosition = element;
      return;
    }
  });

  if (find) moveThePiece(newPosition);
  else builBoard();
}

function moveThePiece(newPosition) { 
  board[newPosition.row][newPosition.column] = currentPlayer;
  board[readyToMove.row][readyToMove.column] = 0;

  readyToMove = null;
  posNewPosition = [];
  capturedPosition = [];

  currentPlayer = reverse(currentPlayer);

  displayCurrentPlayer();
  builBoard();
}

function findPossibleNewPosition(piece, player) {
  if (board[piece.row + player][piece.column + 1] === 0) {
    readyToMove = piece;
    markPossiblePosition(piece, player, 1);
  }

  if (board[piece.row + player][piece.column - 1] === 0) {
    readyToMove = piece;
    markPossiblePosition(piece, player, -1);
  }
}

function markPossiblePosition(p, player = 0, direction = 0) {
  attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);

  position = document.querySelector("[data-position='" + attribute + "']");
  if (position) {
    position.style.background = "green";
    posNewPosition.push(new Piece(p.row + player, p.column + direction));
  }
}

function builBoard() {
  game.innerHTML = "";
  let black = 0;
  let blue = 0;
  for (let i = 0; i < board.length; i++) {
    const element = board[i];
    let row = document.createElement("div"); 
    row.setAttribute("class", "row");

    for (let j = 0; j < element.length; j++) {
      const elmt = element[j];
      let col = document.createElement("div");
      let piece = document.createElement("div");
      let caseType = "";
      let occupied = "";

      if (i % 2 === 0) {
        if (j % 2 === 0) {
          caseType = "Whitecase";
        } else {
          caseType = "blackCase";
        }
      } else {
        if (j % 2 !== 0) {
          caseType = "Whitecase";
        } else {
          caseType = "blackCase";
        }
      }

      if (board[i][j] === 1) {
        occupied = "bluePiece";
      } else if (board[i][j] === -1) {
        occupied = "blackPiece";
      } else {
        occupied = "empty";
      }

      piece.setAttribute("class", "occupied " + occupied);
      piece.setAttribute("row", i);
      piece.setAttribute("column", j);
      piece.setAttribute("data-position", i + "-" + j);
      piece.addEventListener("click", movePiece);

      col.appendChild(piece);

      col.setAttribute("class", "column " + caseType);
      row.appendChild(col);

      
      if (board[i][j] === -1) {
        black++;
      } else if (board[i][j] === 1) {
        blue++;
      }
      displayCounter(black, blue);
    }

    game.appendChild(row);
  }

  if (black === 0 || blue === 0) {
    modalOpen(black);
  }
}

function displayCurrentPlayer() {
  var container = document.getElementById("next-player");
  if (container.classList.contains("blue-Piece")) {
    container.setAttribute("class", "black-Piece");
  } else {
    container.setAttribute("class", "blue-Piece");
  }
}

function findPieceCaptured(p, player) {
  let found = false;
  if (
    board[p.row - 1][p.column - 1] === player &&
    board[p.row - 2][p.column - 2] === 0
  ) {
    found = true;
    newPosition = new Piece(p.row - 2, p.column - 2);
    readyToMove = p;

    markPossiblePosition(newPosition);
    capturedPosition.push({
      newPosition: newPosition,
      pieceCaptured: new Piece(p.row - 1, p.column - 1),
    });
  }
  return found;
}

function displayCounter(black, blue) {
  var blackContainer = document.getElementById("black-player-count-pieces");
  var blueContainer = document.getElementById("white-player-count-pieces");
  blackContainer.innerHTML = black;
  blueContainer.innerHTML = blue;
}

function modalOpen(black) {
  document.getElementById("winner").innerHTML = black === 0 ? "blue" : "Black";
  document.getElementById("loser").innerHTML = black !== 0 ? "blue" : "Black";
  modal.classList.add("effect");
}

function modalClose() {
  modal.classList.remove("effect");
}

function reverse(player) {
  return player === -1 ? 1 : -1;
}
