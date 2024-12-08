// Oisin Healy Gelletlie
// N00242930

const SKY_HEIGHT = 130;
const SEA_HEIGHT = 420;
const SAND_HEIGHT = 50;
const TIMER_VALUE = 30;

let lose = false;

let score = 0;
let timer = TIMER_VALUE;
let kgs = 0;

let emptyImage;

let titleMusic, backgroundMusic, endMusic;

let gameState = 0; // 0 = title, 1 = game, 2 = end

let volumeIcon, soundOnIcon, soundOffIcon;

// starting x y values of submarine
let subX = 250;
let subY = 275;
let subSprites = [];
let subIndex = 0;

let skyImage, seaImage, sandImage;
let sunSprites = [];
let sunIndex = 0;

let dolphinImage, fishImage, turtleImage, jellyfishImage;
let dolphReset, fishReset, turtReset, jellyReset;
let dolphinSound, fishSound, turtleSound, jellySound;

let hitFish = false;

let dolphinCaught = false;
let fishCaught = false;
let turtleCaught = false;
let jellyfishCaught = false;

let netImage, bootImage, bagImage, ringsImage;
let netReset, bootReset, bagReset, ringsReset;
let trashSound;

let netCleaned = false;
let bootCleaned = false;
let bagCleaned = false;
let ringsCleaned = false;

let seaweed1 = [];
let seaweed2 = [];
let seaweed3 = [];

let coral1 = [];
let coral2 = [];
let coral3 = [];

let seaweed1Pos, seaweed2Pos, seaweed3Pos;
let coral1Pos, coral2Pos, coral3Pos;

let plantIndex = 0;

// generates random x y coordinates and returns them as an array
function generatePlantPos() {
  let x = round(random(0, width - 60));
  let y = round(random((SKY_HEIGHT + SEA_HEIGHT) - 90, height - 100));

  return [x, y];
}

function preload() {
  titleMusic = loadSound("assets/sounds/title_theme.mp3");
  backgroundMusic = loadSound("assets/sounds/main_theme.mp3");
  endMusic = loadSound("assets/sounds/end_theme.mp3");

  dolphinSound = loadSound("assets/sounds/dolphin_click.mp3");
  fishSound = loadSound("assets/sounds/fish_blub.mp3");
  turtleSound = loadSound("assets/sounds/under_the_sea.mp3");
  jellySound = loadSound("assets/sounds/jelly_zap.mp3");

  trashSound = loadSound("assets/sounds/points_earned.mp3")

  font = loadFont("assets/fonts/Tiny5-Regular.ttf");

  emptyImage = loadImage("assets/sprites/empty.png");

  soundOffIcon = loadImage("assets/sprites/mute.png");
  soundOnIcon = loadImage("assets/sprites/volume.png");
  volumeIcon = soundOnIcon;

  skyImage = loadImage("assets/sprites/sky.png");
  seaImage = loadImage("assets/sprites/sea.png");
  sandImage = loadImage("assets/sprites/sand.png");

  sunSprites[0] = loadImage("assets/sprites/sun_frame1.png");
  sunSprites[1] = loadImage("assets/sprites/sun_frame2.png");

  subSprites[0] = loadImage("assets/sprites/sub1.png");
  subSprites[1] = loadImage("assets/sprites/sub2.png");

  dolphinImage = loadImage("assets/sprites/dolphin.png");
  dolphReset = dolphinImage;
  fishImage = loadImage("assets/sprites/fish.png");
  fishReset = fishImage;
  turtleImage = loadImage("assets/sprites/turtle.png");
  turtReset = turtleImage;
  jellyfishImage = loadImage("assets/sprites/jellyfish.png");
  jellyReset = jellyfishImage;

  netImage = loadImage("assets/sprites/net.png");
  netReset = netImage;
  bootImage = loadImage("assets/sprites/boot.png");
  bootReset = bootImage;
  bagImage = loadImage("assets/sprites/bag.png");
  bagReset = bagImage;
  ringsImage = loadImage("assets/sprites/rings.png");
  ringsReset = ringsImage;

  seaweed1[0] = loadImage("assets/sprites/seaweed1_frame1.png");
  seaweed1[1] = loadImage("assets/sprites/seaweed1_frame2.png");

  seaweed2[0] = loadImage("assets/sprites/seaweed2_frame1.png");
  seaweed2[1] = loadImage("assets/sprites/seaweed2_frame2.png");

  seaweed3[0] = loadImage("assets/sprites/seaweed3_frame1.png");
  seaweed3[1] = loadImage("assets/sprites/seaweed3_frame2.png");

  coral1[0] = loadImage("assets/sprites/coral1.png");
  coral1[1] = loadImage("assets/sprites/coral1.png");

  coral2[0] = loadImage("assets/sprites/coral1.png");
  coral2[1] = loadImage("assets/sprites/coral1.png");

  coral3[0] = loadImage("assets/sprites/coral1.png");
  coral3[1] = loadImage("assets/sprites/coral1.png");
}

