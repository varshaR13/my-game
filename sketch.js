var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var gameover, gameoverImg
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var score = 0

var gameState = "play"

function preload() {

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")
  gameoverImg = loadImage("assets/game_over.jpg")
  bulletImg = loadImage("assets/bullet.png")

  overImg = loadImage("assets/restart.png")

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)


  gameover = createSprite(displayWidth / 2, displayHeight / 2 - 200);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.8


  restart = createSprite(displayWidth / 2, displayHeight / 2 + 100)
  restart.addImage(overImg)
  restart.scale = 0.5



  //creating group for zombies    
  zombieGroup = new Group();

  bulletGroup = new Group();

}

function draw() {
  background(0);

  drawSprites();

  if (gameState == "play") {

    gameover.visible = false
    restart.visible = false

    //moving the player up and down and making the game mobile compatible using touches
    if (keyDown("UP_ARROW") || touches.length > 0) {
      player.y = player.y - 30
    }
    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      player.y = player.y + 30
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if (keyWentDown("space")) {
      player.addImage(shooter_shooting)
      bullet = createSprite(player.x, player.y)
      bullet.addImage(bulletImg)
      bullet.scale = 0.2
      bullet.velocityX = 5

      bulletGroup.add(bullet)
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if (keyWentUp("space")) {
      player.addImage(shooterImg)
    }


    //destroy zombie when player touches it
    if (zombieGroup.isTouching(player)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(player)) {
          gameState = "end"
        }
      }
    }


    if (zombieGroup.isTouching(bulletGroup)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy()
          bulletGroup.destroyEach()
          score = score + 5
        }
      }
    }

    enemy();

    textSize(30)
    fill("red")
    text("Score : " + score, width / 2, 30)

  }

  else if (gameState == "end") {
    // player.destroy()
    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    // bg.visible = false

    gameover.visible = true
    restart.visible = true


    if(mousePressedOver(restart)){
      reset()
    }
  }

}


function reset(){
  gameState = "play"

  score = 0
}


//creating function to spawn zombies
function enemy() {
  if (frameCount % 50 === 0) {

    //giving random x and y positions for zombie to appear
    zombie = createSprite(width, random(100, height - 100), 40, 40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -6
    zombie.debug = true
    zombie.setCollider("rectangle", 0, 0, 400, 400)

    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }

}
