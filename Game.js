/*
Description: Game.js, this script contains all the javascript required for the game to work on the JS_game html page.
New levels can be added by creating a new startLevel? function. It is recommended that a new background is used for each
level.
Author: Open Source - Contributor list can be seen in GitHub
*/

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const SPACE = 32;

//flag to take care of y axis cordinate increase or decrease
//z to set a interval at which flag is changed
var flag = 1;
var z=0;
// Add state to check if user is playing, complete or game-over
var state = 'instructions';

var currentLevel = 1;
var playerCharacter;
var background;
var scoreBoard;
var levelDisplay;
var enemyCharacters = [];
var clouds = [];
var keysPressed = {LEFT : false, UP : false, RIGHT : false};

/**
 * @param event
 * @constructor
 */
function KeyDown(event) {
	//avoid auto-repeated keydown event
	if (event.repeat) {
		return;
	}

    // console.log(event);
    var key;
    key = event.which;
    // console.log(key);
    keysPressed[key] = true;

	if (keysPressed[LEFT]) {
		moveLeft();
	}
	if (keysPressed[RIGHT]) {
		moveRight();
	}
	if (keysPressed[UP]) {
		jump_audio=document.getElementById("jump")
		jump.autoplay=true;
		jump.load();
		moveUp();
	}
	if (keysPressed[SPACE]) { // Add SPACE key to restart game (only if it's complete or game-over)
		if (state === 'game-over' || state === 'complete') {
            history.go(0);
        }
	}
}

/**
 * @param event
 * @constructor
 */
