class Polygon {
    constructor(points) {
        this.points = points;
    }

    draw(ctx, { fill = 'blue' } = {}) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.fill();
    }
}