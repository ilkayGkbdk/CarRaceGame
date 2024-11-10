class Car {
    static height3D = 2000;

    constructor(x, y, width, height, maxSpeed, controlType, color = `#151B8D`) {

        this.center = new Vector(x, y);
        this.defaultW = width;
        this.defaultH = height;
        this.width = width;
        this.height = height;
        this.color = color;
        this.polygon = this.#createPolygon();

        this.speed = 0;
        this.acceleration = 0.3;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.steerSens = 0.05;
        this.steeringCorrectionSens = this.steerSens / 2;

        this.damage = false;
        this.invincible = false;
        this.jumping = false;
        this.onAir = false;
        this.jumpsLeft = 1;
        this.currentFrame = 0;

        this.controlType = controlType;
        this.sensor = controlType !== "DUMMY" ? null : null;
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damage) {
            this.#move();
            this.#jump();
            this.#steeringCorrection();
            this.polygon = this.#createPolygon();
            this.damage = this.#assesDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assesDamage(roadBorders, traffic) {
        if (this.invincible) {
            return false;
        }

        for (let i = 0; i < roadBorders.length; i++) {
            for (let j = 0; j < roadBorders[i].length; j++) {
                if (polysIntersect(this.polygon.points, roadBorders[i][j].points)) {
                    return true;
                }
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon.points, traffic[i].polygon.points)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push(new Vector(
            this.center.x - Math.sin(this.angle - alpha) * rad,
            this.center.y - Math.cos(this.angle - alpha) * rad
        ));
        points.push(new Vector(
            this.center.x - Math.sin(this.angle + alpha) * rad,
            this.center.y - Math.cos(this.angle + alpha) * rad
        ));
        points.push(new Vector(
            this.center.x - Math.sin(this.angle - alpha + Math.PI) * rad,
            this.center.y - Math.cos(this.angle - alpha + Math.PI) * rad
        ));
        points.push(new Vector(
            this.center.x - Math.sin(this.angle + alpha + Math.PI) * rad,
            this.center.y - Math.cos(this.angle + alpha + Math.PI) * rad
        ));

        return new Polygon(points);
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.backward) {
            this.speed -= this.acceleration;
        }
        if (this.speed !== 0) {
            if (this.controls.tilt !== null) {
                this.angle -= this.controls.tilt * 0.03;
            }
            else {
                const flip = this.speed > 0 ? 1 : -1;
                if (this.controls.left) {
                    this.angle += this.steerSens * flip;
                }
                if (this.controls.right) {
                    this.angle -= this.steerSens * flip;
                }
            }
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed * 0.8) {
            this.speed = -this.maxSpeed * 0.8;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.center.x -= Math.sin(this.angle) * this.speed;
        this.center.y -= Math.cos(this.angle) * this.speed;
    }

    #jump() {
        if (this.controls.jump && this.jumpsLeft !== 0) {
            this.currentFrame = frame;
            this.invincible = true;

            this.jumping = true;
            this.onAir = true;
            this.jumpsLeft = 0;

            this.controls.jump = false;
        }
        if (this.currentFrame + 60 === frame && this.jumping) {
            this.jumping = false;
        }

        if (this.jumping) {
            this.width += 0.5;
            this.height += 0.5;
        }
        else {
            this.width = Math.max(this.defaultW, this.width - 0.5);
            this.height = Math.max(this.defaultH, this.height - 0.5);
            this.invincible = this.width !== this.defaultW;
            this.onAir = this.height !== this.defaultH;
        }
    }

    #steeringCorrection() {
        if (this.angle > 0) {
            this.angle -= this.steeringCorrectionSens;
        }
        if (this.angle < 0) {
            this.angle += this.steeringCorrectionSens;
        }
        if (Math.abs(this.angle) < this.steeringCorrectionSens) {
            this.angle = 0;
        }
    }

    draw(ctx) {
        if (this.onAir) {
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            this.polygon.draw(ctx, { fill: this.color, strokeStyle: 'black', lineWidth: 15 });
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        ctx.beginPath();
        ctx.fillStyle = this.damage ? `#BBB` : this.color;
        this.polygon.draw(ctx, { fill: this.color });
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}