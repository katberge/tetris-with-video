document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    // creates an array of all the boxes (each one is a div) in the grid
    let squares = Array.from(document.querySelectorAll(".grid div")); 
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-button")
    // creates varible for the width of the grid
    const width = 10;

    //the tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width, width * 2, width * 2 + 1],
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
            squares[currentPosition + i].classList.add('tetromino')
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(i => {
            squares[currentPosition + i].classList.remove('tetromino')
        })
    }

    // assign keycodes to functions 
    function control(e) {
        if (e.keyCode == 37) {
            moveLeft();
        } 
        if (e.keyCode == 38) {
            rotate();
        } 
        if (e.keyCode == 39) {
            moveRight();
        }
        if (e.keyCode == 40) {
            moveDown();
        }
     }
     document.addEventListener("keyup", control);

    // makes Tetrominos move down every second
    const timerId = setInterval(moveDown, 1000);
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
            random = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    // move Tetromino left (unless there is an edge or block) 
    function moveLeft() {
        undraw();
        const atLeftEdge = current.some(i => (currentPosition + i) % width == 0);
        if (!atLeftEdge) {
            currentPosition -= 1;
        }
        if (current.some(i => squares[currentPosition + i].classList.contains("taken"))) {
            current += 1;
        }
        draw();
    }

    // move Tetromino right (unless there is an edge or block) 
    function moveRight() {
        undraw();
        const atRightEdge = current.some(i => (currentPosition + i + 1) % width == 0)
        if (!atRightEdge) {
            currentPosition += 1;
        }
        if (current.some(i => squares[currentPosition + i].classList.contains("taken"))) {
            current -= 1;
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
        draw();
    }
})