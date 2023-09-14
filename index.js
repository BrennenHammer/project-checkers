const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicBack = document.getElementById('musicBack');
const winSound = document.getElementById("winSound")

startButton.addEventListener('click', function() {
    startScreen.style.display = 'none';
    startScreen.style.width = '0px';
    
    // Play the first 5 seconds of musicBack
    musicBack.currentTime = 0;
    musicBack.play();

    // Set a timeout for 5 seconds to pause musicBack and start backgroundMusic
    setTimeout(function() {
        musicBack.pause();
        backgroundMusic.currentTime = 0; // Ensure we start from the beginning
        backgroundMusic.play();
    }, 6000); // 5 seconds
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
  
  if (piece.column + 1 < 8 && board[piece.row + player] && board[piece.row + player][piece.column + 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, 1);
  }

  
  if (piece.column - 1 >= 0 && board[piece.row + player] && board[piece.row + player][piece.column - 1] === 0) {
      readyToMove = piece;
      markPossiblePosition(piece, player, -1);
  }
}


function markPossiblePosition(p, player = 0, direction = 0) {

  attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);
  console.log("attribute", attribute)

  position = document.querySelector("[data-position='" + attribute + "']");
  if (position) {
    position.style.background = "blue";
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
  if (container.classList.contains("bluePiece")) {
    container.setAttribute("class", "occupied blackPiece");
  } else {
    container.setAttribute("class", "occupied bluePiece");
  }
}

function findPieceCaptured(p, player) {
  let found = false;
  let moves = [
      { row: -1, col: -1 }, // top-left
      { row: -1, col: 1 },  // top-right
      { row: 1, col: -1 },  // bottom-left
      { row: 1, col: 1 }    // bottom-right
  ];

  for (let move of moves) {
      let captureRow = p.row + move.row;
      let captureCol = p.column + move.col;

      let landRow = captureRow + move.row;
      let landCol = captureCol + move.col;

      if (isInBounds(captureRow, captureCol) && isInBounds(landRow, landCol) &&
          board[captureRow][captureCol] === player && board[landRow][landCol] === 0) {
          
          found = true;
          let newPosition = new Piece(landRow, landCol);
          readyToMove = p;
          markPossiblePosition(newPosition);
          capturedPosition.push({
              newPosition: newPosition,
              pieceCaptured: new Piece(captureRow, captureCol),
          });
      }
  }

  return found;
}

function isInBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
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
  backgroundMusic.pause()
  setTimeout (function(){
    winSound.play()
  },1000)
}




function modalClose() {
  modal.classList.remove("effect");
}

function reverse(player) {
  return player === -1 ? 1 : -1;
}
