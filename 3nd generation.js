class ParticleSystem {
  constructor(posx, posy) {
    this.particles = [];
    this.ringParticles = []
    this.maxParticles = 1000000;
    this.generationTime = 10
    this.generationTimer = 0
    this.ringGenerationTime = 10
    this.ringGenerationDelays = [5, 10, 15]
    this.ringRadius = [90, 120, 150]
    this.centerX = posx
    this.centerY = posy;
    this.particlesPerFrame = 2;
    this.radius = 60
  }

  generateCenterParticles() {
    if (this.generationTimer <= this.generationTime && this.particles.length < this.maxParticles) {
      for (let i = 0; i < this.particlesPerFrame; i++) {
        let angle = random(TWO_PI);
        let r = random(this.radius);
        let x = this.centerX + r * cos(angle);
        let y = this.centerY + r * sin(angle);
        let colorChoice = random([color(255, 0, 0), color(255, 255, 255)]);
        this.particles.push(new Particle(x, y, colorChoice));
      }
    }
  }

  generateRingParticles() {
    for (let i = 0; i < this.ringGenerationDelays.length; i++) {
      let ringGenerationTimer = this.generationTimer - this.ringGenerationDelays[i]
      if (ringGenerationTimer >= 0 && ringGenerationTimer <= this.ringGenerationTime) {

        if (this.ringParticles[i] === undefined) {
          this.ringParticles[i] = []
        }

        if (this.ringParticles[i].length < 360) {
          let angle = radians(this.ringParticles[i].length)
          let x = this.centerX + this.ringRadius[i] * cos(angle);
          let y = this.centerY + this.ringRadius[i] * sin(angle);
          let colorChoice = random([color(255, 0, 0), color(255, 255, 255)]);
          this.ringParticles[i].push(new RingParticle(x, y, colorChoice, i));
        }
      }
    }
  }

  update() {
    this.generationTimer += deltaTime / 1000;
    this.generateCenterParticles();
    this.generateRingParticles();
  }

  display() {
    
    for (let p of this.particles) {
      p.update(this);
      p.display();
    }

    for (let i = 0; i < this.ringParticles.length; i++) {
      for (let p of this.ringParticles[i]) {
        p.update(this);
        p.display();
      }
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
    this.size = random(0.5, 2.5);
    this.alpha = 0;
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
  }

  update(particleSystem) {
    this.alpha = map(particleSystem.generationTimer, 0, particleSystem.generationTime, 0, 255);

    let distance = dist(this.x, this.y, particleSystem.centerX, particleSystem.centerY);
    if (distance > particleSystem.radius) {
      let angleToCenter = atan2(particleSystem.centerY - this.y, particleSystem.centerX - this.x);
      let force = map(distance, particleSystem.radius, particleSystem.radius + 50, 0.2, 0);

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
    this.size = random(1.5, 3.5);
    this.alpha = 255;
    this.angleSpeed = random(0.01, 0.03);
    this.ringIndex = ringIndex;
  }

  update(particleSystem) {
    let angle = atan2(this.y - particleSystem.centerY, this.x - particleSystem.centerX);
    angle += this.angleSpeed;
    this.x = particleSystem.centerX + particleSystem.ringRadius[this.ringIndex] * cos(angle);
    this.y = particleSystem.centerY + particleSystem.ringRadius[this.ringIndex] * sin(angle);
  }

  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

let particleSystem1, particleSystem2,particleSystem3,particleSystem4;
let particleSystem5, particleSystem6,particleSystem7,particleSystem8;
let particleSystem9, particleSystem10,particleSystem11,particleSystem12;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  let cols = 4
  let rows = 3
  
  let xSpacing = windowWidth / cols;
  let ySpacing = windowHeight / rows;
  
  particleSystem1 = new ParticleSystem(xSpacing * 0 + xSpacing / 2, ySpacing * 0 + ySpacing / 2)
  particleSystem2 = new ParticleSystem(xSpacing * 1 + xSpacing / 2, ySpacing * 0 + ySpacing / 2)
  particleSystem3 = new ParticleSystem(xSpacing * 2 + xSpacing / 2, ySpacing * 0 + ySpacing / 2)
  particleSystem4 = new ParticleSystem(xSpacing * 3 + xSpacing / 2, ySpacing * 0 + ySpacing / 2)
  
  particleSystem5 = new ParticleSystem(xSpacing * 0 + xSpacing / 2, ySpacing * 1 + ySpacing / 2)
  particleSystem6 = new ParticleSystem(xSpacing * 1 + xSpacing / 2, ySpacing * 1 + ySpacing / 2)
  particleSystem7 = new ParticleSystem(xSpacing * 2 + xSpacing / 2, ySpacing * 1 + ySpacing / 2)
  particleSystem8 = new ParticleSystem(xSpacing * 3 + xSpacing / 2, ySpacing * 1 + ySpacing / 2)
  
  particleSystem9 = new ParticleSystem(xSpacing * 0 + xSpacing / 2, ySpacing * 2 + ySpacing / 2)
  particleSystem10 = new ParticleSystem(xSpacing * 1 + xSpacing / 2, ySpacing * 2 + ySpacing / 2)
  particleSystem11 = new ParticleSystem(xSpacing * 2 + xSpacing / 2, ySpacing * 2 + ySpacing / 2)
  particleSystem12 = new ParticleSystem(xSpacing * 3 + xSpacing / 2, ySpacing * 2 + ySpacing / 2)
}

function draw() {
  background(0);
  particleSystem1.update();
  particleSystem1.display();
  particleSystem2.update();
  particleSystem2.display();
  particleSystem3.update();
  particleSystem3.display();  
  particleSystem4.update();
  particleSystem4.display();
  
  particleSystem5.update();
  particleSystem5.display();
  particleSystem6.update();
  particleSystem6.display();
  particleSystem7.update();
  particleSystem7.display();  
  particleSystem8.update();
  particleSystem8.display();

  particleSystem9.update();
  particleSystem9.display();
  particleSystem10.update();
  particleSystem10.display();
  particleSystem11.update();
  particleSystem11.display();  
  particleSystem12.update();
  particleSystem12.display();
}