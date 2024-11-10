class PhoneControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.tilt = 0;
        this.forward = true;
        this.backward = false;
        this.canvasAngle = 0;

        this.#addEvents();
    }

    #addEvents() {
        window.addEventListener('devicemotion', (evt) => {
            this.tilt = Math.atan2(
                evt.accelerationIncludingGravity.y,
                evt.accelerationIncludingGravity.x
            );

            const newCanvasAngle = -this.tilt;
            this.canvasAngle = this.canvasAngle * 0.6 + newCanvasAngle * 0.4;
            this.canvas.style.transform = `translate(-50%, -50%) rotate(${this.canvasAngle}rad)`;
        });

        window.addEventListener('touchstart', () => {
            this.forward = false;
            this.backward = true;
        });

        window.addEventListener('touchend', () => {
            this.backward = false;
            this.forward = true;
        });
    }
}