class FaceBlaster {
    constructor() {
        // singelton
        if (FaceBlaster.instance) {
            return FaceBlaster.instance;
        }
        FaceBlaster.instance = this;
        // make the ui selectors handy and setup event listeners
        this.header = document.querySelector(".header");
        this.time = document.querySelector(".time");
        this.points = document.querySelector(".points");
        this.container = document.querySelector(".container");
        this.gameover = document.querySelector(".gameover");
        this.level4x4 = document.querySelector(".level4x4");
        this.container.addEventListener("click", this.handleLevelElementClick);
    }

    reset() {
        this.level = 0;
        this.setHeader("Start Blasting Faces!");
        this.setTime(10);
        this.setPoints(0);
        this.hideContainerElements();
        this.runGame();
    }

    hideContainerElements() {
        const element = document.querySelector(".container");
        if (element) {
            Array.from(element.children).forEach((container) => {
                container.classList.add("hide");
            });
        } else {
            console.error("Container element not found");
        }
    }

    runGame() {
        switch (this.level) {
            case 0:
                this.runLevel1();
                break;
            default:
                console.log("Next Level");
        }
    }

    startTimer(time) {
        this.setTime(time);
        this.interval = setInterval(() => {
            const newTime = this.getTime() - 1;
            this.setTime(newTime);
            if (newTime === 0) {
                clearInterval(this.interval);
                this.handleTimesUp();
            }
        }, 1000);
    }

    runLevel1() {
        this.level4x4.classList.remove("hide");
        this.startTimer(3);
    }

    handleTimesUp() {
        this.setHeader("Game Over!");
        this.hideContainerElements();
        this.gameover.classList.remove("hide");
    }

    setHeader(message) {
        this.header.innerHTML = message;
    }

    setPoints(value) {
        this.points.innerHTML = (value + "").padStart(5, "0");
    }

    getPoints() {
        return parseInt(this.points.innerHTML);
    }

    setTime(value) {
        this.time.innerHTML = value;
    }

    getTime() {
        return parseInt(this.time.innerHTML);
    }

    fadeInElement(element) {
        if (element && element.style) {
            element.style.opacity = 0;
            let timeout = 0;
            let max = 100;
            for (let i = 0; i <= max; i++) {
                timeout += 10;
                setTimeout(() => {
                    const currentOpacity = parseFloat(element.style.opacity);
                    let newOpacity = currentOpacity + 0.01 > 1 ? 1 : currentOpacity + 0.01;
                    if (i === max) {
                        newOpacity = 1;
                    }
                    element.style.opacity = newOpacity;
                }, timeout);
            }
        } else {
            console.error("element not found, cannot fade in");
        }
    }

    fadeOutElement(element) {
        if (element && element.style) {
            element.style.opacity = 1;
            let timeout = 0;
            let max = 100;
            for (let i = 0; i <= max; i++) {
                timeout += 10;
                setTimeout(() => {
                    const currentOpacity = parseFloat(element.style.opacity);
                    let newOpacity = currentOpacity - 0.01 < 0 ? 0 : currentOpacity - 0.01;
                    if (i === max) {
                        newOpacity = 0;
                    }
                    element.style.opacity = newOpacity;
                }, timeout);
            }
        } else {
            console.error("element not found, cannot fade out");
        }
    }

    handleLevelElementClick(e) {
        console.log(e);
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

const app = new FaceBlaster();
app.reset();

window.onbeforeunload = function () {
    app.destroy();
}

function startFaceBlaster() {
    const startMenu = document.querySelector(".start-menu");
    startMenu.classList.add("hide");
    playSound("#soundStart");
}

function playSound(id) {
    const sound = document.querySelector(id);
    if (sound) {
        sound.play().catch(error => {
            console.log('Playback failed:', error);
        });
    } else {
        console.error("Sound not found");
    }
}

function tryAgain() {
    app.reset();
}