function setup() {
  createCanvas(600, 600, WEBGL);

  seaweed1Pos = generatePlantPos();
  seaweed2Pos = generatePlantPos();
  seaweed3Pos = generatePlantPos();

  coral1Pos = generatePlantPos();
  coral2Pos = generatePlantPos();
  coral3Pos = generatePlantPos();

  textFont(font);
  textAlign(CENTER);

  titleMusic.loop();
}

function draw() {
  // set origin back to corner
  translate(-(width / 2), -(height / 2));

  // sets cursor back to default
  cursor(ARROW);

  checkCurrentState();
}

function checkCurrentState() {
  if (gameState === 0) { // start menu
    startMenu();
  } else if (gameState === 1) { // main game
    gameLoop();
  } else if (gameState === 2) { // win screen
    endScreen();
  }
}

// reset some variables to their default states
function reset() {
  timer = TIMER_VALUE;
  score = 0;
  kgs = 0;

  lose = false;
  hitFish = false;

  dolphinCaught = false;
  fishCaught = false;
  turtleCaught = false;
  jellyfishCaught = false;

  netCleaned = false;
  bootCleaned = false;
  bagCleaned = false;
  ringsCleaned = false;

  dolphinImage = dolphReset;
  fishImage = fishReset;
  turtleImage = turtReset;
  jellyfishImage = jellyReset;

  netImage = netReset;
  bootImage = bootReset;
  bagImage = bagReset;
  ringsImage = ringsReset;

  subX = 250;
  subY = 275;

  endMusic.stop();
  titleMusic.loop();
  titleMusic.setVolume(1);
  volumeIcon = soundOnIcon;
}

function startMenu() {
  drawBackground();

  let instruction = "Collect trash and avoid the animals!";
  let buttonText = "Click here to begin";

  // draw rectangles
  fill("rgba(15, 15, 221, 0.6)"); // blue
  rect(25, 90, 550, 150, 25);

  fill("rgba(128, 15, 221, 0.6)"); // purple
  rect(150, 285, 300, 160, 25);

  texture(volumeIcon);
  circle(550, 575, 40);


  // draw text
  fill(225);
  textSize(50);

  text(instruction, 25, 150, width - 50, 150);
  text(buttonText, 175, 350, 250, 150);

  // check if mouse is inside the play button to change cursor
  // logic handled in mouseClicked()
  if ((mouseX > 150 && mouseX < 450) && (mouseY > 285 && mouseY < 445)) {
    cursor(HAND);
  }

  // check if mouse is inside the mute button to change cursor
  // muting logic is handled inside mouseClicked()
  if ((mouseX > 525 && mouseX < 570) && (mouseY > 550 && mouseY < 590)) {
    cursor(HAND);
  }
}

function mouseClicked() {
  // if mouse inside mute button on start screen
  // clicking it will turn on or off music
  if ((mouseX > 525 && mouseX < 570) && (mouseY > 550 && mouseY < 590) && gameState === 0) {
    if (volumeIcon === soundOnIcon) {
      volumeIcon = soundOffIcon;
      titleMusic.pause();
    } else if (volumeIcon === soundOffIcon) {
      volumeIcon = soundOnIcon;
      titleMusic.play();
    }
  }

  //if mouse is inside play button on start screen
  // clicking it will change game state
  if ((mouseX > 150 && mouseX < 450) && (mouseY > 285 && mouseY < 445) && gameState === 0) {
    titleMusic.stop();
    backgroundMusic.loop();
    gameState = 1;
  }
}

