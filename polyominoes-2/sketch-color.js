let cols, rows;
let w = 20;
let h = 20;
let margin = 40;
let numAdjacentSquares = 4; // Number of adjacent squares to find
let usedColors = new Set();
let canvas;

function setup() {
  cols = 20;
  rows = 20;
  canvas = createCanvas(600 + margin * 2, 400 + margin * 2, SVG);
  canvas.parent("canvasContainer"); // Parent the canvas to a specific div

  // Create a button to download the SVG
  let downloadButton = createButton('Download as SVG');
  downloadButton.mousePressed(downloadSVG);
  downloadButton.parent("buttonContainer"); // Parent the button to a specific div

  // Create a button to generate the grid again
  let generateButton = createButton('Generate');
  generateButton.mousePressed(generateGrid);
  generateButton.parent("buttonContainer"); // Parent the button to a specific div

  generateGrid(); // Initial grid generation
}

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(255);
      stroke(0);
      rect(i * w + margin, j * h + margin, w, h);
    }
  }
}

function findAdjacentSquares(startCell, n, allSelectedCells) {
  let selectedCells = [];
  let currentCell = startCell;
  selectedCells.push(currentCell);

  for (let i = 0; i < n - 1; i++) {
    let adjacentCells = getAdjacentCells(currentCell, selectedCells, allSelectedCells);
    if (adjacentCells.length > 0) {
      currentCell = random(adjacentCells);
      selectedCells.push(currentCell);
    } else {
      break;
    }
  }
  
  return selectedCells;
}

function fillSelectedCells(selectedCells) {
  let selectedColor = generateUniqueColor();
  usedColors.add(selectedColor);

  fill(selectedColor);
  noStroke(); // Remove the outline stroke
  beginShape();
  selectedCells.forEach(cell => {
    let x = cell.col * w + margin;
    let y = cell.row * h + margin;
    rect(x, y, w, h);
  });
  endShape();
}

function getAdjacentCells(cell, selectedCells, allSelectedCells) {
  let adjacentCells = [];
  let directions = [
    {col: 0, row: -1}, // above
    {col: 0, row: 1},  // below
    {col: -1, row: 0}, // left
    {col: 1, row: 0}   // right
  ];

  directions.forEach(dir => {
    let newCell = {col: cell.col + dir.col, row: cell.row + dir.row};
    if (newCell.col >= 0 && newCell.col < cols && newCell.row >= 0 && newCell.row < rows &&
        !isCellSelected(newCell, selectedCells) && !isCellSelected(newCell, allSelectedCells)) {
      adjacentCells.push(newCell);
    }
  });

  return adjacentCells;
}

function isCellSelected(cell, selectedCells) {
  return selectedCells.some(c => c.col === cell.col && c.row === cell.row);
}

function generateUniqueColor() {
  let color;
  do {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  } while (usedColors.has(color));
  return color;
}

function downloadSVG() {
  let now = new Date();
  let timestamp = now.getFullYear().toString() +
                  String(now.getMonth() + 1).padStart(2, '0') +
                  String(now.getDate()).padStart(2, '0') +
                  String(now.getHours()).padStart(2, '0') +
                  String(now.getMinutes()).padStart(2, '0');
  save(`grid-${timestamp}.svg`);
}

function generateGrid() {
  clear();
  usedColors.clear(); // Clear used colors set
  drawGrid();

  // Array to keep track of selected cells
  let allSelectedCells = [];

  // Loop through all cells in the grid
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let currentCell = {col: i, row: j};

      // Check if the current cell has already been selected
      if (!isCellSelected(currentCell, allSelectedCells)) {
        // Find and outline adjacent squares
        let selectedCells = findAdjacentSquares(currentCell, numAdjacentSquares, allSelectedCells);
        fillSelectedCells(selectedCells);
        // Add selected cells to the list of all selected cells
        allSelectedCells = allSelectedCells.concat(selectedCells);
      }
    }
  }
}