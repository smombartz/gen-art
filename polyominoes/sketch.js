let strokeColor;
let strokeWeightValue;
let colors;
let gridSize;
let canvasSize;
let shapeLimit; // Variable to control the shapes used
let shapes = [];
let occupancyGrid;

function setup() {
  // Define variables
  strokeColor = color('#FFFFFF'); // White stroke color
  strokeWeightValue = 2; // Stroke weight for inner lines
  gridSize = 40; // Size of each cell in the grid
  canvasSize = 400; // Canvas size
  shapeLimit = 5; // Variable to control the shapes used (1-5)

  createCanvas(canvasSize, canvasSize, 'svg'); // Create an SVG canvas of specified size
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
    colors[i].setAlpha(100); // Set alpha value to 100 for each color
  }

  generateShapes();
  shuffle(shapes, true);
  createOccupancyGrid();
  fitShapesOnCanvas();

  createDownloadLink();
}

function generateShapes() {
  for (let i = 0; i < shapeLimit; i++) {
    for (let j = 0; j < 10; j++) { // Generate 10 shapes of each type for simplicity
      let c = random(colors);
      shapes.push({ type: i, color: c });
    }
  }
}

function createOccupancyGrid() {
  occupancyGrid = Array(floor(canvasSize / gridSize)).fill().map(() => Array(floor(canvasSize / gridSize)).fill(false));
}

function fitShapesOnCanvas() {
  for (let shape of shapes) {
    let placed = false;
    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        if (!isOccupied(x, y, shape.type)) {
          placeShape(x, y, shape);
          fill(shape.color); // Set the fill color with alpha
          stroke(strokeColor); // Set the stroke color for inner lines
          strokeWeight(strokeWeightValue); // Set the stroke weight for inner lines
          drawShape(x, y, shape.type, gridSize);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }
}

function isOccupied(x, y, shapeType) {
  let shapeCells = getShapeCells(x, y, shapeType);
  for (let cell of shapeCells) {
    let gridX = cell.x / gridSize;
    let gridY = cell.y / gridSize;
    if (gridX >= occupancyGrid.length || gridY >= occupancyGrid[0].length || occupancyGrid[gridX][gridY]) {
      return true;
    }
  }
  return false;
}

function placeShape(x, y, shape) {
  let shapeCells = getShapeCells(x, y, shape.type);
  for (let cell of shapeCells) {
    let gridX = cell.x / gridSize;
    let gridY = cell.y / gridSize;
    occupancyGrid[gridX][gridY] = true;
  }
}

function getShapeCells(x, y, shapeType) {
  let cells = [];
  switch (shapeType) {
    case 0:
      cells.push({ x: x, y: y }); // Square
      break;
    case 1:
      cells.push({ x: x, y: y }, { x: x + gridSize, y: y }); // Domino
      break;
    case 2:
      cells.push({ x: x, y: y }, { x: x + gridSize, y: y }, { x: x + 2 * gridSize, y: y }); // Tromino
      break;
    case 3:
      cells.push({ x: x, y: y }, { x: x + gridSize, y: y }, { x: x + 2 * gridSize, y: y }, { x: x + 3 * gridSize, y: y }); // Tetromino
      break;
    case 4:
      cells.push({ x: x, y: y }, { x: x + gridSize, y: y }, { x: x + 2 * gridSize, y: y }, { x: x + 3 * gridSize, y: y }, { x: x + 4 * gridSize, y: y }); // Pentomino
      break;
  }
  return cells;
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

function createDownloadLink() {
  let svgElement = document.querySelector('svg');
  let serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  let blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  let url = URL.createObjectURL(blob);

  let downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
}