function gameLoop() {
  noCursor();
  if (timer <= 0) { // if time runs out
    backgroundMusic.stop();
    endMusic.loop();
    lose = true;
    gameState = 2; // end screen
  }

  if (dolphinCaught && fishCaught && turtleCaught && jellyfishCaught) { // if you hit all the fish
    backgroundMusic.stop();
    endMusic.loop();
    hitFish = true;
    lose = true;
    gameState = 2; // end screen
  }

  if (netCleaned && bootCleaned && bagCleaned && ringsCleaned) { // if all trash collected
    backgroundMusic.stop();
    endMusic.loop();
    gameState = 2; // end screen
  }

  drawBackground();

  drawFish(); // dolphin, turtle, fish, jellyfish
  drawTrash(); // net, boot, bag, rings

  subMoveDraw();

  scoreHandling();

  // switches from 1 frame of plant to the next
  // animates seaweed and coral
  if (frameCount % 30 === 0) {
    if (plantIndex === 0) {
      plantIndex = 1;
    } else {
      plantIndex = 0;
    }
  }

  drawPlant(seaweed1, seaweed1Pos[0], seaweed1Pos[1]);
  drawPlant(seaweed2, seaweed2Pos[0], seaweed2Pos[1]);
  drawPlant(seaweed3, seaweed3Pos[0], seaweed3Pos[1]);

  drawPlant(coral1, coral1Pos[0], coral1Pos[1]);
  drawPlant(coral2, coral2Pos[0], coral2Pos[1]);
  drawPlant(coral3, coral3Pos[0], coral3Pos[1]);
}

// prints information about game to user; score win/loss etc
function endScreen() {
  drawBackground();

  endMusic.setVolume(0.6);

  let timeOut = "You ran out of time!";
  let killer = "You hit too many fish!";
  let cleaner = "You cleaned all the trash!";

  // pacific garbage patch = 200,000 tonnes
  // get kgs as a percentage of this value
  let percentCleaned = parseFloat((parseFloat(kgs) * 0.1) / 200000);

  // get how many seconds it took user to clean
  // find how long it would take to clean 100%
  // convert to hours
  let timeToClean = parseInt(((parseFloat(TIMER_VALUE) - parseFloat(timer)) * (100 / percentCleaned)) / 3600);

  // format percentCleaned, after using it as a float in the previous expression
  percentCleaned = nf(percentCleaned, 1, 7);

  let pointsHeight = height * 0.5;
  let kgsHeight = height * 0.65;

  rectMode(CENTER);
  fill("rgba(139, 139, 139, 0.65)"); // transparent grey
  rect(width / 2, height / 2, 350, 500, 25);

  textSize(70);
  if (!lose) {
    fill("#0de23b");
    text("YOU\nWIN", width / 2, height * 0.2);
  } else {
    fill("red");
    text("YOU\nLOSE", width / 2, height * 0.2);
  }

  textSize(25);
  if (timer <= 0) {
    text(timeOut, width / 2, height * 0.4);
  } else if (hitFish) {
    text(killer, width / 2, height * 0.4);
  } else {
    text(cleaner, width / 2, height * 0.4);
  }
  
  textSize(20);
  if (kgs !== 0) {
    fill("#961f1f"); // red
    text(`The amount of trash you collected would only clean ${percentCleaned}% of the great pacific garbage patch.\nIt would take ${timeToClean} hours to clean it all at this pace.\nDo your part to reduce waste.`, width * 0.5, height * 0.56, 325);
    pointsHeight = height * 0.45;
    kgsHeight = height * 0.5;
  }

  textSize(25);

  fill(225); //grey
  textAlign(LEFT);
  text("Points earned: ", width * 0.25, pointsHeight);
  text("KG of trash cleaned: ", width * 0.25, kgsHeight);

  textAlign(RIGHT);
  text(score, width * 0.75, pointsHeight);
  text(kgs, width * 0.75, kgsHeight);
  textAlign(CENTER);
  
  fill("gold");
  textSize(30);
  text("Click here to try again", width / 2, height * 0.85);
  rectMode(CORNER);

  if (mouseX > 145 && mouseX < 455 && mouseY > 470 && mouseY < 520) {
    cursor(HAND);

    if (mouseIsPressed) {
      reset();
      gameState = 0;
    }
  }
}

function drawBackground() {
  // sky
  texture(skyImage);
  rect(0, 0, width, SKY_HEIGHT);

  drawSun();

  // sea
  texture(seaImage);
  rect(0, SKY_HEIGHT, width, SEA_HEIGHT);

  // sand
  texture(sandImage);
  rect(0, SKY_HEIGHT + SEA_HEIGHT, width, SAND_HEIGHT);
}

// draw sun on top right of canvas;
function drawSun() {
  fill("gold");

  if (frameCount % 60 === 0) {
    if (sunIndex === 0) {
      sunIndex = 1;
    } else {
      sunIndex = 0;
    }
  }

  texture(sunSprites[sunIndex]);
  circle(width, 0, 200);
}

