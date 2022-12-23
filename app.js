const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 250;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
];

const cars = generateCars(100);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

animate();

function saveBrain() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discardBrain() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n) {
  const cars = [];
  for (let i = 1; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 4));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((e) => e.y == Math.min(...cars.map((e) => e.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "orange");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 30;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
