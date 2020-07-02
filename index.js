document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    // creates an array of all the boxes (each one is a div) in the grid
    let squares = Array.from(document.querySelectorAll(".grid div")); 
    const levelDisplay = document.querySelector("#level");
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button");
    const restartBtn = document.querySelector("#restart-button");
    // creates varible for the width of the grid
    const width = 10;
    let nextRandom = 0;
    let timerId = null;
    let score = 0;
    scoreDisplay.innerHTML = score;
    let level = 1;
    let milliseconds = 1000;

    // color asignment for tetrominoes (in order of theTetrominoes array)
    const colors = [
        "red",
        "orange",
        "green",
        "blue",
        "purple"
    ]

    //the tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2, width * 2 + 1],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, tTetromino, zTetromino, oTetromino, iTetromino]

    let currentPosition = 4;
    let currentRotation = 0;
    
    // randomly select Tetromino in its first rotation
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // draw the Tetromino
    function draw() {
        current.forEach(i => {
            squares[currentPosition + i].style.backgroundColor = colors[random]; 
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(i => {
            squares[currentPosition + i].style.backgroundColor = "";
        })
    }

    // assign keycodes to functions 
    function control(e) {
        if (e.keyCode == 37) {
            moveLeft();
        } 
        if (e.keyCode == 39) {
            moveRight();
        }
        if (e.keyCode == 40) {
            moveDown();
        }
     }

     function keyUpControl(e) {
        if (e.keyCode == 38) {
            rotate();
        } 
     }

     document.addEventListener("keydown", control);
     document.addEventListener("keyup", keyUpControl);

    // makes Tetrominos move down every second
    function moveDown() { 
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // make it so Tetrominoes stop at the bottom of the grid
    function freeze() {
        if (current.some(i => squares[currentPosition + i + width].classList.contains("taken"))) {
            current.forEach(i => squares[currentPosition + i].classList.add("taken"));
            // start new Tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // move Tetromino left (unless there is an edge or block) 
    function moveLeft() {
        undraw();
        const atLeftEdge = current.some(i => (currentPosition + i) % width == 0);
        if (!atLeftEdge && !current.some(i => squares[currentPosition + i - 1].classList.contains("taken"))) {
            currentPosition -= 1;
        }
        draw();
    }

    // move Tetromino right (unless there is an edge or block) 
    function moveRight() {
        undraw();
        const atRightEdge = current.some(i => (currentPosition + i + 1) % width == 0);
        if (!atRightEdge && !current.some(i => squares[currentPosition + i + 1].classList.contains("taken"))) {
            currentPosition += 1;
        }
        draw();
    }

    // rotate Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation == current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        while (current.some(i => (currentPosition + i) % width == 0) && current.some(i => (currentPosition + i + 1) % width == 0)) {
            currentPosition--;
        }
        draw();
    }

    // to show next-up Tetromino in the mini grid
    const displaySquares = (document.querySelectorAll(".mini-grid div"));
    const displayWidth = 5;
    const displayIndex = 0;

    // Tetrominoes in the diplay grid (no rotations)
    const upNext = [
        [displayWidth + 1, displayWidth + 2, displayWidth + 3, displayWidth * 2 + 3], // lTetromino
        [displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2, displayWidth * 2 + 3], // tTetromino
        [displayWidth + 2, displayWidth + 3, displayWidth * 2 + 1, displayWidth * 2 + 2], // zTetromino
        [displayWidth + 1, displayWidth + 2, displayWidth * 2+ 1, displayWidth * 2 + 2], // oTetromino
        [2, displayWidth + 2, displayWidth * 2 + 2, displayWidth * 3 + 2] // iTetromino
    ]

    //display Tetromino in minigrid
    function displayShape() {
        displaySquares.forEach(square => {
            // clear the mini-grid
            square.style.backgroundColor = "";
        })
        upNext[nextRandom].forEach(i => {
            displaySquares[displayIndex + i].style.backgroundColor = colors[nextRandom];
        });
    }

    // adds functionality to the start button
    startBtn.addEventListener("click", () => {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener("keydown", control);
            document.removeEventListener("keyup", keyUpControl);
        } else {
            draw();
            timerId = setInterval(moveDown, milliseconds);
            document.addEventListener("keydown", control);
            document.addEventListener("keyup", keyUpControl);
            displayShape();
        }
    })

    // adds functionality to the restart button 
    restartBtn.addEventListener("click", () => {
        location.reload();
    })

    // adds to game score 
    function addScore() {
        for (let i = 0; i <= 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(i => squares[i].classList.contains("taken"))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                // check levelUp functiion when score updates
                levelUp();
                // remove row
                row.forEach(i => {
                    squares[i].classList.remove("taken");
                    squares[i].style.backgroundColor = "";
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // allows levels to change 
    function levelUp() {
        if (score % 100 == 0) {
            level++;
            levelDisplay.innerHTML = level;
            milliseconds /= 1.01;
            timerId = setInterval(moveDown, milliseconds);
        }
    }
        
    // creates a way to lose the game (game over)
    function gameOver() {
        if (current.some(i => squares[currentPosition + i].classList.contains("taken"))) {
            clearInterval(timerId);
            alert("Game Over :(");
            location.reload();
        }
    }
})