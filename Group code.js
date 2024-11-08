// Global variables
let mainRadius = 120; // Radius of the main circle
  let numCircles = 280; // This works well for screens up to 98 inches in size
  let spacingX = mainRadius * 2 + 10; // Ensure circles are at least 10px apart horizontally
  let spacingY = mainRadius * 2 + 10; // Ensure circles are spaced vertically based on their size + extra space
  let startX = 100; // Starting x position cutting the first circlePattern, which makes it harder to notice the diagonal column design
  let startY = 100; // Starting y position to accommodate multiple rows
  let yStep = -20; // Prevents patterns from being built in a straight line vertically
  let xStep = 50; // Prevents patterns from being built in a straight line horizontally

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);  // Set colour mode to HSB
  background('teal');

  // Loop to draw the patterns at different x and y positions
  for (let i = 0; i < numCircles; i++) {
    let row = floor(i / 49); // Creates 49 circles per row, rounding the number down
    let col = i - row * 49; // Calculate the column position
    let x = startX + col * spacingX - row * xStep; // Shift x position for each row
    let y = startY + row * spacingY + col * yStep; // Adjust y position based on the row, adding vertical space

    // Random HSB colour for the dotted circle
    let hue = random(360);
    let saturation = random(50, 100);
    let brightness = random(80, 100);

    // Only 1 out of 9 circles will have the zigzag pattern. Used ChatGPT, see appendix.
    let isZigzag = (i % 9 === 0); // Every 9th circle is zigzag

    let pattern = new CirclePattern(x, y, mainRadius, hue, saturation, brightness, isZigzag);
    pattern.draw(); // Draw each circle pattern
  }
}

class CirclePattern {
  constructor(x, y, mainRadius, hue, saturation, brightness, isZigzag) {
    this.x = x; // x position of the pattern center
    this.y = y; // y position of the pattern center
    this.mainRadius = mainRadius; // Radius of the circle
    this.hue = hue; // Pre-generated hue for all dots in this circle
    this.saturation = saturation; // Pre-generated saturation for all dots
    this.brightness = brightness; // Pre-generated brightness for all dots
    this.isZigzag = isZigzag; // Boolean to decide whether to draw zigzag or dots

    // Predefined colours: black, purple, red, blue, dark green, orange
    let predefinedColors = [
      color(0, 0, 0), // Black
      color(280, 100, 100), // Purple
      color(0, 100, 100), // Red
      color(210, 100, 100), // Blue
      color(120, 100, 50), // Dark Green
      color(30, 100, 100) // Orange
    ];

    // Randomly select three colours from predefined colours
    this.innerColors = shuffle(predefinedColors).slice(0, 3);
  }

  drawDotsInCircle() {
    let numRings = 15; // Number of concentric rings of dots
    let dotSize = 5; // Size of dots

    // Draw concentric rings of dots
    for (let ring = 1; ring < numRings; ring++) {
      let radius = ring * this.mainRadius / numRings; // Selecting the radius of each ring
      let numDots = floor(TWO_PI * radius / (dotSize * 1.2)); // Number of dots for the ring with some spacing

      for (let i = 0; i < numDots; i++) {
        let angle = i * TWO_PI / numDots;
        let dotX = this.x + radius * cos(angle); // X position for the dot
        let dotY = this.y + radius * sin(angle); // Y position for the dot

        noStroke();
        fill(this.hue, this.saturation, this.brightness);
        circle(dotX, dotY, dotSize); // Draw the dot
      }
    }
  }

  drawZigzagPattern() {
    let outerRadius = this.mainRadius * 0.9; // Outer radius of zigzag, so that it doesn't go past the rim of the yellow circle
    let innerRadius = outerRadius * 2 / 3; // Inner rim at 2/3 of the outer radius

    // Draw the yellow-filled circle
    fill('yellow');
    noStroke();
    circle(this.x, this.y, this.mainRadius * 2); // Circle with yellow fill

    // Set up the red zigzag line
    stroke('red');
    strokeWeight(3);

    let angle = 0; // Initial angle
    let angleStep = radians(3); // Angle step of 3 degrees in radians
    let numZigzags = 120; // Number of zigzag segments

    beginShape();

    for (let i = 0; i < numZigzags; i++) {
      // Line from inner rim to outer rim
      let innerX = this.x + innerRadius * cos(angle); // X position on the inner rim
      let innerY = this.y + innerRadius * sin(angle); // Y position on the inner rim
      vertex(innerX, innerY); // Draw to the inner rim

      // Update angle for the next step
      angle += angleStep;

      // Line from outer rim back to inner rim at a new angle
      let outerX = this.x + outerRadius * cos(angle); // X position on the outer rim
      let outerY = this.y + outerRadius * sin(angle); // Y position on the outer rim
      vertex(outerX, outerY); // Draw from outer rim to inner rim

      // Update angle for the next iteration
      angle += angleStep;
    }

    endShape();
  }

  drawInnerCircles() {
    let smallRadius = 15; // Starting radius of the smallest inner circle
    let numCircles = 9; // Number of circles around the inner circle

    // Draw the smallest gold circle at the center
    fill("gold");
    noStroke();
    circle(this.x, this.y, smallRadius * 2);

    // Draw 9 circles with increasing radius, same center
    strokeWeight(6);
    noFill(); // No fill for the circles around the smallest inner circle

    // Alternate between the three chosen colours, out of the six predefined colours
    for (let i = 0; i < numCircles; i++) {
      let currentRadius = smallRadius + i * 5; // Increase radius for each circle
      stroke(this.innerColors[i % 3]);  // Alternate between the three chosen colours, used ChatGPT, see appendix.
      circle(this.x, this.y, currentRadius * 2);  // Draw each circle
    }
  }

  draw() {
    if (this.isZigzag) {
      this.drawZigzagPattern(); // Draw the zigzag pattern
    } else {
      this.drawDotsInCircle(); // Draw the circle filled with concentric dot patterns
    }
    this.drawInnerCircles(); // Draw the inner concentric circles with predefined colours
  }

}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('teal');
  setup(); // Redraw circles when window is resized
}
