const canvas = document.getElementById("myCanvas")
canvas.width = 800;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let user = 'ilkay';
const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);

let frame = 0;
let second = 0;

const road = new Road(canvas.width / 2, 320);
const car = new Car(road.getLaneCenter(1), 200, 55, 90, 15, "KEY");

const game = new Game(user, true, canvas, car, road, {trafficSize: 50});

animate();

function animate() {
    if (frame % 60 === 0) {
        second++;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `#8FBC8FFF`;
    ctx.fillRect(0, 0, road.left - 40, canvas.height);
    ctx.fillRect(road.right + 40, 0, canvas.width, canvas.height);

    game.update();
    game.display(ctx);

    frame++;
    requestAnimationFrame(animate);
}