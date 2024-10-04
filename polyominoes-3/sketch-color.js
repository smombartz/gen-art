let margin = 40; // 40px margin
let squareSize = 20; // Default size of each square in pixels
let width = 800; // Width of the canvas
let height = 800; // Height of the canvas
let cols = width / squareSize;
let rows = height / squareSize;
let offset = 3; // Max offset for randomizing the position
let points = [];
let numAdjacentSquares = 6; // Number of adjacent squares to find
let usedColors = new Set();
let canvas;
let alpha = 150; // Alpha value for fill color
let strokeColor = '#CCC'; // Stroke color for the grid
let strokeWeightGrid = 1; // Stroke weight for the grid
let outlineColor = 'rgba(255, 255, 255, 1)'; // Outline color for the polyominoes
let outlineWeight = 2; // Outline weight for the polyominoes

function setup() {
  canvas = createCanvas(width + margin * 2, height + margin * 2, SVG);
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

function generatePoints() {
  points = [];
  for (let i = 0; i <= cols; i++) {
    let row = [];
    for (let j = 0; j <= rows; j++) {
      let x = margin + i * squareSize + random(-offset, offset);
      let y = margin + j * squareSize + random(-offset, offset);
      row.push({ x: x, y: y });
    }
    points.push(row);
  }
}

function drawGrid() {
  background(255); // Clear the background
  stroke(strokeColor); // Set stroke color for the grid
  strokeWeight(strokeWeightGrid); // Set stroke weight for the grid
  noFill(); // No fill for the rectangles

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = points[i][j].x;
      let y1 = points[i][j].y;
      let x2 = points[i + 1][j].x;
      let y2 = points[i + 1][j].y;
      let x3 = points[i + 1][j + 1].x;
      let y3 = points[i + 1][j + 1].y;
      let x4 = points[i][j + 1].x;
      let y4 = points[i][j + 1].y;
      beginShape();
      vertex(x1, y1);
      vertex(x2, y2);
      vertex(x3, y3);
      vertex(x4, y4);
      endShape(CLOSE);
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

function fillAndOutlineSelectedCells(selectedCells) {
  let selectedColor = generateUniqueColor();
  usedColors.add(selectedColor);

  fill(selectedColor + alpha.toString(16)); // Add alpha value to the fill color
  noStroke(); // Remove the outline stroke for filling
  beginShape();

  selectedCells.forEach(cell => {
    if (cell.col < cols && cell.row < rows) {
      let x1 = points[cell.col][cell.row].x;
      let y1 = points[cell.col][cell.row].y;
      let x2 = points[cell.col + 1][cell.row].x;
      let y2 = points[cell.col + 1][cell.row].y;
      let x3 = points[cell.col + 1][cell.row + 1].x;
      let y3 = points[cell.col + 1][cell.row + 1].y;
      let x4 = points[cell.col][cell.row + 1].x;
      let y4 = points[cell.col][cell.row + 1].y;

      beginShape();
      vertex(x1, y1);
      vertex(x2, y2);
      vertex(x3, y3);
      vertex(x4, y4);
      endShape(CLOSE);
    }
  });
  
  noFill(); // Remove fill for the outline
  stroke(outlineColor); // Red color for the outline
  strokeWeight(outlineWeight); // Set stroke weight for the outline
  let boundaryEdges = [];

  selectedCells.forEach(cell => {
    if (cell.col < cols && cell.row < rows) {
      let x1 = points[cell.col][cell.row].x;
      let y1 = points[cell.col][cell.row].y;
      let x2 = points[cell.col + 1][cell.row].x;
      let y2 = points[cell.col + 1][cell.row].y;
      let x3 = points[cell.col + 1][cell.row + 1].x;
      let y3 = points[cell.col + 1][cell.row + 1].y;
      let x4 = points[cell.col][cell.row + 1].x;
      let y4 = points[cell.col][cell.row + 1].y;
      let edges = [
        { x1: x1, y1: y1, x2: x2, y2: y2 },
        { x1: x2, y1: y2, x2: x3, y2: y3 },
        { x1: x3, y1: y3, x2: x4, y2: y4 },
        { x1: x4, y1: y4, x2: x1, y2: y1 }
      ];
      edges.forEach(edge => {
        if (!boundaryEdges.some(e => edgesEqual(e, edge))) {
          boundaryEdges.push(edge);
        } else {
          boundaryEdges = boundaryEdges.filter(e => !edgesEqual(e, edge));
        }
      });
    }
  });

  beginShape();
  boundaryEdges.forEach(edge => {
    line(edge.x1, edge.y1, edge.x2, edge.y2);
  });
  endShape();
}

function edgesEqual(edge1, edge2) {
  return (edge1.x1 === edge2.x1 && edge1.y1 === edge2.y1 && edge1.x2 === edge2.x2 && edge1.y2 === edge2.y2) ||
         (edge1.x1 === edge2.x2 && edge1.y1 === edge2.y2 && edge1.x2 === edge2.x1 && edge1.y2 === edge2.y1);
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
  generatePoints();
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
      fillAndOutlineSelectedCells(selectedCells);
      // Add selected cells to the list of all selected cells
      allSelectedCells = allSelectedCells.concat(selectedCells);
      }
    }
  }
}
