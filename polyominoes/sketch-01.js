let strokeColor;
let strokeWeightValue;
let colors;
let gridSize;
let canvasSize;
let currentX;
let currentY;
let shapeLimit; // Variable to control the shapes used

function setup() {
  // Define variables
  strokeColor = color('#FFFFFF'); // White stroke color
  strokeWeightValue = 2; // Stroke weight for inner lines
  gridSize = 40; // Size of each cell in the grid
  canvasSize = 400; // Canvas size
  currentX = 0;
  currentY = 0;
  shapeLimit = 5; // Variable to control the shapes used (1-5)

  createCanvas(canvasSize, canvasSize, SVG); // Create an SVG canvas of specified size
  noLoop(); // Ensure draw() is only called once

  // Define an array of colors in hexadecimal format and set their alpha values
  colors = [
    color('#FFB6C1'), // Light Pink
    color('#F0E68C'), // Khaki
    color('#90EE90'), // Light Green
    color('#ADD8E6'), // Light Blue
    color('#DDA0DD'), // Plum
    color('#FF69B4')  // Hot Pink
  ];

  // Set alpha values for each color
  for (let i = 0; i < colors.length; i++) {
    colors[i].setAlpha(180); // Set alpha value to 180 for each color
  }
}

function draw() {
  background(255); // Set the background color to white

  // Loop until we fill the entire canvas
  while (currentY < height) {
    // Randomly select a shape type within the allowed range
    let shapeType = int(random(shapeLimit));
    let c = random(colors); // Randomly select a color from the colors array

    // Draw the shape
    fill(c); // Set the fill color with alpha
    stroke(strokeColor); // Set the stroke color for inner lines
    strokeWeight(strokeWeightValue); // Set the stroke weight for inner lines
    drawShape(currentX, currentY, shapeType, gridSize);

    // Update the currentX and currentY position
    if (shapeType === 0 && currentX + gridSize <= width) {
      currentX += gridSize; // Move to the next position
    } else if (shapeType === 1 && currentX + gridSize * 2 <= width) {
      currentX += gridSize * 2; // Move to the next position
    } else if (shapeType === 2 && currentX + gridSize * 3 <= width) {
      currentX += gridSize * 3; // Move to the next position
    } else if (shapeType === 3 && currentX + gridSize * 4 <= width) {
      currentX += gridSize * 4; // Move to the next position
    } else if (shapeType === 4 && currentX + gridSize * 5 <= width) {
      currentX += gridSize * 5; // Move to the next position
    } else {
      // If there's not enough space in the current row, move to the next row
      currentX = 0;
      currentY += gridSize;
    }
  }

  // Save the canvas as an SVG file
  // save("polyominoes.svg");
}

// Function to draw the shape
function drawShape(x, y, shapeType, size) {
  if (shapeType === 0) {
    drawSquare(x, y, size); // Draw a Square
  } else if (shapeType === 1) {
    drawDomino(x, y, size); // Draw a Domino
  } else if (shapeType === 2) {
    drawTromino(x, y, size); // Draw a Tromino
  } else if (shapeType === 3) {
    drawTetromino(x, y, size); // Draw a Tetromino
  } else if (shapeType === 4) {
    drawPentomino(x, y, size); // Draw a Pentomino
  }
}