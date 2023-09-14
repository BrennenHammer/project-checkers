const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const backgroundMusic = document.getElementById('backgroundMusic');
const backgroundMusic2 = document.getElementById('backgroundMusic2');
const backgroundMusic3 = document.getElementById('backgroundMusic3');
const countryfiddlesound = document.getElementById("countryfiddlesound")
const musicBack = document.getElementById('musicBack');
const winSound = document.getElementById("winSound");
const movesound = document.getElementById("moveSound");
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const darkModeToggle = document.getElementById("darkModeToggle");

startButton.addEventListener('click', function() {
  startScreen.style.display = 'none';
  startScreen.style.width = '0px';

  // Play the first 5 seconds of musicBack
  musicBack.currentTime = 0;
  musicBack.play();

  // After 5 seconds, pause musicBack and start backgroundMusic
  setTimeout(function() {
      musicBack.pause();
      backgroundMusic.currentTime = 0; // Start from the beginning
      backgroundMusic.play();
  }, 3000); // 5 seconds

  // After 30 seconds, pause backgroundMusic and start backgroundMusic2
  setTimeout(function() {
      backgroundMusic.pause();
      backgroundMusic2.currentTime = 0; // Start from the beginning
      backgroundMusic2.play();
  }, 20000); // 30 seconds

  // After 50 seconds, pause backgroundMusic2 and start backgroundMusic3
  setTimeout(function() {
      backgroundMusic2.pause();
      backgroundMusic3.currentTime = 0; // Start from the beginning
      backgroundMusic3.play();
  }, 35000);
  setTimeout(function() {
    backgroundMusic3.pause();
    countryfiddlesound.currentTime = 0;
    countryfiddlesound.play();
}, 50000);

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
  movesound.currentTime = 0;
  movesound.play()
  movesound.play()
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
function moveImage(img) {
  let dx = (Math.random() - 0.5) * 10;  // change in x direction
  let dy = (Math.random() - 0.5) * 10;  // change in y direction
  
  function animate() {
      let rect = img.getBoundingClientRect();

      // Check collision with vertical container walls
      if (rect.left < winDiv.offsetLeft || rect.right > winDiv.offsetWidth) {
          dx = -dx;
      }
      // Check collision with horizontal container walls
      if (rect.top < winDiv.offsetTop || rect.bottom > winDiv.offsetHeight) {
          dy = -dy;
      }

      img.style.left = (img.offsetLeft + dx) + "px";
      img.style.top = (img.offsetTop + dy) + "px";

      requestAnimationFrame(animate);
  }

  animate();
}

function modalOpen(black) {
  document.getElementById("winner").innerHTML = black === 0 ? "blue" : "Black";
  document.getElementById("loser").innerHTML = black !== 0 ? "blue" : "Black";
  modal.classList.add("effect");
  //moveImage(img1)
  //moveImage(img2)
  setTimeout (function(){
    countryfiddlesound.pause()
    winSound.currentTime = 0
    winSound.play()
  },1000)
};




function modalClose() {
  modal.classList.remove("effect");
}

function reverse(player) {
  return player === -1 ? 1 : -1;
}
function playGame(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];

  let result;

  if (playerChoice === computerChoice) {
      result = "It's a draw!";
  } else {
      switch (playerChoice) {
          case 'rock':
              result = (computerChoice === 'scissors') ? 'Computer wins!' : 'You lose!';
              break;
          case 'paper':
              result = (computerChoice === 'rock') ? 'Computer wins!' : 'You lose!';
              break;
          case 'scissors':
              result = (computerChoice === 'paper') ? 'Computer wins!' : 'You lose!';
              break;
      }
  }

  // Display the result
  document.getElementById('result').textContent = result;

  // If computer wins the RPS, then the player who didn't click wins overall
  if (result === 'Computer wins!') {
      alert('The player who did NOT click wins the overall game!');

  }
}



