const canvas = document.getElementById("myCanvas")
canvas.width = 400;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.8);
const car = new Car(road.getLaneCenter(1), 200, 50, 80, 10, "KEY");

const game = new Game(car, road, 50);

let frame = 0;
let second = 0;

animate();

function animate() {
    if (frame % 60 === 0) {
        second++;
        frame = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.update();
    game.display(ctx);

    frame++;
    requestAnimationFrame(animate);
}