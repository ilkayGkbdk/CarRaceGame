class Segment {
    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
    }

    draw(ctx, { width = 2, color = 'white' }) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(this.v1.x, this.v1.y);
        ctx.lineTo(this.v2.x, this.v2.y);
        ctx.stroke();
    }
}