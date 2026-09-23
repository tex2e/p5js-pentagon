'use strict';

window.Settings = {
  branchColor: '#30343B',
  backgroundColor: '#F4F1EA',
  nest: 4,
  radius: 335,
  lineWeight: 2.2,
  strutFactor: 0.25,
  strutTarget: 3,
  subStrutTarget: 3,
  numSides: 5,
};

let branchStyles = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class FractalRoot {
  constructor() {
    const centerX = width / 2;
    const centerY = height / 2;
    const angleStep = 360 / Settings.numSides;
    const points = [];

    for (let i = -90; i < 270; i += angleStep) {
      points.push(new Point(
        centerX + Settings.radius * cos(radians(i)),
        centerY + Settings.radius * sin(radians(i)),
      ));
    }

    this.rootBranch = new Branch(0, 0, points);
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
    this.projPoints = this.calcStrutPoints();
    this.children = [];

    if (level + 1 < Settings.nest) {
      this.children.push(new Branch(level + 1, 0, this.projPoints));

      for (let k = 0; k < this.outerPoints.length; k++) {
        const kNext = (k - 1 + this.outerPoints.length) % this.outerPoints.length;
        const newPoints = [
          this.projPoints[k], this.midPoints[k], this.outerPoints[k],
          this.midPoints[kNext], this.projPoints[kNext],
        ];
        this.children.push(new Branch(level + 1, k + 1, newPoints));
      }
    }
  }

  draw() {
    // Draw the inner structure first so each larger outline stays distinct.
    this.children.forEach((child) => child.draw());

    const style = branchStyles[this.level];
    stroke(style.color);
    strokeWeight(style.weight);

    for (let i = 0; i < this.outerPoints.length; i++) {
      const next = (i + 1) % this.outerPoints.length;
      line(
        this.outerPoints[i].x, this.outerPoints[i].y,
        this.outerPoints[next].x, this.outerPoints[next].y,
      );
    }
  }

  calcMidPoints() {
    return this.outerPoints.map((point, index) => {
      const next = this.outerPoints[(index + 1) % this.outerPoints.length];
      return new Point((point.x + next.x) / 2, (point.y + next.y) / 2);
    });
  }

  calcStrutPoints() {
    return this.midPoints.map((midPoint, index) => {
      const skip = this.num === 0 ? Settings.strutTarget : Settings.subStrutTarget;
      const target = this.outerPoints[(index + skip) % this.outerPoints.length];
      return new Point(
        midPoint.x + (target.x - midPoint.x) * Settings.strutFactor,
        midPoint.y + (target.y - midPoint.y) * Settings.strutFactor,
      );
    });
  }
}

function setup() {
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  const canvas = createCanvas(800, 800);
  canvas.parent('artwork');
  canvas.elt.setAttribute('role', 'img');
  canvas.elt.setAttribute('aria-label', 'A geometric pattern formed by nested pentagons');
  noLoop();
  drawFractal();
}

function drawFractal() {
  background(Settings.backgroundColor);
  const ink = color(Settings.branchColor);
  const paper = color(Settings.backgroundColor);
  branchStyles = Array.from({ length: Settings.nest }, (_, level) => {
    const progress = level / Math.max(1, Settings.nest - 1);
    return {
      color: lerpColor(ink, paper, progress * 0.58),
      weight: Math.max(0.3, Settings.lineWeight * Math.pow(0.73, level)),
    };
  });
  new FractalRoot().drawShape();
}

function saveArtwork() {
  saveCanvas('sutcliffe-pentagons', 'png');
}
