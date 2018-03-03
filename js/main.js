'use strict';

window.Settings = {
  branchColor: '#000000',
  nest: 5,
  radius: 350,
  strutFactor: 0.25,
  strutTarget: 3,
  subStrutTarget: 3,
  numSides: 5,
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class FractalRoot {
  constructor() {
    this.points = [];
    var centerX = width / 2;
    var centerY = height / 2;
    var angleStep = 360 / Settings.numSides;
    var count = 0;
    for (var i = -90; i < 270; i += angleStep) {
      this.points[count] = new Point(
        centerX + (Settings.radius * cos(radians(i))),
        centerY + (Settings.radius * sin(radians(i))),
      )
      count++;
    }
    this.rootBranch = new Branch(0, 0, this.points);
  }

  drawShape() {
    this.rootBranch.draw();
  }
}

class Branch {
  constructor(level, num, points) {
    this.level = level;
    this.num = num;
    this.outerPoints = points;
    this.midPoints = this.calcMidPoints();
    this.strutFactor = Settings.strutFactor;
    this.projPoints = this.calcStrutPoints();
    this.maxLevel = Settings.nest;

    if (level + 1 < this.maxLevel) {
      var childBranch = new Branch(level + 1, 0, this.projPoints);
      childBranch.draw();
      //
      for (var k = 0; k < this.outerPoints.length; k++) {
        var kNext = (k - 1 + this.outerPoints.length) % this.outerPoints.length;
        var newPoints = [
          this.projPoints[k], this.midPoints[k], this.outerPoints[k],
          this.midPoints[kNext], this.projPoints[kNext],
        ];
        var subChildBranch = new Branch(level + 1, k + 1, newPoints);
        subChildBranch.draw();
      }
    }
  }

  draw() {
    var weight = (this.level < 5) ? 5 - this.level : 0.5;
    strokeWeight(weight);
    // draw outer shape
    for (var i = 0; i < this.outerPoints.length; i++) {
      var iNext = (i + 1) % this.outerPoints.length;
      line(this.outerPoints[i].x, this.outerPoints[i].y,
           this.outerPoints[iNext].x, this.outerPoints[iNext].y);
    }
  }

  calcMidPoints() {
    var midPoints = [];
    for (var i = 0; i < this.outerPoints.length; i++) {
      var iNext = (i + 1) % this.outerPoints.length;
      midPoints[i] = this.calcMidPoint(this.outerPoints[i], this.outerPoints[iNext]);
    }
    return midPoints;
  }

  calcMidPoint(end1, end2) {
    var mx = (end1.x > end2.x) ? end2.x + ((end1.x - end2.x) / 2)
                               : end1.x + ((end2.x - end1.x) / 2);
    var my = (end1.y > end2.y) ? end2.y + ((end1.y - end2.y) / 2)
                               : end1.y + ((end2.y - end1.y) / 2);
    return new Point(mx, my);
  }

  calcStrutPoints() {
    var strutPoints = [];
    for (var i = 0; i < this.midPoints.length; i++) {
      var skipNum = (this.num == 0) ? Settings.strutTarget : Settings.subStrutTarget;
      var iNext = (i + skipNum) % this.outerPoints.length;
      strutPoints[i] = this.calcStrutPoint(this.midPoints[i], this.outerPoints[iNext]);
    }
    return strutPoints;
  }

  calcStrutPoint(mp, op) {
    var opp = abs(op.x - mp.x);
    var adj = abs(op.y - mp.y);
    var px  = (op.x > mp.x) ? mp.x + (opp * this.strutFactor)
                            : mp.x - (opp * this.strutFactor);
    var py  = (op.y > mp.y) ? mp.y + (adj * this.strutFactor)
                            : mp.y - (adj * this.strutFactor);
    return new Point(px, py);
  }
}

function setup() {
  createCanvas(800, 800);
  drawFractal();
}

function drawFractal() {
  clear();
  stroke(Settings.branchColor);
  background('rgba(255,255,255,0)');
  var fractalRoot = new FractalRoot();
  fractalRoot.drawShape();
}

function mouseClicked() {
  if (0 <= mouseX && mouseX < width &&
      0 <= mouseY && mouseY < height) {
    drawFractal();
  }
}
