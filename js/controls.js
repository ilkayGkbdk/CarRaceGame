class Controls {
    constructor(controlType = "KEY") {
        this.forward = controlType === "DUMMY";
        this.left = false;
        this.backward = false;
        this.right = false;
        this.jump = false;

        if (controlType === "KEY") {
            this.#addEventListeners();
        }
    }

    #addEventListeners() {
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'w' || evt.key === 'W') {
                this.forward = true;
            }
            else if (evt.key === 'a' || evt.key === 'A') {
                this.left = true;
            }
            else if (evt.key === 's' || evt.key === 'S') {
                this.backward = true;
            }
            else if (evt.key === 'd' || evt.key === 'D') {
                this.right = true;
            }
            else if (evt.key === ' ') {
                this.jump = true;
            }
        });
        document.addEventListener('keyup', (evt) => {
            if (evt.key === 'w' || evt.key === 'W') {
                this.forward = false;
            }
            else if (evt.key === 'a' || evt.key === 'A') {
                this.left = false;
            }
            else if (evt.key === 's' || evt.key === 'S') {
                this.backward = false;
            }
            else if (evt.key === 'd' || evt.key === 'D') {
                this.right = false;
            }
        });
    }
}