class Game {
    constructor(
        user,
        topCanvas,
        cameraCanvas,
        car,
        road,
        { trafficSize = 10, carMinDist = 300, carDistStep = 200 } = {}
    ) {
        this.user = user;
        this.topCanvas = topCanvas;
        this.cameraCanvas = cameraCanvas;

        this.topCtx = this.topCanvas.getContext('2d');
        this.cameraCtx = this.cameraCanvas.getContext('2d');

        this.car = car;
        this.road = road;
        this.trafficSize = trafficSize;
        this.carMinDist = carMinDist;
        this.carDistStep = carDistStep;
        this.traffic = this.#generateTraffic();
        this.finishLine = this.#getFinishLine();

        this.camera = new Camera(this.car.center, this.car);

        this.gameOver = false;

        this.time = Date.now().valueOf();
        this.finalTime = null;

        this.save();
        this.#addEventListeners();
    }

    save() {
        localStorage.setItem("game", JSON.stringify(this));
    }

    restart() {
        this.car = null;
        this.traffic = [];

        const gameString = localStorage.getItem("game");
        const gameInfo = gameString ? JSON.parse(gameString) : null;
        if (gameInfo) {
            const tmpCar = gameInfo.car;
            this.car = new Car(tmpCar.center.x, tmpCar.center.y, tmpCar.width, tmpCar.height, tmpCar.maxSpeed, "KEY");
            this.traffic = this.#generateTraffic();
            this.camera = new Camera(tmpCar.center, this.car);
            this.gameOver = false;
            this.time = Date.now().valueOf();
            this.finalTime = null;
        }
    }

    sendMail() {
        fetch('http://localhost:3000/send-email?score=' + this.finalTime + '&humanname=' + this.user)
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

    }

    #update() {
        if (this.gameOver && this.finalTime === null) {
            const secondPassed = Date.now().valueOf() - this.time;
            this.finalTime = parseFloat((secondPassed / 1000).toFixed(3));
        }

        if (!this.gameOver) {
            this.finishLine = this.#getFinishLine();
            this.traffic.forEach((traffic) => traffic.update([], []));
            this.car.update(this.road.borders, this.traffic);

            if (this.car.y < this.traffic[0].y - this.carDistStep * 2) {
                this.traffic.shift();
            }
            this.#checkWalls();
            this.gameOver = this.#checkGameOver();
        }

        return this.camera.update();
    }

    #generateTraffic() {
        const traffic = [];

        let index = 999;
        let random = 1;
        let y = 0;

        for (let i = 0; i < this.trafficSize; i++) {
            random = i % 2 === 0 ? Math.floor(Math.random() * 3) : random;
            index = i % 2 === 0 ? (index !== random ? random : (random + 2) % 3) : (random + 1) % 3;
            y = i % 2 === 0 ? (this.car.center.y - this.carMinDist) - this.carDistStep * i : y;
            const test = i % 2 === 0 ? 0 : 2;
            traffic.push(new Car(road.getLaneCenter(index), y, 55, 90, 3, "DUMMY", getRandomColor()));
        }

        return traffic;
    }

    #getFinishLine() {
        return this.traffic[this.traffic.length - 1].center.y - 200;
    }

    #drawFinishLine(ctx, { sqWidth = 20, sqHeight = 15, col1 = "black", col2 = "white" } = {}) {
        const sqCount = this.road.width / sqWidth;

        for (let j = 0; j < 2; j++) {
            const y = this.finishLine - (sqHeight * j);

            for (let i = 0; i < sqCount; i++) {
                ctx.beginPath();
                if (j % 2 === 0) {
                    ctx.fillStyle = i % 2 === 0 ? col1 : col2;
                }
                else {
                    ctx.fillStyle = i % 2 === 0 ? col2 : col1;
                }
                const x = this.road.left + (sqWidth * i);
                ctx.rect(x, y, sqWidth, sqHeight);
                ctx.fill();
            }
        }
    }

    #checkWalls() {
        if (this.car.center.x + this.car.width / 2 > this.road.right) {
            this.car.center.x = this.road.right - this.car.width / 2;
        }
        if (this.car.center.x - this.car.width / 2 < this.road.left) {
            this.car.center.x = this.road.left + this.car.width / 2;
        }
    }

    #checkGameOver() {
        return this.car.damage || this.car.center.y < this.finishLine;
    }

    #draw() {
        this.cameraCtx.clearRect(0, 0, this.cameraCanvas.width, this.cameraCanvas.height);

        this.topCtx.save();
        this.topCtx.translate(0, -this.car.center.y + this.topCanvas.height * 0.7);

        this.road.draw(this.topCtx);
        this.#drawFinishLine(this.topCtx);
        this.traffic.forEach((traffic) => traffic.draw(this.topCtx));
        this.car.draw(this.topCtx);
        //this.camera.draw(this.topCtx);

        this.topCtx.restore();

        if (this.gameOver) {
            this.#drawGameOverScreen(this.topCtx);
        }
    }

    #render(fov) {
        const polys = this.traffic.map((t) => t.polygon);
        const cars = this.traffic;

        const inViewCars = [];
        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            const points = car.polygon.points;
            if (points.map(p => pointInTriangle(p, fov))[2]) {
                inViewCars.push(car);
            }
        }

        const inViewPolys = [];
        for (let i = 0; i < polys.length; i++) {
            const poly = polys[i];
            const points = poly.points;
            if (points.map(p => pointInTriangle(p, fov))[2]) {
                inViewPolys.push(poly);
            }
        }

        const entities = {
            cars: inViewCars,
            polys: inViewPolys
        }

        this.camera.render(this.cameraCtx, entities, [this.car.polygon]);
    }

    display() {
        const fov = this.#update();
        this.#draw();
        this.#render(fov);
    }

    #drawGameOverScreen(ctx) {
        ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
        ctx.fillRect(0, 0, this.topCanvas.width, this.topCanvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial Bold";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const y = this.topCanvas.height * 0.3
        ctx.fillText("GAMEOVER", this.topCanvas.width / 2, y);

        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial Bold";
        ctx.fillText("Time: " + this.finalTime + "s", this.topCanvas.width / 2, y + 30);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial Bold";
        const txt = "Press 'ENTER' to restart";
        ctx.fillText(txt, this.topCanvas.width / 2, this.topCanvas.height * 0.7);
    }

    #addEventListeners() {
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' && this.gameOver) {
                this.restart();
            }
            if (evt.key === 'm' && this.finalTime !== null) {
                //this.sendMail();
            }
            if (evt.key === 't' || evt.key === 'T') {
                is3D = !is3D;
                checkIs3D();
            }
        });
    }
}