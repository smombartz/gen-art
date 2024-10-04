let blobs = [];
let canvasSize = 400;

function setup() {
  createCanvas(canvasSize, canvasSize);
  noLoop();
  generateBlobs();
}

function draw() {
  background(255);
  blobs.forEach(blob => {
    fill(blob.color);
    drawBlob(blob);
  });
}

function drawBlob(blob) {
  beginShape();
  let angleStep = TWO_PI / 100;
  for (let angle = 0; angle < TWO_PI; angle += angleStep) {
    let xOff = cos(angle) * blob.radius;
    let yOff = sin(angle) * blob.radius;
    let r = blob.radius + noise(blob.x + xOff, blob.y + yOff) * 20;
    let x = blob.x + cos(angle) * r;
    let y = blob.y + sin(angle) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function generateBlobs() {
  let maxRadius = 50;
  let minRadius = 20;
  let padding = 10;
  let y = 0;

  while (y + maxRadius < canvasSize) {
    let x = 0;
    while (x + maxRadius < canvasSize) {
      let radius = random(minRadius, maxRadius);
      let blob = createBlobAt(x + radius, y + radius, radius);

      if (!doesBlobOverlap(blob) && isBlobInsideCanvas(blob)) {
        blobs.push(blob);
        x += 2 * radius + padding;
      } else {
        x += maxRadius + padding;
      }
    }
    y += maxRadius + padding;
  }
}

function createBlobAt(centerX, centerY, radius) {
  return {
    x: centerX,
    y: centerY,
    radius: radius,
    color: color(random(255), random(255), random(255))
  };
}

function doesBlobOverlap(newBlob) {
  for (let blob of blobs) {
    let distance = dist(newBlob.x, newBlob.y, blob.x, blob.y);
    if (distance < newBlob.radius + blob.radius + 10) { // 10 is the padding
      return true;
    }
  }
  return false;
}

function isBlobInsideCanvas(blob) {
  return (
    blob.x - blob.radius >= 0 &&
    blob.x + blob.radius <= canvasSize &&
    blob.y - blob.radius >= 0 &&
    blob.y + blob.radius <= canvasSize
  );
}

function isCanvasFilled() {
  // Check if the canvas is filled by attempting to place a new blob
  let testBlob = createBlob();
  return doesBlobOverlap(testBlob);
}