let particles = [];
let ringParticles = []
let maxParticles = 1000000;
let generationTime = 10
let generationTimer = 0
let ringGenerationTime = 10
let ringGenerationDelays = [5, 10, 15]
let ringRadius = [140, 180, 220]
let centerX, centerY;
let particlesPerFrame = 2
let radius = 100

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  background(0);
}

function draw() {
  generationTimer += deltaTime / 1000;

  if (generationTimer <= generationTime && particles.length < maxParticles) {
    for (let i = 0; i < particlesPerFrame; i++) {
      let angle = random(TWO_PI);
      let r = random(radius);
      let x = centerX + r * cos(angle);
      let y = centerY + r * sin(angle);
      let colorChoice = random([color(255, 0, 0), color(255, 255, 255)]); 
      particles.push(new Particle(x, y, colorChoice));
    }
  }

  for (let i = 0; i < ringGenerationDelays.length; i++) {
    let ringGenerationTimer = generationTimer - ringGenerationDelays[i]
    if (ringGenerationTimer >= 0 && ringGenerationTimer <= ringGenerationTime) {

      if (ringParticles[i] === undefined) {
        ringParticles[i] = []
      }
      
      if (ringParticles[i].length < 360) {
        let angle = radians(ringParticles[i].length)
        let x = centerX + ringRadius[i] * cos(angle);
        let y = centerY + ringRadius[i] * sin(angle);
        let colorChoice = random([color(255, 0, 0), color(255, 255, 255)])
        ringParticles[i].push(new RingParticle(x, y, colorChoice, i));
      }
    }
  }

  background(0);

  for (let p of particles) {
    p.update();
    p.display();
  }

  for (let i = 0; i < ringParticles.length; i++) {
    for (let p of ringParticles[i]) {
      p.update();
      p.display();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.color = color;
    this.size = random(0.5, 1.5);
    this.alpha = 0;
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
  }

  update() {
    this.alpha = map(generationTimer, 0, generationTime, 0, 255);

    let distance = dist(this.x, this.y, centerX, centerY);
    if (distance > radius) {
      let angleToCenter = atan2(centerY - this.y, centerX - this.x);
      let force = map(distance, radius, radius + 50, 0.2, 0);

      this.speedX += cos(angleToCenter) * force;
      this.speedY += sin(angleToCenter) * force;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class RingParticle {
  constructor(x, y, color, ringIndex) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = random(0.5, 1.5);
    this.alpha = 255;
    this.angleSpeed = random(0.01, 0.03);
    this.ringIndex = ringIndex;
  }

  update() {
    let angle = atan2(this.y - centerY, this.x - centerX);
    angle += this.angleSpeed;
    this.x = centerX + ringRadius[this.ringIndex] * cos(angle);
    this.y = centerY + ringRadius[this.ringIndex] * sin(angle);
  }

  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  background(0);
  
  particles = [];
  ringParticles = [];
  generationTimer = 0; 
}