// handles moving and drawing to screen of submarine
function subMoveDraw() {
  // move sub
  if (keyIsDown(87)) { // w
    subY = subY - 2;
  }
  if (keyIsDown(65)) { // a
    subX = subX - 2;
    subIndex = 1;
  }
  if (keyIsDown(83)) { // s
    subY = subY + 2;
  }
  if (keyIsDown(68)) { // d
    subX = subX + 2;
    subIndex = 0;
  }

  subY = constrain(subY, SKY_HEIGHT, SKY_HEIGHT + SEA_HEIGHT - 80);
  subX = constrain(subX, 0, width - 100);

  // draw sub
  texture(subSprites[subIndex]);
  rect(subX, subY, 100, 100);
}

// handles drawing and tracking of points
function scoreHandling() {
  rectMode(CENTER);
  fill("rgb(212, 170, 30)"); // golden

  // draw 3 capsules to hold text
  rect(width * 0.2, 15, 60, 30);
  circle(width * 0.2 - 30, 15, 30);
  circle(width * 0.2 + 30, 15, 30);

  rect(width / 2, 23, 100, 46);
  circle(250, 23, 46);
  circle(350, 23, 46);

  rect(width * 0.8, 15, 60, 30);
  circle(width * 0.8 - 30, 15, 30);
  circle(width * 0.8 + 30, 15, 30);

  // draw text
  fill(0);
  textSize(13);
  text("TIME REMAINING", width / 2, 35, 200, 50);
  text("POINTS", width * 0.2, 35, 200, 50);
  text("WEIGHT", width * 0.8, 35, 200, 50);

  text(score, width * 0.2, 50, 200, 50);
  text(kgs, width * 0.8, 50, 200, 50);

  textSize(25);
  text(timer, width / 2, 65, 200, 50);

  rectMode(CORNER);

  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
}

// draws fish to canvas 
function drawFish() {
  texture(dolphinImage);
  rect(450, 150, 100, 70);

  texture(fishImage);
  rect(60, 250, 80, 55);

  texture(turtleImage);
  rect(110, 400, 60, 40);

  texture(jellyfishImage);
  rect(375, 450, 60, 80);

  // collision logic

  // dolphin
  if ((subX > 350) && (subX < 650) && (subY > 100) && (subY < 180) && !dolphinCaught) {
    dolphinImage = emptyImage;
    score -= 400;

    dolphinSound.setVolume(0.2);
    dolphinSound.play();

    dolphinCaught = true;
  }

  // fish
  if (subX > 0 && subX < 120 && subY > 180 && subY < 270 && !fishCaught) {
    fishImage = emptyImage;
    score -= 150;

    fishSound.play();

    fishCaught = true;
  }

  // turtle
  if (subX > 20 && subX < 150 && (subY > 330) && (subY < 420) && !turtleCaught) {
    turtleImage = emptyImage;
    score -= 250;

    turtleSound.play();

    turtleCaught = true;
  }

  // jellyfish
  if ((subX > 275) && (subX < 435) && (subY > 375) && (subY < 525) && !jellyfishCaught) {
    jellyfishImage = emptyImage;
    score -= 200;

    jellySound.play();

    jellyfishCaught = true;
  }

}

// draws trash to canvas
function drawTrash() {
  texture(netImage);
  rect(450, 300, 100, 100);

  texture(bootImage);
  rect(100, 500, 50, 50);

  texture(bagImage);
  rect(300, 150, 50, 50);

  texture(ringsImage);
  rect(50, 150, 50, 50);

  // collision logic 

  // net
  if (subX > 350 && subX < 550 && subY > 220 && subY < 380 && !netCleaned) {
    netImage = emptyImage;
    score += 200;
    kgs += 2;

    trashSound.play();

    netCleaned = true;
  }

  // boot
  if (subX > 0 && subX < 150 && subY > 420 && subY < 550 && !bootCleaned) {
    bootImage = emptyImage;
    score += 50;
    kgs += 1;

    trashSound.play();

    bootCleaned = true;
  }

  // bag
  if (subX > 210 && subX < 330 && subY < 180 && !bagCleaned) {
    bagImage = emptyImage;
    score += 100;
    kgs += 0.5;

    trashSound.play();

    bagCleaned = true;
  }

  // rings
  if (subX > 0 && subX < 100 && subY < 180 && !ringsCleaned) {
    ringsImage = emptyImage;
    score += 150;
    kgs += 0.2;

    trashSound.play();

    ringsCleaned = true;
  }
}

// draw a plant at bottom of canvas
// takes in an array of frames and x y coordinates.
function drawPlant(plant, x, y) {
  texture(plant[plantIndex]);
  rect(x, y, 60, 100);
}