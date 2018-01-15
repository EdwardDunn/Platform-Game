/*
Description: Game.js, this script contains all the javascript required for the game to work on the JS_game html page.
New levels can be added by:
- Adding an extra array of objects in LEVEL_ENEMIES
- Adding an extra object to the array LEVEL_PLAYER_CHARACTERS
- Adding an extra object to the array LEVEL_CLOUDS
- Making a new background or copying an existing one and incrementing the number by 1
Author: Open Source - Contributor list can be seen in GitHub
*/


//CONFIG
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const SPACE = 32;
const P = 80;
const M = 77;
const LEVEL_COMPLETION_SCORE = 3000;

const LEVEL_ENEMIES = [
	[
		{ name: "enemy2", x: 80, y: 60, y2: 200 },
		{ name: "zombie", x: 40, y: 50, y2: 200 }
	],
	[
		{ name: "enemy2", x: 80, y: 60, y2: 200 },
		{ name: "bad_guy", x: 60, y: 50, y2: 200 }
	],
	[
		{ name: "enemy2", x: 80, y: 60, y2: 200 },
		{ name: "skull_baddie", x: 60, y: 50, y2: 200 }
	],
	[
		{ name: "enemy2", x: 80, y: 60, y2: 200 },
		{ name: "newchar", x: 120, y: 120, y2: 170 }
	],
	[
		{ name: "enemy2", x: 80, y: 60, y2: 200 },
		{ name: "newchar", x: 120, y: 120, y2: 170 },
		{ name: "sword", x: 80, y: 14, y2: 170 },
		{ name: "enemyGuy", x: 80, y: 73, y2: 190 }
	]
];

const LEVEL_PLAYER_CHARACTERS = [
	{ name: "good_guy", x2: 100, y2: 120 },
	{ name: "good_girl", x2: 100, y2: 120 },
	{ name: "good_girl", x2: 100, y2: 120 },
	{ name: "good_guy", x2: 100, y2: 120 },
	{ name: "ninja", x2: 450, y2: 120 },
]

const LEVEL_CLOUDS = [
	{ name: "cloud", x: 60, y: 34 },
	{ name: "cloud2", x: 65, y: 50 },
	{ name: "cloud3", x: 60, y: 40 },
	{ name: "cloud3", x: 60, y: 40 },
	{ name: "cloud3", x: 60, y: 40 }
]
//END CONFIG

//flag to take care of y axis cordinate increase or decrease
//z to set a interval at which flag is changed
var flag = 1;
var z = 0;
// Add state to check if user is playing, complete or game-over
var state = 'instructions';

var currentLevel = 1;
var collectedCoins = 0;
var playerCharacter;
var background;
var scoreBoard;
var coinScoreBoard;
var levelDisplay;
var enemyCharacters = [];
var coins = [];
var clouds = [];
var keysPressed = { LEFT: false, UP: false, RIGHT: false, P: false, M: false };
var gamePaused = false;
let musicMuted = false;
let musicToggled = false; //this is just for muting music when game paused
let dir; // which way character faces. 1 is right, -1 is left

function KeyDown(event) {
	//avoid auto-repeated keydown event
	if (event.repeat) {
		return;
	}

	var key;
	key = event.which;
	keysPressed[key] = true;

	if (keysPressed[LEFT]) {
		moveLeft();
	}
	if (keysPressed[RIGHT]) {
		moveRight();
	}
	//when the character is on the ground and player press Jump then play audio, not only when key is pressed
	if (keysPressed[UP] && playerCharacter.hitGround) {
		moveUp();
	}
	// Add SPACE key to restart game
	if (keysPressed[SPACE]) {
		restartGame();
	}
	if (keysPressed[P]) {
		keysPressed[P] = false;
		pauseGame();
	}

	if (keysPressed[M]) {
		keysPressed[M] = false;
		muteMusic();
	}
}

// Toggle music at 'M' key press
function muteMusic() {
    musicMuted = !musicMuted;
	var imgButton = document.getElementById("audioButton");
    if (musicMuted) {
		imgButton.src = "Pictures/audioOff.png";
		audio.pause();
    }
    else {
		imgButton.src = "Pictures/audioOn.png";
		audio.load();
    }
}

function pauseGame() {
	gamePaused = !gamePaused;
}

