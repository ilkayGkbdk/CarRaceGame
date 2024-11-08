const topCanvas = document.getElementById("topCanvas")
topCanvas.width = 0;
topCanvas.height = window.innerHeight;
const ctx = topCanvas.getContext("2d");

const cameraCanvas = document.getElementById("cameraCanvas");
cameraCanvas.width = window.innerWidth;
cameraCanvas.height = window.innerHeight;

let is3D = false;
checkIs3D();

let user = 'ilkay';

let frame = 0;
let second = 0;

const road = new Road(window.innerWidth / 2, 320);
const car = new Car(road.getLaneCenter(1), 200, 55, 90, 15, "KEY");

const game = new Game(user, topCanvas, cameraCanvas, car, road, {trafficSize: 50});

animate();

function animate() {
    if (frame % 60 === 0) {
        second++;
    }

    ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
    ctx.fillStyle = `#8FBC8FFF`;
    ctx.fillRect(0, 0, road.left - 40, topCanvas.height);
    ctx.fillRect(road.right + 40, 0, topCanvas.width, topCanvas.height);

    game.display();

    frame++;
    requestAnimationFrame(animate);
}

function checkIs3D() {
    if (is3D) {
        topCanvas.width = 0;
        cameraCanvas.width = window.innerWidth;
    }
    else {
        cameraCanvas.width = 0;
        topCanvas.width = window.innerWidth;
    }
}