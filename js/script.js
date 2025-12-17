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