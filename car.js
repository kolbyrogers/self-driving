class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 5;
    this.friction = 0.05;
    this.angle = 0;

    this.Controls = new Controls();
  }

  update() {
    this.Controls.forward ? (this.speed += this.acceleration) : null;
    this.Controls.reverse ? (this.speed -= this.acceleration) : null;
    this.Controls.left ? (this.angle += 0.03) : null;
    this.Controls.right ? (this.angle -= 0.03) : null;

    this.speed > this.maxSpeed ? (this.speed = this.maxSpeed) : null;
    this.speed < -this.maxSpeed / 2 ? (this.speed = -this.maxSpeed / 2) : null;

    this.speed > 0 ? (this.speed -= this.friction) : null;
    this.speed < 0 ? (this.speed += this.friction) : null;

    Math.abs(this.speed) < this.friction ? (this.speed = 0) : null;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
  }
}
