const DEV = false;
const assets = {
    "start": {
        blob: null,
        url: "assets/start.mp4"
    },
    "enemy1": {
        blob: null,
        url: "assets/enemy1.mp4"
    },
    "gameover": {
        blob: null,
        url: "assets/gameover.mp4"
    }
};
async function loadAssets(data) {
    const promises = [];
    for (const key in data) {
        const url = data[key].url;
        promises.push(fetch(url)
            .then(res => res.blob())
            .then(blob => {
                data[key].blob = blob;
                return key;
            }));
    }
    await Promise.all(promises);
}
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
        this.footer = document.querySelector(".footer");
        this.points = document.querySelector(".points");
        this.container = document.querySelector(".container");
        this.gameover = document.querySelector(".gameover");
        this.level4x4 = document.querySelector(".level4x4");
        this.container.addEventListener("click", this.handleLevelElementClick);
    }

    reset() {
        this.level = 0;
        this.header.classList.remove("hide");
        this.time.classList.remove("hide");
        this.footer.classList.remove("hide");
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
        this.startTimer(10);
        const cells = this.level4x4.querySelectorAll("div");
        Array.from(cells).forEach((cell, i) => {
            const video = document.querySelector("#enemy1");
            const clone = video.cloneNode(true);
            clone.id = "enemy1Clone" + i;
            clone.classList.remove("hide");
            clone.loop = true;
            clone.muted = true;
            clone.autoplay = true;
            cell.replaceChildren(clone);
        });
    }

    handleTimesUp() {
        this.setHeader("Game Over!");
        this.hideContainerElements();
        this.gameover.classList.remove("hide");
        const video = document.querySelector("#videoGameOver");
        const clone = video.cloneNode(true);
        clone.id = "videoGameOverClone";
        clone.loop = true;
        clone.muted = false;
        this.gameover.prepend(clone);
        this.playVideo(clone);
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

    playVideo(video) {
        video.currentTime = 0;
        video.classList.remove("hide");
        this.fadeInElement(video);
        video.play().catch(error => {
            console.log("Video playback failed:", error);
        });
    }

    stopVideo(video) {
        video.pause();
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

const app = new FaceBlaster();

window.onload = async function () {
    await loadAssets(assets);
    const spinner = document.querySelector(".spinner");
    const startButton = document.querySelector(".start-button")
    spinner.classList.add("hide");
    startButton.classList.remove("hide");
    if (DEV === true) {
        startFaceBlaster();
    }
}

window.onbeforeunload = function () {
    app.destroy();
}

function startFaceBlaster() {
    const startMenu = document.querySelector(".start-menu");
    if (DEV === false) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(assets["start"].blob);
        video.classList.add("video");
        video.id = "videoStart";
        console.log(video.playsinline);
        //video.playsinline = true;
        console.log(video.playsinline);
        console.log(video);
        video.muted = false;
        video.loop = false;
        video.autoplay = false;
        startMenu.replaceChildren(video);
        app.playVideo(video);
        setTimeout(() => {
            app.fadeOutElement(video);
        }, 4000);
        setTimeout(() => {
            app.stopVideo(video);
            URL.revokeObjectURL(video.src);
            startMenu.remove();
            app.reset();
        }, 5000);
    } else {
        startMenu.remove();
        app.reset();
    }
}

/*
//playSound("#soundStart");
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
*/

function tryAgain() {
    const video = document.querySelector("#videoGameOverClone");
    video.remove();
    app.reset();
}

if (DEV === true) {
    startFaceBlaster();
}