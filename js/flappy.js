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
var gastersPosition = [];
var newHeart;
var newGaster;
var gaster;
var collectedHearts = new Array(11).fill(0);
var collectedGasters = new Array(11).fill(0);
var gasters = [];
var gasterInterval = 4;
var levelText = " ";
var text;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("playerImg","../assets/frisk.png");
  game.load.audio("score","../assets/point.ogg");
  game.load.image("pipeBlock","../assets/bone.png");
  game.load.image("sans","../assets/sans copy.png");
  game.load.image("gaster","../assets/gaster.png");
  game.load.image("heart","../assets/heart.png");
  game.load.image("blue","../assets/blue.png");
  game.load.image("cyan","../assets/cyan.png");
  game.load.image("purple","../assets/purple.png");
  game.load.image("orange","../assets/orange.png");
  game.load.image("yellow","../assets/yellow.png");
  game.load.image("spear","../assets/spear.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
  game.stage.setBackgroundColor("#070332");
  game.add.text(135,20,"welcome to my game",{font: "60px Langdon", fill: "#FFFFFF"});
  text = game.add.text(135,220,"press enter to start",{font: "40px 8BitOperator JVE (Undertale Dialogue Font)", fill: "#FFFFFF"});
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
}

function start(){
  text.destroy();
  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(spaceHandler);
  game.add.text(8 ,20,"score :",{font: "25px Langdon", fill: "#FFFFFF"});
  labelScore = game.add.text(80,19,"0", {font: "30px Langdon", fill:"#FFFFFF"});
  levelText = game.add.text(20 ,360,"level 1",{font: "30px Langdon", fill: "#FFFFFF"});
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
    gasterInterval*Phaser.Timer.SECOND,
    generateGaster);
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

  for(var i=0; i<hearts.length; i++){
    if(game.physics.arcade.overlap(player,hearts[i])){
      updateScore();
      collectedHearts[heartsPosition[i]] = 1;
      hearts[i].destroy();
      hearts.splice(i,1);
      heartsPosition.splice(i,1);
    }
  }

  for(var j=0; j<gasters.length; j++){
    if(game.physics.arcade.overlap(player,gasters[i])){
      updateScore2();
      collectedGasters[j] = 1;
      gasters[j].destroy();
      gasters.splice(j,1);
    }
  }

  if(score>=5 && score<10){
    changeBackground();
    levelText.destroy();
    levelText = game.add.text(20, 360,"level 2",{font: "30px Langdon", fill: "#FFFFFF"});
  }

  if(score>=10){
    changeBackground2();
    pipeInterval = 1;
    levelText.destroy();
    levelText = game.add.text(20, 360,"level 3",{font: "30px Langdon", fill: "#FFFFFF"});
  }

}

function spaceHandler(){
  game.sound.play("score");
}

function changeScore(){
  score++;
  labelScore.setText(score.toString());
}

function changeScore2(){
  score--;
  labelScore.setText(score.toString());
}

function generatePipe(){
  var gapStart = game.rnd.integerInRange(1,5);
  for(var count=0; count<8; count++){
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
  //document.getElementById('game-over').style.display = 'block';
  //document.getElementById('game-over-overlay').style.display = 'block';
  isGameOver = true;
  game.paused = true;
  var answer = prompt("would you like to play again? enter y or n");
  if(answer == "y"){
    score = 0;
    gameGravity = 200;
    game.paused = false;
    game.state.restart();
  }
  else{
    endScreen();
    game.destroy();
  }
}

function endScreen(){
  player.destroy(true);
  for(var i=0; i<pipes.length; i++){
    pipes[i].destroy(true);
  }
  for(var j=0; j<hearts.length; j++){
    hearts[j].destroy(true);
  }
  for(var k=0; k<gasters.length; k++){
    gasters[k].destroy(true);
  }
  game.stage.setBackgroundColor("#000000");

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

function generateGaster(){
  pickGaster();
  var gaster = game.add.sprite(750,20,newGaster);
  gaster.scale.x = 0.5;
  gaster.scale.y = 0.5;
  gasters.push(gaster);
  game.physics.arcade.enable(gaster);
  gaster.body.velocity.x = -150;
  gaster.body.velocity.y = 20;
}

function updateScore(){
  changeScore();
  changeScore();
}

function updateScore2(){
  changeScore2();
  changeScore2();
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

function pickGaster(){
  var diceRoll = game.rnd.integerInRange(0,2);
  switch(diceRoll){
    case 0:
      newGaster = "gaster";
      gastersPosition.push(0);
      break;
    case 1:
      newGaster = "spear";
      gastersPosition.push(1);
      break;
    case 2:
      newGaster = "cyan";
      gastersPosition.push(2);
      break;
  }
}

function changeBackground(){
  game.stage.setBackgroundColor("#320639");
}

function changeBackground2(){
  game.stage.setBackgroundColor("#063925");
}

function changeGravity(g) {
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}
