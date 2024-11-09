class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = this.x - this.width / 2;
        this.right = this.x + this.width / 2;

        const ROAD_END = 30000;
        this.top = ROAD_END;
        this.bottom = -ROAD_END / 2;

        const borderMaxLength = 200;
        const leftBorders = [];
        const rightBorders = [];
        let yStart = this.bottom;
        for (let i = 0; i < (Math.abs(this.bottom) + this.top) / borderMaxLength; i++) {
            const t = i / (((Math.abs(this.bottom) + this.top) / borderMaxLength) - 1);
            const y = lerp(this.bottom, this.top, t);
            const leftP1 = new Vector(this.left, yStart);
            const leftP2 = new Vector(this.left, y);
            const rightP1 = new Vector(this.right, yStart);
            const rightP2 = new Vector(this.right, y);
            leftBorders.push(new Polygon([leftP1, leftP2]));
            rightBorders.push(new Polygon([rightP1, rightP2]));
            yStart = y;
        }
        this.borders = [
            leftBorders,
            rightBorders
        ];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + (Math.min(laneIndex, this.laneCount - 1) * laneWidth);
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = `#FFF`;
        ctx.setLineDash([40, 20]);

        for (let i = 1; i <= this.laneCount - 1; i++) {
            const t = i / this.laneCount;
            const x = lerp(this.left, this.right, t);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        ctx.beginPath();
        this.borders.forEach((border) => {
            border.forEach((poly) => {
                poly.draw(ctx, { fill: 'white', strokeStyle: 'white', lineWidth: '10' })
            });
        });
        ctx.stroke();
    }
}