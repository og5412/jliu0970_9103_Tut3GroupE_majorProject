let balls = [];
let rings = [];
let ballInterval = 5;
let ringInterval = 25;
let frameCount = 0;

let rectWidths = [];
let maxWidth = 400;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  generateRandomWidths();
}

function draw() {
  background(255);

  let blackRectWidth = 400;
  let blackRectHeight = 100;

  let colors = [
    color(255),
    color(200),
    color(100),
    color(0)
  ];

  // 绘制背景颜色矩形
  for (let i = 0; i < 4; i++) {
    let x = i * (width / 4);
    fill(colors[i]);
    rect(x, 0, width / 4, height);
  }

  let firstBlackX = (width / 4 - blackRectWidth) / 2;
  drawBlackRect(firstBlackX, height / 4 - blackRectHeight * 2, blackRectWidth, blackRectHeight);

  let secondBlackX = (width / 4) + (width / 4 - blackRectWidth) / 2;
  drawBlackRect(secondBlackX, height / 4 - blackRectHeight * 2, blackRectWidth, blackRectHeight);

  let thirdBlackX = (width / 4) * 2 + (width / 4 - blackRectWidth) / 2;
  drawBlackRect(thirdBlackX, height / 4 - blackRectHeight * 2, blackRectWidth, blackRectHeight);

  strokeWeight(4);
  stroke(0);
  line(0, height / 2, width, height / 2);

  stroke(255);
  line(0, height / 2 + 2, width, height / 2 + 2);

  stroke(150);
  line(0, height / 2 - 2, width, height / 2 - 2);

  stroke(200);
  line(0, height / 2 + 4, width, height / 2 + 4);

  // 控制小球生成在第一个黑色矩形中
  if (frameCount % ballInterval === 0) {
    let ballX = random(firstBlackX, firstBlackX + blackRectWidth);
    let ballY = height / 4 - blackRectHeight * 2 + blackRectHeight / 2;
    balls.push(new Ball(ballX, ballY));
  }

  // 控制透明圆环生成在第二个黑色矩形中
  if (frameCount % ringInterval === 0) {
    let ringX = random(secondBlackX, secondBlackX + blackRectWidth);
    let ringY = height / 4 - blackRectHeight * 2 + blackRectHeight / 2;
    rings.push(new Ring(ringX, ringY));
  }

  // 更新和绘制小球
  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    balls[i].display();

    if (balls[i].y > height) {
      balls.splice(i, 1);
    }
  }

  // 更新和绘制圆环
  for (let i = rings.length - 1; i >= 0; i--) {
    rings[i].update();
    rings[i].display();

    if (rings[i].y > height) {
      rings.splice(i, 1);
    }
  }

  // 绘制从第三个黑色矩形的中间开始的彩色矩形
  let startY = (height / 4 - blackRectHeight * 2) + (blackRectHeight / 2);
  let xOffset = thirdBlackX;

  // 为每个紫色矩形设置不同的颜色
  let rectColors = [
    color(0, 102, 204), // 漂亮的蓝色
    color(0, 204, 204), // 漂亮的青色
    color(255, 153, 51), // 漂亮的橙色
    color(153, 51, 255)  // 随便选择的颜色
  ];

  // 绘制每个矩形
  for (let i = 0; i < 4; i++) {
    fill(rectColors[i]); // 设置矩形颜色
    noStroke(); // 不绘制边框
    rect(xOffset, startY, rectWidths[i], height - startY); // 绘制矩形
    xOffset += rectWidths[i]; // 更新x坐标
  }

  frameCount++;
}

// 自定义绘制黑色矩形的函数
function drawBlackRect(x, y, width, height) {
  fill(0);
  rect(x, y, width, height);
}

// 生成随机宽度
function generateRandomWidths() {
  let totalWidth = 0;
  for (let i = 0; i < 4; i++) {
    let width = random(50, 200);
    rectWidths[i] = width;
    totalWidth += width;
  }

  // 调整宽度以确保总和不超过最大宽度
  let scale = maxWidth / totalWidth;
  for (let i = 0; i < 4; i++) {
    rectWidths[i] *= scale;
  }
}

// 小球类
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.gravity = 0.2;
    this.radius = 10;
  }

  update() {
    this.speed += this.gravity;
    this.y += this.speed;
  }

  display() {
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// 圆环类
class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.gravity = 0.2;
    this.innerRadius = 1;
    this.outerRadius = 50;
  }

  update() {
    this.speed += this.gravity;
    this.y += this.speed;
  }

  display() {
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(this.x, this.y, this.outerRadius * 2);
  }
}
