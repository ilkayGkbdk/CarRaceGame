class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static toPolar(dir, mag) {
        return new Vector(
            Math.sin(dir) * mag,
            Math.cos(dir) * mag,
        );
    }

    static cross(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    static add(v1, v2) {
        return new Vector(
            v1.x + v2.x,
            v1.y + v2.y
        );
    }

    static subtract(v1, v2) {
        return new Vector(
            v1.x - v2.x,
            v1.y - v2.y
        );
    }

    static scale(v, scalar) {
        return new Vector(
            v.x * scalar,
            v.y * scalar
        );
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static normalize(v) {
        const mag = Vector.magnitude(v);
        return new Vector(v.x / mag, v.y / mag);
    }

    static magnitude(v) {
        return Math.hypot(v.x, v.y);
    }
}