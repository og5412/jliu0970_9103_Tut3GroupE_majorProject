
class ParticleSystem {
  constructor(posx, posy) {
    this.particles = [];
    this.ringParticles = [];  // 圆环粒子
    this.maxParticles = 1000000;
    this.generationTime = 10;  // 中心粒子生成的时间：10秒
    this.generationTimer = 0;  // 控制粒子生成的计时器
    this.ringGenerationTime = 10;  // 每个圆环粒子生成时长：10秒
    this.ringGenerationDelays = [3, 6, 9];  // 每个圆环粒子的延迟开始时间
    this.ringRadius = [90, 120, 150];  // 每个圆环的半径
    this.centerX = posx;  // 使用传入的 posx 和 posy
    this.centerY = posy;
    this.hue = random(360)
    this.radius = 60;  // 中心圆的半径
  }

  generateCenterParticles() {
    //console.log(this.particles.length);
    // 生成中间大圆的粒子
    if (this.generationTimer <= this.generationTime && this.particles.length < this.maxParticles) {
      for (let i = 0; i < 2; i++) {
        let angle = random(TWO_PI);
        let r = random(this.radius);
        let x = r * cos(angle);
        let y = r * sin(angle);
        let colorChoice = int(random(2))
        this.particles.push(new Particle(x, y, colorChoice, this.hue));
      }
    }
  }

  generateRingParticles() {
    // 生成多个圆环粒子
    for (let i = 0; i < this.ringGenerationDelays.length; i++) {
      let ringGenerationTimer = this.generationTimer - this.ringGenerationDelays[i]; // 每个圆环的计时器
      if (ringGenerationTimer >= 0 && ringGenerationTimer <= this.ringGenerationTime) {
        // 只有在圆环生成时间内生成
        if (this.ringParticles[i] === undefined) {
          this.ringParticles[i] = []; // 初始化每个圆环
        }
        if (this.ringParticles[i].length < 360) {
          let angle = radians(this.ringParticles[i].length); // 粒子分布
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


    if (merge) {
      this.centerX = lerp(this.centerX, width / 2, 0.08)
      this.centerY = lerp(this.centerY, height / 2, 0.08)
      this.radius = lerp(this.radius, height * 0.2, 0.08)
      for (let i = 0; i < 3; i++) {
        this.ringRadius[i] = lerp(this.ringRadius[i], height * 0.2 * pow(1.3, i + 1), 0.08)
      }
    }
    // 更新和显示中心粒子

    let alpha = map(this.generationTimer, 0, this.generationTime, 0, 255);
    push()
    translate(this.centerX, this.centerY)
    for (let p of this.particles) {
      p.update(this, alpha);
      p.display();
    }
    pop()
    // 更新和显示圆环粒子
    for (let i = 0; i < this.ringParticles.length; i++) {
      for (let p of this.ringParticles[i]) {
        p.update(this);
        p.display();
      }
    }
  }
  merge() {
  }
}


function mousePressed() {
  merge = true
}
class Particle {
  constructor(x, y, type, hue) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.type = type
    this.hue = hue;
    //this.size = random(0.5, 1.5);
    this.size = random(0.5, 2.5);
    this.alpha = 0;
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
  }

  update(particleSystem, alpha) {
    this.alpha = alpha

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
    this.hue = hue;      //this.size = random(0.5, 1.5);
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
    if (this.type == 0) {
      fill(this.hue, 100, 100, this.alpha)
    } else {
      fill(360, this.alpha)
    }
    ellipse(this.x, this.y, this.size);
  }
}

let particleSystems = []
let merge = false
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 255)

  let cols = 4; // 每行 4 个粒子系统
  let rows = 3; // 总共 3 行

  // 计算每个粒子系统的间距
  let xSpacing = windowWidth / cols;
  let ySpacing = windowHeight / rows;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * xSpacing + xSpacing / 2
      let y = row * ySpacing + ySpacing / 2
      particleSystems.push(new ParticleSystem(x, y));
    }
  }

}

function draw() {
  background(0);
  print(frameRate())
  for (let i = 0; i < particleSystems.length; i++) {
    particleSystems[i].update()
    particleSystems[i].display()
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);  // 调整画布大小
  background(0);  // 清空画布
  merge = false

  // 重新计算粒子系统的位置
  let cols = 4; // 每行 4 个粒子系统
  let rows = 3; // 总共 3 行

  // 计算每个粒子系统的间距
  let xSpacing = windowWidth / cols;
  let ySpacing = windowHeight / rows;
  particleSystems = []

  // 使用循环平均分布粒子系统
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * xSpacing + xSpacing / 2
      let y = row * ySpacing + ySpacing / 2
      particleSystems.push(new ParticleSystem(x, y));
    }
  }
}