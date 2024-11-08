class ParticleSystem {
  constructor(posx, posy) {
    this.particles = [];
    this.ringParticles = []
    this.maxParticles = 1000000;
    this.generationTime = 10
    this.generationTimer = 0
    this.ringGenerationTime = 10;
    this.ringGenerationDelays = [3, 6, 9]
    this.ringRadius = [90, 120, 150]
    this.centerX = posx
    this.centerY = posy;
    this.hue = random(360)
    this.radius = 60;
  }

  generateCenterParticles() {
    //check timer and make sure the number of particles is not over the limit
    if (this.generationTimer <= this.generationTime && this.particles.length < this.maxParticles) {
      for (let i = 0; i < 2; i++) {//2 particles every time
        let angle = random(TWO_PI);
        let r = random(this.radius);
        let x = r * cos(angle);
        let y = r * sin(angle);
        let colorChoice = int(random(2))//set color randomly 1 or 2
        this.particles.push(new Particle(x, y, colorChoice, this.hue));
      }
    }
  }

  generateRingParticles() {
    for (let i = 0; i < this.ringGenerationDelays.length; i++) {
      let ringGenerationTimer = this.generationTimer - this.ringGenerationDelays[i];// timer
      if (ringGenerationTimer >= 0 && ringGenerationTimer <= this.ringGenerationTime) {
        // make it spawn in certain time
        if (this.ringParticles[i] === undefined) {
          this.ringParticles[i] = [];// reseet rings
        }
        if (this.ringParticles[i].length < 360) {
          let angle = radians(this.ringParticles[i].length)
          let x = this.centerX + this.ringRadius[i] * cos(angle);
          let y = this.centerY + this.ringRadius[i] * sin(angle);
          let colorChoice = int(random(2))
          this.ringParticles[i].push(new RingParticle(x, y, colorChoice, this.hue, i));
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
    let alpha = map(this.generationTimer, 0, this.generationTime, 0, 255);
    push()
    translate(this.centerX, this.centerY)
    for (let p of this.particles) {
      p.update(this, alpha);
      p.display();
    }
    pop()

    for (let i = 0; i < this.ringParticles.length; i++) {
      for (let p of this.ringParticles[i]) {
        p.update(this);
        p.display();
      }
    }
  }

  merge() {
    // after they merged together, calculate the center location and radius
    this.centerX = lerp(this.centerX, width / 2, 0.03)
    this.centerY = lerp(this.centerY, height / 2, 0.03)
    this.radius = lerp(this.radius, height * 0.2, 0.03)
    for (let i = 0; i < 3; i++) {
      this.ringRadius[i] = lerp(this.ringRadius[i], height * 0.2 * pow(1.3, i + 1), 0.08)
    }

    // delete some particles for storage
    if (merge > 0.9) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].alpha < 2) {
          this.particles.splice(i, 1)
        }
      }
      for (let i = 0; i < this.ringParticles.length; i++) {
        for (let j = this.ringParticles[i].length - 1; j >= 0; j--) {
          if (this.ringParticles[i].alpha < 2) {
            this.ringParticles[i].splice(j, 1)
          }
        }
      }
    }
  }
  changeCol(hue) {
    for (let p of this.particles) {
      if (p.type == 0) {
        p.hue = hue
      }
    }
    for (let i = 0; i < this.ringParticles.length; i++) {
      for (let p of this.ringParticles[i]) {
        if (p.type == 0) {
          p.hue = hue
        }
      }
    }
  }
}


class Particle {
  constructor(x, y, type, hue) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.type = type
    this.hue = hue;
    this.size = random(0.5, 2.5);
    this.alpha = 0;
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
    this.delete = false
    if (random(1) < 0.15) {
      this.delete = true
    }
  }

  update(particleSystem, alpha) {
    if (isMerge && this.delete && merge > 0.95) {
      this.alpha = lerp(this.alpha, 0, 0.1)
    } else {
      this.alpha = alpha
    }

    let distance = dist(this.x, this.y, 0, 0);
    if (distance > particleSystem.radius) {
      let angleToCenter = atan2(- this.y, - this.x);
      let force = map(distance, particleSystem.radius, particleSystem.radius + 50, 0.6, 0);
      this.speedX += cos(angleToCenter) * force;
      this.speedY += sin(angleToCenter) * force;
    }
    this.x += this.speedX;
    this.y += this.speedY;
  }

  display() {
    noStroke();
    if (this.type == 0) {
      fill(this.hue, 100, 100, this.alpha)
    } else {
      fill(360, this.alpha)
    }
    ellipse(this.x, this.y, this.size);
  }
}



class RingParticle {
  constructor(x, y, type, hue, ringIndex) {
    this.x = x;
    this.y = y;
    this.type = type
    this.hue = hue;
    this.size = random(1.5, 3.5);
    this.alpha = 255;
    this.angleSpeed = random(0.01, 0.03);
    this.ringIndex = ringIndex;
    this.delete = false
    if (random(1) < 0.3) {
      this.delete = true
    }
  }

  update(particleSystem) {
    if (isMerge && this.delete && merge > 0.95) {
      this.alpha = lerp(this.alpha, -10, 0.1)
    }
    let angle = atan2(this.y - particleSystem.centerY, this.x - particleSystem.centerX);
    angle += this.angleSpeed;
    this.x = particleSystem.centerX + particleSystem.ringRadius[this.ringIndex] * cos(angle);
    this.y = particleSystem.centerY + particleSystem.ringRadius[this.ringIndex] * sin(angle);
  }

  display() {
    noStroke();
    if (this.type == 0) {
      fill(this.hue, 100, 100, this.alpha)
    } else {
      fill(360, this.alpha)
    }
    ellipse(this.x, this.y, this.size);
  }
}

let particleSystems = []
let isMerge = false
let merge = 0// status of merging, 0 means false 1 means true
let mergeTime, changeColTime
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255)
  reset()
}

function draw() {
  background(0);
  if (millis() - mergeTime > 30 * 1000) {//how long will take before merging(30 seconds now)
    isMerge = true
    if (merge > 0.98) {
      if (changeColTime == -1) { changeColTime = millis() }
      if (millis() - changeColTime > 1000) {
        // if the time over 1 second, color will change
        changeColTime = millis()
        let hue = random(360)
        for (let i = 0; i < particleSystems.length; i++) {
          particleSystems[i].changeCol(hue)
        }
      }
    }
    if (millis() - mergeTime > 45 * 1000) { //after 45seconds, reset the canva
      reset()
    }
  }
  for (let i = 0; i < particleSystems.length; i++) {
    if (isMerge) {
      particleSystems[i].merge()
    }
    particleSystems[i].update()
    particleSystems[i].display()
  }
  if (isMerge) {
  // Calculate for the status of merging
    merge = lerp(merge, 1, 0.03)
  }

}
function reset() {
  background(0)

  // calculate the location
  let cols = 4
  let rows = 3

  // calculate the space between particle systems(circles)
  let xSpacing = windowWidth / cols;
  let ySpacing = windowHeight / rows;
  particleSystems = []

  // use for loop to set particle systems(circles) in average
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * xSpacing + xSpacing / 2
      let y = row * ySpacing + ySpacing / 2
      particleSystems.push(new ParticleSystem(x, y));
    }
  }
  changeColTime = -1
  isMerge = false
  mergeTime = millis()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  reset()
}