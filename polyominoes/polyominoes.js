// Function to draw a single square
function drawSquare(x, y, size) {
  rect(x, y, size, size); // Draw the square
}

// Function to draw a Domino
function drawDomino(x, y, size) {
  rect(x, y, size, size); // Draw the first cell
  rect(x + size, y, size, size); // Draw the second cell
}

// Function to draw a Tromino
function drawTromino(x, y, size) {
  let orientation = int(random(2)); // Randomly select orientation (0: Horizontal, 1: Vertical)
  if (orientation === 0) { // Horizontal Tromino
    rect(x, y, size, size); // Draw the first cell
    rect(x + size, y, size, size); // Draw the second cell
    rect(x + size * 2, y, size, size); // Draw the third cell
  } else { // Vertical Tromino
    rect(x, y, size, size); // Draw the first cell
    rect(x, y + size, size, size); // Draw the second cell
    rect(x, y + size * 2, size, size); // Draw the third cell
  }
}

// Function to draw a Tetromino
function drawTetromino(x, y, size) {
  let shapeType = int(random(3)); // Randomly select a Tetromino shape (0: Line, 1: Square, 2: L-shape)
  if (shapeType === 0) { // Line Tetromino
    rect(x, y, size, size); // Draw the first cell
    rect(x + size, y, size, size); // Draw the second cell
    rect(x + size * 2, y, size, size); // Draw the third cell
    rect(x + size * 3, y, size, size); // Draw the fourth cell
  } else if (shapeType === 1) { // Square Tetromino
    rect(x, y, size, size); // Draw the first cell
    rect(x + size, y, size, size); // Draw the second cell
    rect(x, y + size, size, size); // Draw the third cell
    rect(x + size, y + size, size, size); // Draw the fourth cell
  } else if (shapeType === 2) { // L-shape Tetromino
    rect(x, y, size, size); // Draw the first cell
    rect(x, y + size, size, size); // Draw the second cell
    rect(x, y + size * 2, size, size); // Draw the third cell
    rect(x + size, y + size * 2, size, size); // Draw the fourth cell
  }
}

// Function to draw a Pentomino
function drawPentomino(x, y, size) {
  let shapeType = int(random(2)); // Randomly select a Pentomino shape (0: Line, 1: L-shape)
  if (shapeType === 0) { // Line Pentomino
    rect(x, y, size, size); // Draw the first cell
    rect(x + size, y, size, size); // Draw the second cell
    rect(x + size * 2, y, size, size); // Draw the third cell
    rect(x + size * 3, y, size, size); // Draw the fourth cell
    rect(x + size * 4, y, size, size); // Draw the fifth cell
  } else if (shapeType === 1) { // L-shape Pentomino
    rect(x, y, size, size); // Draw the first cell
    rect(x, y + size, size, size); // Draw the second cell
    rect(x, y + size * 2, size, size); // Draw the third cell
    rect(x, y + size * 3, size, size); // Draw the fourth cell
    rect(x + size, y + size * 3, size, size); // Draw the fifth cell
  }
}