function KeyUp(event) {
	var key;
	key = event.which;
	keysPressed[key] = false;
	switch (key) {
		case UP:
			playerCharacter.speedY += playerCharacter.gravity;
			break;
		case LEFT:
			if (keysPressed[RIGHT]) {
				moveRight();
			} else {
				playerCharacter.speedX = 0;
			}
			break;
		case RIGHT:
			if (keysPressed[LEFT]) {
				moveLeft();
			} else {
				playerCharacter.speedX = 0;
			}
	}
}


function showInstructions() {
	gameArea.init();

	//background
	background = new component();
	background.init(900, 400, "Pictures/background_1.jpg", 0, 0, "image", 1, true);
	var modal = document.getElementById('instructionsModal');
	modal.style.display = "block";
}

function initialize_game() {
	currentLevel = 1;
	collectedCoins = 0;

	audio = document.getElementById("bgm");
	audio.autoplay = true;
	audio.loop = true;
	
	if (!musicMuted) {
		audio.load();
	}

	//generating coins at random positions
	for (var i = 0; i < 100; i++) {
		var coinWidth = 40;
		var x = Math.floor((Math.random() * gameArea.canvas.width) + i * gameArea.canvas.width / 2);
		var y = Math.floor(Math.random() * 150 + 30); //150 is canvas height - baseline(150) - char height - 30 (space on top)

		coins[i] = new component();
		coins[i].init(coinWidth, coinWidth, "Pictures/coin.png", x, y, "image", 1);
	}

	startLevel(1);
}

function startLevel(levelNumber) {
	//to synchronize the start cordinate of enemy character
	flag = 1;
	z = 0;
	dir = 1; //face in right direction

	//player character
	playerCharacter = new component();
	let char = LEVEL_PLAYER_CHARACTERS[levelNumber - 1];
	playerCharacter.init(60, 70, `Pictures/${char.name}.png`, char.x2, char.y2, "image", 1, undefined, char.name);

	//background
	background = new component();
	background.init(900, 400, `Pictures/background_${levelNumber}.jpg`, 0, 0, "image", 1);

	//score
	scoreBoard = new component();
	scoreBoard.init("30px", "Consolas", "black", 50, 40, "text", 1);

	//collected Coins
	coinScoreBoard = new component();
	coinScoreBoard.init("30px", "Consolas", "black", 280, 40, "text", 1);

	//current level display
	levelDisplay = new component();
	levelDisplay.init("30px", "Consolas", "black", 600, 40, "text", 1);

	//loop for creating new enemy characters setting a random x coordinate for each
	for (var i = 0; i < 100; i++) {
		enemyCharacters[i] = new component();

		var x = Math.floor((Math.random() * (1400 + i * 500)) + (500 * i + 900));

		//enemyType is the type of enemy: flying (0), walking (1), rotating (2), entering from the left (3)..
		//when you want to add a new type of enemy, increment the number inside the Math.random and
		//insert in the correct case the enemy
		var enemyType = Math.floor(Math.random() * (LEVEL_ENEMIES[levelNumber - 1].length));

		let enemy = LEVEL_ENEMIES[levelNumber - 1][enemyType];
		if (enemy.name === "enemyGuy") {
			//in this case the x value is calculate as the clouds
			x = Math.floor((Math.random() * (900 - i * 300) + 1));
		}
		enemyCharacters[i].init(enemy.x, enemy.y, `Pictures/${enemy.name}.png`, x, enemy.y2, "image", enemyType);

	}

	//loop for creating new clouds setting a random x coordinate for each
	for (var i = 0; i < 100; i++) {
		var x = Math.floor((Math.random() * (900 - i * 300) + 1));
		clouds[i] = new component();

		let cloud = LEVEL_CLOUDS[levelNumber -1];
		clouds[i].init(cloud.x, cloud.y, `Pictures/${cloud.name}.png`, x, 40, "image", 1);
	}

	//call start function
	gameArea.init();
	gameArea.start();
}

/**
 * @type {{canvas: Element, start: gameArea.start, clear: gameArea.clear, stop: gameArea.stop}}
 */
