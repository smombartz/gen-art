// Variables
let gridSize = 40;
let lineColor = '#000000';
let lineWeight = 2;
let numberOfShapes = 50;
let backgroundColor = '#FFFFFF';
let dotColor = '#CCCCCC';
let canvasSize = 800;
let numberOfPaths = 14;
let roundedPath = false;
let cornerRadius = 4;
let grid = [];
let paths = [];
let cols, rows;

function setup() {
  createCanvas(canvasSize, canvasSize);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  // Create the grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({ x: x * gridSize, y: y * gridSize, used: false });
    }
  }

  // Generate shapes
  for (let i = 0; i < numberOfShapes; i++) {
    let path = [];
    while (!generatePath(numberOfPaths, path)) {
      grid.forEach(dot => dot.used = false);
      path = [];
    }
    paths.push(path);
  }

  // Draw the grid
  drawGrid();

  // Draw the paths
  paths.forEach(drawPath);
}

function drawGrid() {
  background(backgroundColor);
  fill(dotColor);
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    ellipse(grid[i].x, grid[i].y, 10, 10);
  }
}

function drawPath(path) {
  fill(random(255), random(255), random(255), 150);
  stroke(lineColor);
  strokeWeight(lineWeight);

  if (roundedPath) {
    beginShape();
    for (let i = 0; i < path.length; i++) {
      let prev = path[i - 1] || path[path.length - 1];
      let next = path[i + 1] || path[0];
      let angle = atan2(next.y - prev.y, next.x - prev.x);
      let offsetX = cos(angle) * 5;
      let offsetY = sin(angle) * 5;
      vertex(path[i].x + offsetX, path[i].y + offsetY);
    }
    endShape(CLOSE);
  } else {  beginShape();
    for (let i = 0; i < path.length; i++) {
      let current = path[i];
      let prev = path[i - 1] || path[path.length - 1];
      let next = path[i + 1] || path[0];

      let angle1 = atan2(current.y - prev.y, current.x - prev.x);
      let angle2 = atan2(next.y - current.y, next.x - current.x);

      let offsetX1 = cos(angle1) * cornerRadius;
      let offsetY1 = sin(angle1) * cornerRadius;
      let offsetX2 = cos(angle2) * cornerRadius;
      let offsetY2 = sin(angle2) * cornerRadius;

      vertex(current.x - offsetX1, current.y - offsetY1);
      quadraticVertex(current.x, current.y, current.x + offsetX2, current.y + offsetY2);
    }
    endShape(CLOSE);
  }
}

function generatePath(numDots, path) {
  let current = grid[floor(random(grid.length))];
  current.used = true;
  path.push(current);

  for (let i = 1; i < numDots; i++) {
    let next = getRandomNeighbor(current, path);
    if (next) {
      next.used = true;
      path.push(next);
      current = next;
    } else {
      return false;
    }
  }

  // Ensure the path closes correctly
  let last = path[path.length - 1];
  let first = path[0];
  if (dist(last.x, last.y, first.x, first.y) === gridSize) {
    return true;
  } else {
    return false;
  }
}

function getRandomNeighbor(dot, path) {
  let neighbors = [];
  let directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 }, // up, down
    { x: -1, y: 0 }, { x: 1, y: 0 }, // left, right
    { x: -1, y: -1 }, { x: 1, y: -1 }, // diagonals
    { x: -1, y: 1 }, { x: 1, y: 1 }
  ];

  for (let i = 0; i < directions.length; i++) {
    let nx = dot.x + directions[i].x * gridSize;
    let ny = dot.y + directions[i].y * gridSize;
    let neighbor = grid.find(d => d.x === nx && d.y === ny && !d.used && !pathIntersects(dot, { x: nx, y: ny }, path));
    if (neighbor) neighbors.push(neighbor);
  }

  if (neighbors.length > 0) {
    return random(neighbors);
  } else {
    return null;
  }
}

function pathIntersects(dot1, dot2, path) {
  for (let i = 1; i < path.length; i++) {
    let p1 = path[i - 1];
    let p2 = path[i];
    if (linesIntersect(dot1.x, dot1.y, dot2.x, dot2.y, p1.x, p1.y, p2.x, p2.y)) {
      return true;
    }
  }
  return false;
}

function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }
  return ccw({x: x1, y: y1}, {x: x3, y: y3}, {x: x4, y: y4}) !== ccw({x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}) &&
         ccw({x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}) !== ccw({x: x1, y: y1}, {x: x2, y: y2}, {x: x4, y: y4});
}
