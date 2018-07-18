// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(750, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var pipes = [];
var pipeInterval = 1.75;
var hearts = [];
var heartInterval = 3.5;
var heartsPosition = [];
var newHeart;
var collectedHearts = new Array(11).fill(0);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("playerImg","../assets/frisk.png");
  game.load.audio("score","../assets/point.ogg");
  game.load.image("pipeBlock","../assets/bone.png");
  game.load.image("sans","../assets/sans copy.png");
  game.load.image("heart","../assets/heart.png");
  game.load.image("blue","../assets/blue.png");
  game.load.image("cyan","../assets/cyan.png");
  game.load.image("purple","../assets/purple.png");
  game.load.image("orange","../assets/orange.png");
  game.load.image("yellow","../assets/yellow.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
  game.stage.setBackgroundColor("#070332");
  game.add.text(135,20,"welcome to my game",{font: "60px Langdon", fill: "#FFFFFF"});
  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(spaceHandler);
  game.add.text(8 ,20,"score :",{font: "25px Langdon", fill: "#FFFFFF"});
  labelScore = game.add.text(80,19,"0", {font: "30px Langdon", fill:"#FFFFFF"});
  game.add.sprite(217,80,"sans");

  player = game.add.sprite(100,200,"playerImg");
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enable(player);
  player.body.gravity.y = 200;
  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

  game.time.events.loop(
    pipeInterval*Phaser.Timer.SECOND,
    generatePipe);
  game.time.events.loop(
    heartInterval*Phaser.Timer.SECOND,
    generateHeart);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(
    player,
    pipes,
    gameOver);
  if(player.y < 0 || player.y > 400){
    gameOver();
  }

  for(var i=0; i<hearts .length; i++){
    if(game.physics.arcade.overlap(player,hearts[i])){
      updateScore();
      collectedHearts[heartsPosition[i]] = 1;
      hearts[i].destroy();
      hearts.splice(i,1);
      heartsPosition.splice(i,1);
    }
  }

  if(score>=5 && score<10){
    changeBackground();
  }

  if(score>=10){
    changeBackground2();
    pipeInterval = 1;
  }

}

function spaceHandler(){
  game.sound.play("score");
}

function changeScore(){
  score++;
  labelScore.setText(score.toString());
}

function generatePipe(){
  var gapStart = game.rnd.integerInRange(1,5);
  for(var count=0; count<8; count+=1){
    if(count!= gapStart && count!= gapStart+1){
        addPipeBlock(750, count*50);
    }
  }
  changeScore();
}

function addPipeBlock(x,y){
  var block = game.add.sprite(x,y,"pipeBlock");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function playerJump() {
  player.body.velocity.y = -150;
}

function gameOver(){
  registerScore(score);
  game.state.restart();
  score = 0;
}

function generateHeart(){
  pickHeart();
  var heart = game.add.sprite(750,20,newHeart);
  heart.scale.x = 0.5;
  heart.scale.y = 0.5;
  hearts.push(heart);
  game.physics.arcade.enable(heart);
  heart.body.velocity.x = -150;
  heart.body.velocity.y = 20;
}

function updateScore(){
  changeScore();
  changeScore();
}

function pickHeart(){
  var diceRoll = game.rnd.integerInRange(0,5);
  switch(diceRoll){
    case 0:
      newHeart = "heart";
      heartsPosition.push(0);
      break;
    case 1:
      newHeart = "blue";
      heartsPosition.push(1);
      break;
    case 2:
      newHeart = "cyan";
      heartsPosition.push(2);
      break;
    case 3:
      newHeart = "purple";
      heartsPosition.push(3);
      break;
    case 4:
      newHeart = "orange";
      heartsPosition.push(4);
      break;
    case 5:
      newHeart = "yellow";
      heartsPosition.push(5);
      break;
  }
}

function changeBackground(){
  game.stage.setBackgroundColor("#320639");
}

function changeBackground2(){
  game.stage.setBackgroundColor("#063925");
}
