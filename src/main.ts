import { Application, Assets, Sprite, Text } from "pixi.js";
import { GifSprite } from "pixi.js/gif";

let app: Application = null;

/*
window.onload = () => {
  setTimeout(() => {
    window["startFaceBlaster"]();
  }, 1111);
};
*/

function handleDestroy() {
  if (app !== null) {
    app.destroy(true, true);
  }
}

window.onbeforeunload = () => {
  handleDestroy();
};

function playSound(sound: HTMLAudioElement) {
  sound.play().catch((error) => {
    console.log("Playback failed:", error);
  });
}

function getAssetsFolder() {
  let folder = "/assets/";
  if (import.meta.env.PROD === true) {
    folder = "/fb" + folder;
  }
  return folder;
}

// attach method to window so html scope can access it
window["startFaceBlaster"] = () => {
  const startSound: HTMLAudioElement = document.querySelector("#soundStart");
  playSound(startSound);
  const startMenuElement: HTMLElement = document.querySelector(".start-menu");
  const appElement: HTMLElement = document.querySelector(".app");
  startMenuElement.classList.add("hide");
  appElement.classList.remove("hide");
  reset();
};

async function reset() {
  handleDestroy();
  // Create a new application
  app = new Application();

  // Initialize the application
  await app.init({ background: "#000000", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  /*
  const assets = await Assets.load([
    //{ alias: "enemy1", src: getAssetsFolder() + "enemy1.gif" }
    getAssetsFolder() + "enemy1.gif"
  ]);
  */
  //const enemy1Sprite = new Sprite(assets[0]);
  const enemy1Source = await Assets.load(getAssetsFolder() + "enemy1.gif");
  const enemy1Sprite = new GifSprite({ source: enemy1Source });
  const enemy1DeadSource = await Assets.load(
    getAssetsFolder() + "enemy1dead2.gif",
  );
  const enemy1DeadSprite = new GifSprite({ source: enemy1DeadSource });
  enemy1Sprite.position.set(0, 100);
  enemy1Sprite.width = 150;
  enemy1Sprite.height = 150;
  enemy1Sprite.eventMode = "static";
  enemy1Sprite.onpointerdown = () => {
    enemy1DeadSprite.loop = false;
    enemy1DeadSprite.position.set(0, 100);
    enemy1DeadSprite.width = 150;
    enemy1DeadSprite.height = 150;
    enemy1DeadSprite.onComplete = () => {
      console.log("complete");
    };
    app.stage.removeChild(enemy1Sprite);
    app.stage.addChild(enemy1DeadSprite);
  };
  app.stage.addChild(enemy1Sprite);
  // Load the bunny texture
  const texture = await Assets.load(getAssetsFolder() + "bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  const videoTexture = await Assets.load(getAssetsFolder() + "enemy1dv.mp4");
  const videoSprite = new Sprite(videoTexture);
  videoSprite.x = 100;
  videoSprite.y = 333;
  app.stage.addChild(videoSprite);

  const timerText = new Text({
    text: "30",
    style: {
      fontFamily: "sans-serif",
      fill: "white",
      fontSize: 36,
      fontWeight: "bold",
    },
    anchor: 0.5,
    x: app.screen.width / 2,
    y: 50,
  });

  app.stage.addChild(timerText);

  setTimeout(() => {
    timerText.text = "20";
  }, 3333);
}