var gameArea = {
	init: function () {
		this.canvas = document.getElementById("canvas");

		this.canvas.width = 900;
		this.canvas.height = 400;
		this.context = this.canvas.getContext("2d");

		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.score = 0;
		this.bonusActiveTime = 0;
		this.bonusInterval = null;
		this.coinScoreActiveTime = 0;
		this.coinScoreInterval = null;

	},

	start: function () {
		this.frameNo = 0;
		this.score = 0;
		// hide modals
		var modals = document.getElementsByClassName('modal');
		for (var i = 0; i < modals.length; i++) {
			var modal = modals[i];

			modal.style.display = "none";
		}

		//update interval
		this.interval = setInterval(updateGameArea, 20);
	},

	//function used for refreshing page
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	//function used for stopping the game
	stop: function () {
		clearInterval(this.interval);
	}
};

function component() {
	this.init = function (width, height, color, x, y, type, h, initialShow = false, charName = undefined) {
		//h to test if it is enemy 1 or 2
		this.h = h;
		this.alive = true;
		this.alive = true;

		this.color = color;
		//test if component is image
		this.type = type;

		this.ctx = gameArea.context;

		if (type === "image") {
			this.image = new Image();
			this.image.src = this.color;
			this.image.width = width;
			this.image.height = height;

			if (charName) {
				this.imageMirror = new Image();
				this.imageMirror.src = `Pictures/${charName}_left.png`
				this.imageMirror.width = width;
				this.imageMirror.height = height;
			}

			if (initialShow) {
				var imgCopy = this.image;
				var ctxCopy = this.ctx;
				this.image.onload = function () {
					ctxCopy.drawImage(imgCopy, this.x, this.y, this.width, this.height);
				}
			}
		}

	this.width = width;
	this.initHeight = height; // to get squeezed height later
	this.alpha = 1;
	this.height = height;

	//change components position
	this.speedX = 0
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.gravity = 1.5;
	//indicates if the character is on the ground or not
	this.hitGround = true;

	//angle
	this.angle = 0;
}

	//function to decide to decide what to display on screen, text, image or fill color
	this.update = function (callback) {
		if (this.type === "image") {
			this.ctx.globalAlpha = this.alpha;
			if (this.angle != 0) {
				this.ctx.save();
				this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
				this.ctx.rotate(this.angle);
				this.ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
				this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
				this.ctx.restore();
			} else {
				this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			}
		} else if (this.type === "text") {
			this.ctx.font = this.width + " " + this.height;
			this.ctx.fillStyle = this.color;
			this.ctx.fillText(this.text, this.x, this.y);
		} else {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};

	//enemy character collision function
	this.crashWith = function (otherobj) {
		var left = this.x;
		var right = this.x + (this.width);
		var top = this.y;
		var bottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((bottom < othertop + 10) ||
			(top > otherbottom - 20) ||
			(right < otherleft + 15) ||
			(left > otherright - 15)) {
			crash = false;
		}
		return crash;
	};

	this.jumpsOn = function (otherobj) {
		var bottomY = this.y + (this.height);
		var middleX = this.x + (this.width / 2);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var smoosh = false;
		if ((bottomY > othertop - 15) &&
			(bottomY < otherbottom - (otherobj.height - 10)) &&
			(middleX > otherleft) &&
			(middleX < otherright)) {
			smoosh = true;
		}
		return smoosh;
	};

	//gravity property
	this.newPos = function() {
		this.y += this.speedY; //increment y position with his speed
		this.speedY += this.gravity; //increment the y speed with the gravity
		this.x += this.speedX;
		this.hitBottom();
		//console.log(`${this.x},${this.y}`);
	};

	//set floor on canvas
	this.hitBottom = function() {
		var rockbottom = gameArea.canvas.height - this.height -150;
		if (this.y > rockbottom){
			this.y = rockbottom;
			this.hitGround = true;
		}
	}

	this.setAlive = function (alive) {
		this.alive = alive;
	}
	this.isAlive = function () {
		return this.alive;
	}

	//check if there was a change in direction character is facing
	// newDir takes either -1 (left move) or 1 (right move)
	this.changeDir = function (newDir) {
		if (dir !== newDir) {
			[playerCharacter.image, playerCharacter.imageMirror] = [playerCharacter.imageMirror, playerCharacter.image];
			dir = newDir;
		}
	}
}

function gameOver() {
	interval && clearInterval(interval);
	state = 'game-over';
	var modal = document.getElementById('gameOverModal');
	modal.style.display = "block";

	audio = document.getElementById("bgm");
	audio.pause();

	if (!musicMuted) {
		gameover = document.getElementById("gameover")
		gameover.autoplay = true;
		gameover.load();
	}
}

function restartGame(){
	gameArea.stop();
	initialize_game();
}

function gameComplete(){
    state = 'complete';
	var modal = document.getElementById('gameCompleteModal');
	modal.style.display = "block";
	gameArea.stop();

	if (!musicMuted) {
		audio = document.getElementById("bgm");
		audio.pause();
		gamewon = document.getElementById("gamewon")
		gamewon.autoplay = true;
		gamewon.load();
	}
}

//Adjust character to a valid position if it moves out of border
function correctCharacterPos() {
	if (playerCharacter.y < 0) {
		playerCharacter.speedY = 0;
		playerCharacter.y = 0;
	}
	if (playerCharacter.x < 0) {
		playerCharacter.speedX = 0;
		playerCharacter.x = 0;
	}
	if (playerCharacter.x > gameArea.canvas.width - playerCharacter.width) {
		playerCharacter.speedX = 0;
		playerCharacter.x = gameArea.canvas.width - playerCharacter.width;
	}
	if (playerCharacter.y > gameArea.canvas.height - playerCharacter.height) {
		playerCharacter.speedY = 0;
		playerCharacter.y = gameArea.canvas.height - playerCharacter.height;
	}
}

function startGameElements() {
	background.update();
}

function flashScore(){
    if(scoreBoard.color == "black"){
        scoreBoard.color = "white";
    }else{
        scoreBoard.color = "black";
   }

   if(gameArea.bonusActiveTime > 1200){
        scoreBoard.color = "black";
       clearInterval(gameArea.bonusInterval);
   }
    gameArea.bonusActiveTime += 150;
}

function flashCoinScore() {
	if (coinScoreBoard.color === "black") {
		coinScoreBoard.color = "white";
	} else {
		coinScoreBoard.color = "black";
	};

	if (gameArea.coinScoreActiveTime > 1200) {
		coinScoreBoard.color = "black";
		clearInterval(gameArea.coinScoreInterval);
	};
	gameArea.coinScoreActiveTime += 150;
}

 //Update game area for period defined in game area function, current 20th of a millisecond (50 times a second)
function updateGameArea() {
	//loop for enemy collision
	var pausemodal = document.getElementById('gamePauseModal');
	if (gamePaused) {
		pausemodal.style.display = "block";
		if (!musicMuted) {
			muteMusic();
			musicToggled = true;
		}
		return;
	}
	else {
		pausemodal.style.display = "none";
		if (musicToggled) {
			muteMusic();
			musicToggled = false;
		}
	}

	for (var i = 0; i < enemyCharacters.length; i++) {
		if (enemyCharacters[i].isAlive()) {
			if (playerCharacter.jumpsOn(enemyCharacters[i])) {
				enemyCharacters[i].setAlive(false);
				incrementScore(100);
				gameArea.bonusActiveTime = 0;
				gameArea.bonusInterval = setInterval(flashScore,150);

			}
			else if (playerCharacter.crashWith(enemyCharacters[i])) {
				gameArea.stop();
				gameOver();
			}
		}
	}

	//loop for coin collision
	for (var i = 0; i < coins.length; i++) {
		if (coins[i].isAlive()) {
			if (playerCharacter.crashWith(coins[i])) {
				//increase collected coins counter
				collectedCoins++;
                gameArea.score += 100;
				coins[i].setAlive(false);
				coins[i].alpha = 0;
				//animate coin score board
				gameArea.coinScoreActiveTime = 0;
				gameArea.coinScoreInterval = setInterval(flashCoinScore, 150);
			}
		}
	}

	//clear canvas before each update
	gameArea.clear();

	//update background
	background.update();

	//score update
	scoreBoard.text = "SCORE: " + gameArea.score;
	scoreBoard.update();

	//collected coins update
	coinScoreBoard.text = "COINS: " + collectedCoins;
	coinScoreBoard.update();

	//increment frame number for score counter
	incrementFrameNumber(2);
	incrementScore(2);

	//LevelDisplay update
	levelDisplay.text = "Level " + currentLevel;
	levelDisplay.update();

	//enemy update
	for (var i = 0; i < 100; i++) {
		enemyCharacters[i].update();
	}

	//coins update
	for (var i = 0; i < coins.length; i++) {
		coins[i].update();
	}

	//cloud update
	for (var i = 0; i < 100; i++) {
		clouds[i].x += 0.5;
		clouds[i].update();
	}

	//when frame number reaches 3000 (point at which obstacles end) end game
	//check current level, if more than 2 (because there is two levels currently), show game complete modal
	if (gameArea.score >= LEVEL_COMPLETION_SCORE) {
		gameArea.stop();
		currentLevel++;

		console.log(currentLevel);
		if(currentLevel > LEVEL_CLOUDS.length) gameComplete();
		else startLevel(currentLevel);

	}

	//player character update
	playerCharacter.newPos();
	correctCharacterPos();
	playerCharacter.update();

	//if statement to reverse the flag so that the y cordinate of birds would be changed
	//z keeps the track and change flag after every 35 iteration
	if (z == 35) {
		flag = !flag;
		z = 0;
	}
	//z increased in every iteration
	z++;
	//loop to set speed of enemy characters
	for (var i = 0; i < enemyCharacters.length; i++) {
		if (enemyCharacters[i].isAlive()) {
			//check if level is 3 or greater
			//vary the speed of enemy characters if level is 3 or greater
			if (currentLevel >= 3 && enemyCharacters[i].h) {
				if (currentLevel === 5 && enemyCharacters[i].h === 3) {
					enemyCharacters[i].x -= -4; //it enter from the left
				} else {
					enemyCharacters[i].x += -4;
				}

			}else{
				enemyCharacters[i].x += -2;
			}

			//if statement to check if y cordinate has to increase or decrease
			//should birds go up or down
			if (!enemyCharacters[i].h) {
				if (flag == 1) {
					enemyCharacters[i].y += -3;
				}
				else {
					enemyCharacters[i].y += +3;
				}
			}

			//if h===2 the enemy must rotate
			if (enemyCharacters[i].h === 2) {
				enemyCharacters[i].angle += 10 * Math.PI / 180;
			}

		}
		else { // if dead; enemy will be 'squeezed', fall to the ground and fade away. Feel free to improve by adding further animation.
			enemyCharacters[i].height = enemyCharacters[i].initHeight / 3;
			enemyCharacters[i].y += 10;
			enemyCharacters[i].alpha += -0.01;
			if (enemyCharacters[i].alpha < 0) {
				enemyCharacters[i].alpha = 0;
			}
			enemyCharacters[i].hitBottom();
		}
	}

	//loop to set speed of coin characters
	for (var i = 0; i < coins.length; i++) {
		coins[i].x += -2;
	}
}


function incrementFrameNumber(value) {
	gameArea.frameNo += value;
}

function incrementScore(value) {
	gameArea.score += value;
}

 //Stops player character from constantly moving after button move pressed
function stopMove(){
    playerCharacter.speedX = 0;
    playerCharacter.speedY = 0;
    if (playerCharacter.y < 0) {
        playerCharacter.speedY = 0;
        playerCharacter.y = 0;
    }
    if (playerCharacter.x < 0){
        playerCharacter.speedX = 0;
        playerCharacter.x = 0;
    }
    if (playerCharacter.x > gameArea.canvas.width-playerCharacter.width) {
        playerCharacter.speedX = 0;
        playerCharacter.x = gameArea.canvas.width-playerCharacter.width;
    }
}

function moveUp() {
	if(playerCharacter.hitGround && playerCharacter.y >= 170){
		playerCharacter.speedY = -20;
		playerCharacter.hitGround = false;
		
		if (!musicMuted) {
		  jump.autoplay = true;
		  jump.load();
		}
	}
}

function moveDown() {
    playerCharacter.speedY = 20;
}

function moveLeft() {
	playerCharacter.changeDir(-1);
	playerCharacter.speedX = -5;
}
function moveRight() {
	playerCharacter.changeDir(1);
	playerCharacter.speedX = 5;
}

var interval;

function moveLeftMouse() {
	interval = setInterval(moveLeft, 1);
}

function moveRightMouse() {
	interval = setInterval(moveRight, 1);
}

/* function moveUpMouse() {
	if (!musicMuted) {
		jump.autoplay = true;
		jump.load();
	}
	interval = setInterval(moveUp, 1);
}
 */
function onMouseUp() {
	clearInterval(interval);
	stopMove();
}
