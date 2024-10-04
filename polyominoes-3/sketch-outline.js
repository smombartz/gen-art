let margin, squareSize, width, height, cols, rows, gridOffset, polyominoes;
let gridStrokeWeight, gridStroke, gridBackground;
let outlineColor, outlineStrokeWeight;
let points = [];
let canvas;

function setup() {
  // Initialize the variables with default values
  initializeVariables();

  canvas = createCanvas(width + margin * 2, height + margin * 2, SVG);
  canvas.parent("canvasContainer");

  // Create a button to download the SVG
  let downloadButton = createButton('Download as SVG');
  downloadButton.mousePressed(downloadSVG);
  downloadButton.parent("buttonContainer");

  // Add event listener to the generate button
  document.getElementById("generateButton").addEventListener("click", generateGrid);

  generateGrid(); // Initial grid generation
}

function initializeVariables() {
  margin = parseInt(document.getElementById('margin').value);
  squareSize = parseInt(document.getElementById('squareSize').value);
  width = parseInt(document.getElementById('width').value);
  height = parseInt(document.getElementById('height').value);
  cols = Math.floor(width / squareSize);
  rows = Math.floor(height / squareSize);
  gridOffset = parseInt(document.getElementById('gridOffset').value);
  polyominoes = parseInt(document.getElementById('polyominoes').value);
  
  gridStrokeWeight = parseInt(document.getElementById('gridStrokeWeight').value);
  gridStroke = document.getElementById('gridStroke').value;
  gridBackground = document.getElementById('gridBackground').value;
  
  outlineColor = document.getElementById('outlineColor').value;
  outlineStrokeWeight = parseInt(document.getElementById('outlineStrokeWeight').value);
}

function generatePoints() {
  points = [];
  for (let i = 0; i <= cols; i++) {
    let row = [];
    for (let j = 0; j <= rows; j++) {
      let x = margin + i * squareSize + random(-gridOffset, gridOffset);
      let y = margin + j * squareSize + random(-gridOffset, gridOffset);
      row.push({ x: x, y: y });
    }
    points.push(row);
  }
}

function drawGrid() {
  background(gridBackground); // Use gridBackground
  stroke(gridStroke); // Use gridStroke color
  strokeWeight(gridStrokeWeight); // Use gridStrokeWeight
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

function outlineSelectedCells(selectedCells) {
  stroke(outlineColor); // Use outlineColor
  strokeWeight(outlineStrokeWeight); // Use outlineStrokeWeight
  noFill();

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

function edgesEqual(edge1, edge2) {
  return (edge1.x1 === edge2.x1 && edge1.y1 === edge2.y1 && edge1.x2 === edge2.x2 && edge2.y2 === edge1.y2) ||
         (edge1.x1 === edge2.x2 && edge1.y1 === edge2.y2 && edge1.x2 === edge2.x1 && edge1.y2 === edge2.y1);
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
  initializeVariables();
  resizeCanvas(width + margin * 2, height + margin * 2); // Adjust the canvas size
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
        let selectedCells = findAdjacentSquares(currentCell, polyominoes, allSelectedCells);
        outlineSelectedCells(selectedCells);
        // Add selected cells to the list of all selected cells
        allSelectedCells = allSelectedCells.concat(selectedCells);
      }
    }
  }
}
