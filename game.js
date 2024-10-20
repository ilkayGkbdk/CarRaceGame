class Game {
    constructor(canvas, car, road, trafficSize = 0) {
        this.car = car;
        this.road = road;
        this.trafficSize = trafficSize;
        this.traffic = this.#generateTraffic();
        this.finishLine = this.#getFinishLine();

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
        const gameString = localStorage.getItem("game");
        const gameInfo = gameString ? JSON.parse(gameString) : null;
        if (gameInfo) {
            const tmpCar = gameInfo.car;
            this.car = new Car(tmpCar.x, tmpCar.y, tmpCar.width, tmpCar.height, tmpCar.maxSpeed, "KEY");
            this.traffic = this.#generateTraffic();
            this.gameOver = false;
            this.time = Date.now().valueOf();
            this.finalTime = null;
        }
    }

    update() {
        if (this.gameOver && this.finalTime === null) {
            const secondPassed = Date.now().valueOf() - this.time;
            this.finalTime = parseFloat((secondPassed / 1000).toFixed(3));
        }

        if (!this.gameOver) {
            this.finishLine = this.#getFinishLine();
            this.traffic.forEach((traffic) => traffic.update(this.road.borders, []));
            this.car.update(this.road.borders, this.traffic);

            this.gameOver = this.#checkGameOver();
        }
    }

    #addEventListeners() {
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' && this.gameOver) {
                this.restart();
            }
        });
    }

    #checkGameOver() {
        return this.car.damage || this.car.y < this.finishLine;
    }

    display(ctx) {
        ctx.save();
        ctx.translate(0, -this.car.y + canvas.height * 0.7);

        this.road.draw(ctx);
        this.#drawFinishLine(ctx);
        this.traffic.forEach((traffic) => traffic.draw(ctx));
        this.car.draw(ctx);

        ctx.restore();

        if (this.gameOver) {
            ctx.fillStyle = `rgba(0, 0, 0, 0.4)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "40px Arial Bold";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const y = canvas.height * 0.3
            ctx.fillText("GAMEOVER", canvas.width / 2, y);

            ctx.fillStyle = "yellow";
            ctx.font = "20px Arial Bold";
            ctx.fillText("Time: " + this.finalTime + "s", canvas.width / 2, y + 30);

            ctx.fillStyle = "white";
            ctx.font = "30px Arial Bold";
            const txt = "Press 'ENTER' to restart";
            ctx.fillText(txt, canvas.width / 2, canvas.height * 0.7);
        }
    }

    #generateTraffic(carMinDist = 200, carDistStep = 200) {
        const traffic = [];

        let index = 999;
        let random = 1;
        let y = 0;

        const N = this.trafficSize;

        for (let i = 0; i < N; i++) {
            random = i % 2 === 0 ? Math.floor(Math.random() * 3) : random;
            index = i % 2 === 0 ? (index !== random ? random : (random + 2) % 3) : (random + 1) % 3;
            y = i % 2 === 0 ? (this.car.y - carMinDist) - carDistStep * i : y;
            traffic.push(new Car(road.getLaneCenter(index), y, 55, 90, 3, "DUMMY", getRandomColor()));
        }

        return traffic;
    }

    #getFinishLine() {
        return this.traffic[this.traffic.length - 1].y - 200;
    }

    #drawFinishLine(ctx, { sqWidth = 20, sqHeight = 15, col1 = "black", col2 = "white" } = {}) {
        for (let j = 0; j < 2; j++) {
            const y = this.finishLine - (sqHeight * j);

            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                if (j % 2 === 0) {
                    ctx.fillStyle = i % 2 === 0 ? col1 : col2;
                }
                else {
                    ctx.fillStyle = i % 2 === 0 ? col2 : col1;
                }
                const x = sqWidth * i;
                ctx.rect(x, y, sqWidth, sqHeight);
                ctx.fill();
            }
        }
    }
}