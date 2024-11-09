class Camera {

    static maximumFOV = 12500;

    constructor(center, target) {
        this.center = center;
        this.target = target;
        this.centerFlex = 300;
        this.cameraLockOnTarget = true;

        this.fovAngle = Math.PI / 1.1;
        this.z = -100;

        this.update();
    }

    update() {
        const t = 0.2;
        if (this.cameraLockOnTarget) {
            this.center = lerp2D(this.center, Vector.add(this.target.center, new Vector(0, this.centerFlex)), t);
        }
        else {
            this.center = lerp2D(this.center, Vector.add(new Vector(this.center.x, this.target.center.y), new Vector(0, this.centerFlex)), t);
        }

        const frontOffset = Vector.toPolar(0., Camera.maximumFOV);
        this.front = Vector.subtract(this.center, frontOffset);

        const leftOffset = Vector.toPolar(this.fovAngle / 2, Camera.maximumFOV);
        this.left = Vector.subtract(this.center, leftOffset);

        const rightOffset = Vector.toPolar(-this.fovAngle / 2, Camera.maximumFOV);
        this.right = Vector.subtract(this.center, rightOffset);

        return [this.left, this.center, this.right];
    }

    #projectPoint(point, seg, { width, height }) {
        const p1 = projectPoint(point, seg);
        const c = Vector.cross(
            Vector.subtract(p1, this.center),
            Vector.subtract(point, this.front)
        );
        const x = Math.sign(c) * distance(point, p1) / distance(this.center, p1);
        const y = (point.z - this.z) / distance(this.center, point); // can use point instead of p1

        const cX = width / 2;
        const cY = height / 2;
        const scalar = Math.max(cX, cY);
        const scaledX = cX + x * scalar;
        const scaledY = cY + y * scalar;

        return new Vector(scaledX, scaledY);
    }

    #extrude(polys, height = 10) {
        const extrudedPolys = [];
        for (const poly of polys) {
            const ceiling = new Polygon(
                poly.points.map((p) => new Vector(p.x, p.y, -height)),
            );
            const sides = [];
            for (let i = 0; i < poly.points.length; i++) {
                sides.push(new Polygon([
                    poly.points[i],
                    poly.points[(i + 1) % poly.points.length],
                    ceiling.points[(i + 1) % ceiling.points.length],
                    ceiling.points[i]
                ]));
            }
            extrudedPolys.push(...sides, ceiling);
        }
        return extrudedPolys;
    }

    render(ctx, entities, mainCar, roadPolysLeft, roadPolysRight) {
        entities.cars = entities.cars.sort((a, b) => distance(this.center, a.center) - distance(this.center, b.center));
        entities.polys = entities.polys.concat(mainCar).sort((a, b) => distance(this.center, a.points[2]) - distance(this.center, b.points[2]));

        const seg = [this.center, this.front];
        const extrudedPolys = this.#extrude(entities.polys, 20);
        const mainExPoly = this.#extrude(mainCar, 20);
        const roadExPolyLeft = this.#extrude(roadPolysLeft);
        const roadExPolyRight = this.#extrude(roadPolysRight);

        const projPolys = extrudedPolys.map((poly) =>
            new Polygon(
                poly.points.map((p) => this.#projectPoint(p, seg, ctx.canvas))
            )
        );

        const mainProjPoly = mainExPoly.map((poly) =>
            new Polygon(
                poly.points.map(p => this.#projectPoint(p, seg, ctx.canvas))
            )
        );

        const roadProjPolyLeft = roadExPolyLeft.map((poly) =>
            new Polygon(
                poly.points.map(p => this.#projectPoint(p, seg, ctx.canvas))
            )
        );
        const roadProjPolyRight = roadExPolyRight.map((poly) =>
            new Polygon(
                poly.points.map(p => this.#projectPoint(p, seg, ctx.canvas))
            )
        );

        for (const poly of roadProjPolyLeft) {
            poly.draw(ctx, { fill: 'black', strokeStyle: 'white' });
        }
        for (const poly of roadProjPolyRight) {
            poly.draw(ctx, { fill: 'black', strokeStyle: 'white' });
        }
        for (const poly of projPolys) {
            poly.draw(ctx, { fill: 'orange', strokeStyle: 'orange' });
        }
        for (const poly of mainProjPoly) {
            poly.draw(ctx, { strokeStyle: 'blue' });
        }
    }

    draw(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(this.left.x, this.left.y);
        ctx.lineTo(this.center.x, this.center.y);
        ctx.lineTo(this.right.x, this.right.y);
        ctx.closePath();
        ctx.stroke();
    }
}