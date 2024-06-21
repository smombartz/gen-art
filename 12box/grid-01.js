let grid = [];
let path = [];
let gridSize = 40;
let cols, rows;

function setup() {
  createCanvas(800, 800);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  // Create the grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({ x: x * gridSize, y: y * gridSize, used: false });
    }
  }

  // Generate a path of 12 dots
  while (!generatePath(12)) {
    grid.forEach(dot => dot.used = false);
    path = [];
  }

  // Draw the grid
  drawGrid();

  // Draw the path
  drawPath();
}

function drawGrid() {
  background(255);
  fill('#CCC');
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    ellipse(grid[i].x, grid[i].y, 10, 10);
  }
}

function drawPath() {
  fill('#000');
  stroke(0);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape(CLOSE);
}

function generatePath(numDots) {
  let current = grid[floor(random(grid.length))];
  current.used = true;
  path.push(current);

  for (let i = 1; i < numDots; i++) {
    let next = getRandomNeighbor(current);
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

function getRandomNeighbor(dot) {
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
    let neighbor = grid.find(d => d.x === nx && d.y === ny && !d.used && !pathIntersects(dot, { x: nx, y: ny }));
    if (neighbor) neighbors.push(neighbor);
  }

  if (neighbors.length > 0) {
    return random(neighbors);
  } else {
    return null;
  }
}

function pathIntersects(dot1, dot2) {
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
