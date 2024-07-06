let cols, rows;
let w = 20;
let h = 20;
let margin = 40;
let numAdjacentSquares = 6; // Number of adjacent squares to find
let canvas;

function setup() {
  cols = 20;
  rows = 20;
  canvas = createCanvas(w * cols + margin * 2, h * rows + margin * 2, SVG);
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
      stroke(204, 204, 204);
      strokeWeight(1);
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

function outlineSelectedCells(selectedCells) {
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();

  let boundaryEdges = [];

  selectedCells.forEach(cell => {
    let x = cell.col * w + margin;
    let y = cell.row * h + margin;
    let edges = [
      { x1: x, y1: y, x2: x + w, y2: y },
      { x1: x + w, y1: y, x2: x + w, y2: y + h },
      { x1: x + w, y1: y + h, x2: x, y2: y + h },
      { x1: x, y1: y + h, x2: x, y2: y }
    ];
    edges.forEach(edge => {
      if (!boundaryEdges.some(e => edgesEqual(e, edge))) {
        boundaryEdges.push(edge);
      } else {
        boundaryEdges = boundaryEdges.filter(e => !edgesEqual(e, edge));
      }
    });
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
  return (edge1.x1 === edge2.x1 && edge1.y1 === edge2.y1 && edge1.x2 === edge2.x2 && edge1.y2 === edge2.y2) ||
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
  clear();
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
        outlineSelectedCells(selectedCells);
        // Add selected cells to the list of all selected cells
        allSelectedCells = allSelectedCells.concat(selectedCells);
      }
    }
  }
}