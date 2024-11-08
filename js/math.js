function lerp(A, B, t) {
    return A + (B - A) * t;
}

function lerp2D(v1, v2, t) {
    return new Vector(
        lerp(v1.x, v2.x, t),
        lerp(v1.y, v2.y, t)
    );
}

function distance(v1, v2) {
    return Math.hypot(v1.x - v2.x, v1.y - v2.y)
}

function getIntersection(A, B, C, D){
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C .x) * (B.y - A.y);

    const eps = 0.001;
    if (Math.abs(bottom) > eps){
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            };
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );

            if (touch) {
                return true;
            }
        }
    }

    return false;
}

function projectPoint(point, segment) {
    const [p1, p2] = segment;

    const a = Vector.subtract(point, p1);
    const b = Vector.subtract(p2, p1);

    const normB = Vector.normalize(b);
    const scalar = Vector.dot(a, normB);
    const proj = {
        point: Vector.add(p1, Vector.scale(normB, scalar)),
        offset: scalar / Vector.magnitude(b),
    };

    return proj.point;
}

function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInTriangle(pt, [v1, v2, v3]) {
    let d1, d2, d3;
    let has_neg, has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    has_neg = d1 < 0 || d2 < 0 || d3 < 0;
    has_pos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(has_neg && has_pos);
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 40%)`;
}