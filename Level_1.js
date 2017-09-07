//Description: Level 1 of Game, this script contains all the javascript required for the game to work on the 
//JS_game html page.

var myGamePiece;
var myBackground;
var myScore;
var myObstacles = [];
var keysPressed = {37 : false, 38 : false, 39 : false};

function KeyDown(event)
{
    console.log(event)
    var key;
    key = event.which;
    console.log(key)
    keysPressed[key] = true;
    if (keysPressed[37] && keysPressed[38]){
        moveLeft();
    }
    else if (keysPressed[37]){
        moveLeft();
    }
    else if (keysPressed[38]) {
        moveUp();
    }
    if (keysPressed[39] && keysPressed[38]) {
        moveRight();
    }
    else if (keysPressed[39]){
        moveRight();
    }	
}
function KeyUp(event)
{
    var key;
    key = event.which;
    console.log(key)
    keysPressed[key] = false;
    switch (key)
	{
		case 37 : stopMove(); break;
		case 38 : stopMove(); break;
		case 39 : stopMove(); break;
	}
}

function startGame() {

	//character
    myGamePiece = new component(60, 70, "Pictures/good_guy.png", 100, 120, "image");
	//background
    myBackground = new component(900, 400, "Pictures/background.jpg", 0, 0, "image");
	//score
	myScore = new component("30px", "Consolas", "black", 100, 40, "text");

	//loop for creating new obstacles setting a random x coordinate for each
	for (var i=0; i<100; i++){
	var x = Math.floor((Math.random() * 20000) + 900);	
    //var y = Math.floor(Math.random() * 200) + 0
	myObstacles[i] = new component(40, 50, "Pictures/zombie.png", x,200, "image")
	}

	//call start function
    myGameArea.start();
}

var myGameArea = {

		//create html canvas 
		canvas : document.createElement("canvas"),
		start : function() {
		
		//canvas size
        this.canvas.width = 900;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
		//update interval
        this.interval = setInterval(updateGameArea, 20);
		
        },
		
	//function used for refreshing page	
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	
	//function to be used at a later date for object collision
    stop : function() {
        clearInterval(this.interval);
    }
}

//constructor used to create objects
function component(width, height, color, x, y, type) {
    //test if component is image
	this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
        this.image.width = width;
        this.image.height = height;
    }
    this.width = width;
    this.height = height;
	
	//change components position
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
	this.gravity = 0;
	
	//sets speed game piece falls to bottom of canvas
	this.gravitySpeed = 4.5;
	
	
	//function to decide to decide what to display on screen, text, image or fill color
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } 		
		else if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } 
		else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
	
	//obstacle collision function
	this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
	
	
	//gravity property
    this.newPos = function() {
		this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
		this.hitBottom();
    }    
	
	//set floor on canvas
	this.hitBottom = function() {
		var rockbottom = myGameArea.canvas.height - this.height -150;
			if (this.y > rockbottom)
				this.y = rockbottom;
			}
}
function GameOver() {
    var modal = document.getElementById('gameOverModal');
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }    
}
//update game area for period defined in game area function, currentl 20th of a millisecond (50 times a second)
function updateGameArea() {

//loop for obstacle collision
for (var i=0; i<100; i++){
	  if (myGamePiece.crashWith(myObstacles[i])) {
        myGameArea.stop();
        GameOver();
	    }
} 
	
	//clear canvas before each update
	myGameArea.clear();
	
	//increment frame number for score counter
	myGameArea.frameNo += 1;
	
	//update background
    myBackground.update();
	
	//obstacle update
	for (var i=0; i<100; i++){
	myObstacles[i].update();
	}
	
	//score update
	myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
	//when frame number reaches 5000 (point at which obstacles end) end game
	if (myGameArea.frameNo == 5000){
	alert("CONGRATS YOU HAVE ESCAPED ALL THE BAD GUYS, PHEW! PRESS START TO TRY AGAIN");
	myGameArea.stop();
	}
	
	//game piece update
	myGamePiece.newPos();    
    myGamePiece.update();  
	
	
	//loop to set speed of obstacles
	for (var i=0; i<100; i++){
	myObstacles[i].x += -2;
		} 
}

//stops game piece from constantly moving after button move pressed
function stopMove(){
myGamePiece.speedX = 0;
myGamePiece.speedY = 0;
        if (myGamePiece.y < 0) {
            myGamePiece.speedY = 0;
            myGamePiece.y = 0;
        }
        if (myGamePiece.x < 0){
            myGamePiece.speedX = 0;
            myGamePiece.x = 0;
        }
        if (myGamePiece.x > myGameArea.canvas.width-myGamePiece.width) {
            myGamePiece.speedX = 0;
            myGamePiece.x = myGameArea.canvas.width-myGamePiece.width;
        }
}

function moveUp() {
    if (myGamePiece.y >= 0 && myGamePiece.x >= 0 && myGamePiece.x <= myGameArea.canvas.width-myGamePiece.width) {
        myGamePiece.speedY = -10; 
        console.log("up allowed")
    }
    else {
        if (myGamePiece.y < 0) {
            myGamePiece.speedY = 0;
            myGamePiece.y = 0;
        }
        if (myGamePiece.x < 0){
            myGamePiece.speedX = 0;
            myGamePiece.x = 0;
        }
        if (myGamePiece.x > myGameArea.canvas.width-myGamePiece.width) {
            myGamePiece.speedX = 0;
            myGamePiece.x = myGameArea.canvas.width-myGamePiece.width;
        }
    }
    
}

function moveDown() {
    myGamePiece.speedY = 10; 
}

function moveLeft() {
    if (myGamePiece.y >= 0 && myGamePiece.x >= 0 && myGamePiece.x <= myGameArea.canvas.width-myGamePiece.width) {
        myGamePiece.speedX = -5;
        console.log("left allowed")
    }
        else {
        if (myGamePiece.y < 0) {
            myGamePiece.speedY = 0;
            myGamePiece.y = 0;
        }
        if (myGamePiece.x < 0){
            myGamePiece.speedX = 0;
            myGamePiece.x = 0;
        }
        if (myGamePiece.x > myGameArea.canvas.width-myGamePiece.width) {
            myGamePiece.speedX = 0;
            myGamePiece.x = myGameArea.canvas.width-myGamePiece.width;
        }
    }
}

function moveRight() {
    if (myGamePiece.y >= 0 && myGamePiece.x >= 0 && myGamePiece.x <= myGameArea.canvas.width-myGamePiece.width) {
        myGamePiece.speedX = 5;
        console.log("right allowed")
    }  
        else {
        if (myGamePiece.y < 0) {
            myGamePiece.speedY = 0;
            myGamePiece.y = 0;
        }
        if (myGamePiece.x < 0){
            myGamePiece.speedX = 0;
            myGamePiece.x = 0;
        }
        if (myGamePiece.x > myGameArea.canvas.width-myGamePiece.width) {
            myGamePiece.speedX = 0;
            myGamePiece.x = myGameArea.canvas.width-myGamePiece.width;
        }
    }
}
var interval;
function moveLeftMouse(){
    interval = setInterval(moveLeft,1);
}

function moveRightMouse(){
    interval = setInterval(moveRight,1);
}
function moveUpMouse(){
    interval = setInterval(moveUp,1);
}
function onMouseUp(){
    clearInterval(interval);
     stopMove();
}
