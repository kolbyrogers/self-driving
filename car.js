class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
    }
    this.Controls = new Controls(controlType);
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders);
    }
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points;
  }

  #move() {
    this.Controls.forward ? (this.speed += this.acceleration) : null;
    this.Controls.reverse ? (this.speed -= this.acceleration) : null;

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      this.Controls.left ? (this.angle += 0.03 * flip) : null;
      this.Controls.right ? (this.angle -= 0.03 * flip) : null;
    }
    this.speed > this.maxSpeed ? (this.speed = this.maxSpeed) : null;
    this.speed < -this.maxSpeed / 2 ? (this.speed = -this.maxSpeed / 2) : null;

    this.speed > 0 ? (this.speed -= this.friction) : null;
    this.speed < 0 ? (this.speed += this.friction) : null;

    Math.abs(this.speed) < this.friction ? (this.speed = 0) : null;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
