const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

let parallelCars = document.getElementById("parallelCars").value;
let mutationRate = document.getElementById("mutationRate").value;

const speed = 2.5;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

let road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
let traffic = [];
let cars = [];
createTraffic();
animate();

function restart() {
  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
  parallelCars = document.getElementById("parallelCars").value;
  mutationRate = document.getElementById("mutationRate").value;
  road = null;
  road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
  createTraffic();
}

function saveBrain() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discardBrain() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n) {
  const cars = [];
  for (let i = 1; i < n; i++) {
    cars.push(
      new Car(road.getLaneCenter(1), 150, 30, 50, "AI", (speed / 2) * 5)
    );
  }
  return cars;
}

function createTraffic() {
  let highest = 0;
  traffic = [];
  for (let i = 2; i < 25; i++) {
    traffic.push(
      new Car(
        road.getLaneCenter(0),
        highest - 300,
        30,
        50,
        "DUMMY",
        (speed / 2) * 2
      )
    );
    traffic.push(
      new Car(
        road.getLaneCenter(0),
        highest - 600,
        30,
        50,
        "DUMMY",
        (speed / 2) * 2
      )
    );
    if (i % 2 == 0) {
      traffic.push(
        new Car(
          road.getLaneCenter(1),
          highest - 550,
          30,
          50,
          "DUMMY",
          (speed / 2) * 2
        )
      );
    }
    traffic.push(
      new Car(
        road.getLaneCenter(1),
        highest - 150,
        30,
        50,
        "DUMMY",
        (speed / 2) * 2
      )
    );
    traffic.push(
      new Car(
        road.getLaneCenter(1),
        highest - 800,
        30,
        50,
        "DUMMY",
        (speed / 2) * 2
      )
    );
    traffic.push(
      new Car(
        road.getLaneCenter(2),
        highest - 400,
        30,
        50,
        "DUMMY",
        (speed / 2) * 2
      )
    );
    highest -= 800;
  }
  cars = generateCars(parallelCars);
  bestCar = cars[0];
  if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
      if (i != 0) NeuralNetwork.mutate(cars[i].brain, mutationRate);
    }
  }
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
  requestAnimationFrame(animate);
}
