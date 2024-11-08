class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = this.x - this.width / 2;
        this.right = this.x + this.width / 2;

        const ROAD_END = 1000000;
        this.top = ROAD_END;
        this.bottom = -ROAD_END;

        const topLeft = new Vector(this.left, this.top);
        const bottomLeft = new Vector(this.left, this.bottom);
        const topRight = new Vector(this.right, this.top);
        const bottomRight = new Vector(this.right, this.bottom);
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + (Math.min(laneIndex, this.laneCount - 1) * laneWidth);
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = `#FFF`;

        for (let i = 1; i <= this.laneCount - 1; i++) {
            const t = i / this.laneCount;
            const x = lerp(this.left, this.right, t);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.setLineDash([40, 20]);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.setLineDash([]);
        this.borders.forEach((border) => {
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
        });
        ctx.stroke();
    }
}