function KeyUp(event) {
    var key;
    key = event.which;
    // console.log(key);
    keysPressed[key] = false;
	switch (key) {
		case UP:
			playerCharacter.speedY = 0;
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
    background.init(900, 400, "Pictures/background.jpg", 0, 0, "image", 1, true);
    var modal = document.getElementById('instructionsModal');
    modal.style.display = "block";
}

function startGame() {
    flag= 1;
    z=0;
    currentLevel = 1;
	//player character
    playerCharacter = new component();
    playerCharacter.init(60, 70, "Pictures/good_guy.png", 100, 120, "image",1);

	//background
    background = new component();
    background.init(900, 400, "Pictures/background.jpg", 0, 0, "image",1);

	//score
    scoreBoard = new component();
    scoreBoard.init("30px", "Consolas", "black", 100, 40, "text",1);

	//current level display
    levelDisplay = new component();
    levelDisplay.init("30px", "Consolas", "black", 600, 40, "text",1);

    audio = document.getElementById("bgm");
    audio.autoplay=true;
    audio.loop=true;
    audio.load();



	//loop for creating new enemy characters setting a random x coordinate for each
	for (var i=0; i<100; i++) {
        var x = Math.floor((Math.random() * (1200 + i * 300 - 900 + i * 300)) + (300 * i + 900));
        //Random enemy character choose
        if(Math.floor(Math.random()*(2)))
        {
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(40, 50, "Pictures/zombie.png", x,200, "image",1);
        }
        else
        {
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(80, 60, "Pictures/enemy2.png", x,200, "image",0);
        }
    }

	//loop for creating new clouds setting a random x coordinate for each
	for (var i=0; i<100; i++) {
		var x = Math.floor((Math.random() * (900 - i * 300) + 1));;
				clouds[i] = new component();
				clouds[i].init(60, 34, "Pictures/cloud.png", x, 40, "image", 1);
	}

    gameArea.init();
    gameArea.start();
    //startAudio();
}

function startLevel2() {
    flag= 1;
    z=0;
    //player character
    playerCharacter = new component();
    playerCharacter.init(60, 70, "Pictures/good_girl.png", 100, 120, "image",1);

	//background
    background = new component();
    background.init(900, 400, "Pictures/background2.jpg", 0, 0, "image",1);

	//score
    scoreBoard = new component();
    scoreBoard.init("30px", "Consolas", "black", 100, 40, "text",1)

	//current level display
    levelDisplay = new component();
    levelDisplay.init("30px", "Consolas", "black", 600, 40, "text",1);

	//loop for creating new enemy characters setting a random x coordinate for each
	for (var i = 0; i < 100; i++) {
	    var x = Math.floor((Math.random() * (1400+i*500)) + (500*i+900));

        //Random enemy character choose
        if(Math.floor(Math.random()*(2)))
        {
            // console.log("enemy 1");
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(60, 50, "Pictures/bad_guy.png", x,200, "image",0);
        }
        else
        {
            // console.log("enemy 2");
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(80, 60, "Pictures/enemy2.png", x,200, "image",0);
        }

    }

	//loop for creating new clouds setting a random x coordinate for each
	for (var i=0; i<100; i++) {
		var x = Math.floor((Math.random() * (900 - i * 300) + 1));;
				clouds[i] = new component();
				clouds[i].init(65, 50, "Pictures/cloud2.png", x, 40, "image", 1);
	}

    //call start function
    gameArea.init();
    gameArea.start();
}

function startLevel3() {
    //to synchronize the start cordinate of enemy character
    flag = 1;
    z = 0;
    //player character
    playerCharacter = new component();
    playerCharacter.init(60, 70, "Pictures/good_girl.png", 100, 120, "image", 1);

    //background
    background = new component();
    background.init(900, 400, "Pictures/background_3.jpg", 0, 0, "image", 1);

    //score
    scoreBoard = new component();
    scoreBoard.init("30px", "Consolas", "black", 100, 40, "text", 1);

    //current level display
    levelDisplay = new component();
    levelDisplay.init("30px", "Consolas", "black", 600, 40, "text", 1);

    //loop for creating new enemy characters setting a random x coordinate for each
    for (var i = 0; i < 100; i++) {
        var x = Math.floor((Math.random() * (1400 + i * 500)) + (500 * i + 900));

        //if statement to choose random enemy from flying birds and skullman
        if (Math.floor(Math.random() * (2))) {
            // console.log("enemy 1");
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(60, 50, "Pictures/skull_baddie.png", x, 200, "image", 1);
        }
        else {
            // console.log("enemy 2");
            enemyCharacters[i] = new component();
            enemyCharacters[i].init(80, 60, "Pictures/enemy2.png", x, 200, "image", 0);
        }
    }

	//loop for creating new clouds setting a random x coordinate for each
	for (var i=0; i<100; i++) {
		var x = Math.floor((Math.random() * (900 - i * 300) + 1));;
				clouds[i] = new component();
				clouds[i].init(60, 40, "Pictures/cloud3.png", x, 40, "image", 1);
	}

    //call start function
    gameArea.init();
    gameArea.start();
}

function startLevel4() {
	//to synchronize the start cordinate of enemy character
	flag = 1;
	z = 0;
	//player character
	playerCharacter = new component();
	playerCharacter.init(60, 70, "Pictures/good_guy.png", 100, 120, "image", 1);

	//background
	background = new component();
	background.init(900, 400, "Pictures/background2.jpg", 0, 0, "image", 1);

	//score
	scoreBoard = new component();
	scoreBoard.init("30px", "Consolas", "black", 100, 40, "text", 1);

	//current level display
	levelDisplay = new component();
	levelDisplay.init("30px", "Consolas", "black", 600, 40, "text", 1);

	//loop for creating new enemy characters setting a random x coordinate for each
	for (var i = 0; i < 100; i++) {
		var x = Math.floor((Math.random() * (1400 + i * 500)) + (500 * i + 900));

		//if statement to choose random enemy from flying birds and skullman
		if (Math.floor(Math.random() * (2))) {
			// console.log("enemy 1");
			enemyCharacters[i] = new component();
			enemyCharacters[i].init(120, 120, "Pictures/newchar.png", x, 170, "image", 1);
		}
		else {
			// console.log("enemy 2");
			enemyCharacters[i] = new component();
			enemyCharacters[i].init(80, 60, "Pictures/enemy2.png", x, 200, "image", 0);
		}
	}

	//loop for creating new clouds setting a random x coordinate for each
	for (var i=0; i<100; i++) {
		var x = Math.floor((Math.random() * (900 - i * 300) + 1));;
				clouds[i] = new component();
				clouds[i].init(65, 50, "Pictures/cloud2.png", x, 40, "image", 1);
	}

//call start function
gameArea.init();
gameArea.start();
}

/**
 * @type {{canvas: Element, start: gameArea.start, clear: gameArea.clear, stop: gameArea.stop}}
 */
var gameArea = {
    init : function() {
        this.canvas = document.getElementById("canvas");

        this.canvas.width = 900;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.score = 0;
		this.bonusActiveTime = 0;
		this.bonusInterval = null;

    },

    start : function() {
        this.frameNo = 0;
        this.score = 0;
        // hide modals
        var modals = document.getElementsByClassName('modal');
        for(var i = 0; i < modals.length; i++)
        {
            var modal = modals[i];

            modal.style.display = "none";
        }

        //update interval
        this.interval = setInterval(updateGameArea, 20);
    },
    /*startAudio : function()
    {

    },*/
    //function used for refreshing page
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

	//function used for stopping the game
    stop : function() {
        clearInterval(this.interval);
    }
};

/**
 * @param width
 * @param height
 * @param color
 * @param x
 * @param y
 * @param type
 */
function component() {
    this.init = function(width, height, color, x, y, type, h, initialShow = false) {
	//h to test if it is enemy 1 or 2
	this.h=h;
	this.alive = true;
	this.alive = true;

	this.color = color;
	//test if component is image
	this.type = type;

	this.ctx = gameArea.context;

	if (type === "image") {
		this.image = new Image();
		this.image.src = color;
		this.image.src = this.color;
		this.image.width = width;
		this.image.height = height;

		if(initialShow)
		{
			var imgCopy = this.image;
			var ctxCopy = this.ctx;
			this.image.onload = function() {
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
	this.gravity = 0;

	//sets speed playerCharacter falls to bottom of canvas
	this.gravitySpeed = 4.5;
}

	//function to decide to decide what to display on screen, text, image or fill color
	this.update = function(callback) {
		if (this.type === "image") {
			this.ctx.globalAlpha = this.alpha;
			this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
	this.crashWith = function(otherobj) {
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

	this.jumpsOn = function(otherobj) {
		var bottomY = this.y + (this.height);
		var middleX = this.x+ (this.width/2);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var smoosh = false;
		if ((bottomY > othertop - 15) &&
			   (bottomY < otherbottom -(otherobj.height- 10)) &&
			   (middleX > otherleft) &&
			   (middleX < otherright)) {
		   smoosh = true;
		}
		return smoosh;
	};

	//gravity property
	this.newPos = function() {
		this.gravitySpeed += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY + this.gravitySpeed;
		this.hitBottom();
		//console.log(`${this.x},${this.y}`);
	};

	//set floor on canvas
	this.hitBottom = function() {
		var rockbottom = gameArea.canvas.height - this.height -150;
		if (this.y > rockbottom)
			this.y = rockbottom;
	}

	this.setAlive= function(alive){
		this.alive = alive;
	}
	this.isAlive = function(){
		return this.alive;
	}
}

/**
 *
 */
function gameOver() {
    interval && clearInterval(interval);
    state = 'game-over';
    var modal = document.getElementById('gameOverModal');
    modal.style.display = "block";

    audio = document.getElementById("bgm");
    audio.pause();

    gameover = document.getElementById("gameover")
    gameover.autoplay=true;
	gameover.load();
}

/**
 *
 */
function gameComplete(){
    state = 'complete';
	var modal = document.getElementById('gameCompleteModal');
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    };
}
/*
 *Adjust character to a valid position if it moves out of border
 * */
function correctCharacterPos() {
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
    if (playerCharacter.y > gameArea.canvas.height-playerCharacter.height) {
        playerCharacter.speedY = 0;
        playerCharacter.y = gameArea.canvas.height-playerCharacter.height;
    }
}

function startGameElements()
{
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

/**
 * Update game area for period defined in game area function, current 20th of a millisecond (50 times a second)
 */
function updateGameArea() {
	//loop for enemy collision
	for (var i=0; i<enemyCharacters.length; i++){
		if(enemyCharacters[i].isAlive()){
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

	//clear canvas before each update
	gameArea.clear();

	//update background
    background.update();

	//score update
	scoreBoard.text = "SCORE: " + gameArea.score;
    scoreBoard.update();

	//increment frame number for score counter
	incrementFrameNumber(2);
	incrementScore(2);

	//LevelDisplay update
	levelDisplay.text = "Level " + currentLevel;
	levelDisplay.update();

	//enemy update
	for (var i=0; i<100; i++) {
	    enemyCharacters[i].update();
	}

	//cloud update
	for (var i=0; i<100; i++) {
			clouds[i].x += 0.5;
			clouds[i].update();
	}

	//when frame number reaches 3000 (point at which obstacles end) end game
	//check current level, if more than 2 (because there is two levels currently), show game complete modal
    if (gameArea.score >= 3000) {
		gameArea.stop();
		currentLevel++;

        console.log(currentLevel);

		if(currentLevel === 2) {
			startLevel2();
		}
		else if(currentLevel === 3) {
		  startLevel3();
		}
		else if(currentLevel === 4)
        {
            startLevel4();
        }
		else if(currentLevel > 4) {
			gameComplete();
		}
	}

	//player character update
	playerCharacter.newPos();
	correctCharacterPos();
    playerCharacter.update();

	//if statement to reverse the flag so that the y cordinate of birds would be changed
	//z keeps the track and change flag after every 35 iteration
	if(z==35) {
           flag = !flag;
           z=0;
         }
	//z increased in every iteration
        z++;
	//loop to set speed of enemy characters
    for (var i = 0; i < enemyCharacters.length; i++){
		if(enemyCharacters[i].isAlive()){
			//check if level is 3 or greater
            //vary the speed of enemy characters if level is 3 or greater
		    if(currentLevel >= 3 && enemyCharacters[i].h )
                enemyCharacters[i].x += -4;
			else
		    enemyCharacters[i].x += -2;

			//if statement to check if y cordinate has to increase or decrease
			//should birds go up or down
			if(!enemyCharacters[i].h) {
				if (flag == 1) {
					enemyCharacters[i].y += -3;
				}
				else {
					enemyCharacters[i].y += +3;
				}
			}
		}
        else{ // if dead; enemy will be 'squeezed', fall to the ground and fade away. Feel free to improve by adding further animation.
            enemyCharacters[i].height = enemyCharacters[i].initHeight / 3;
            enemyCharacters[i].y += 10;
			enemyCharacters[i].alpha += -0.01;
			if(enemyCharacters[i].alpha < 0){
				enemyCharacters[i].alpha = 0;
			}
            enemyCharacters[i].hitBottom();
		}
	}
}


function incrementFrameNumber(value){
	gameArea.frameNo += value;
}

function incrementScore(value){
	gameArea.score += value;
}


/**
 * Stops player character from constantly moving after button move pressed
 */
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
	if (playerCharacter.y >= 170) {
		playerCharacter.speedY = -7;

	}
}

/**
 *
 */
function moveDown() {
    playerCharacter.speedY = 7;
}

/**
 *
 */
function moveLeft() {
    playerCharacter.speedX = -5;
}
function moveRight() {
    playerCharacter.speedX = 5;
}

var interval;

function moveLeftMouse(){
    interval = setInterval(moveLeft,1);
}

function moveRightMouse(){
    interval = setInterval(moveRight,1);
}
function moveUpMouse(){
	jump_audio=document.getElementById("jump")
	jump.autoplay=true;
	jump.load();
    	interval = setInterval(moveUp,1);
}
function onMouseUp(){
    clearInterval(interval);
     stopMove();
}
