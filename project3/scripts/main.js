// I. VARIABLES
const cellWidth = 32; 
const cellSpacing = 0;
const container = document.querySelector("#gridContainer");
const cells = []; // the HTML elements - our "view"
let d = new Date();
d.setMinutes(d.getMinutes() + 3);

let randX;
let randY;
let started = false;
let min;
let sec;

// faking an enumeration here
const keyboard = Object.freeze({
	SHIFT: 		16,
	SPACE: 		32,
	LEFT: 		37, 
	UP: 		38, 
	RIGHT: 		39, 
	DOWN: 		40
});

// this is an enumeration for gameworld levels
const worldTile = Object.freeze({
	FLOOR: 		0,
	WALL: 		1,
	GRASS: 		2,
	WATER: 		3,
	GROUND: 	4
});

// the "grunt" sound that plays when the player attempts to move into a wall or water square
let effectAudio = undefined;
let growlAudio = undefined;

// level data is over in gamedata.js
let worldX = 0;
let worldY = 0;
let currentGameWorld = undefined;   // a 2D array - the grid:  walls, floors, water, etc...
let currentGameObjects = undefined; // a 1D array - stuff that's on top of the grid and can move: monsters, treasure, keys, etc...

// the player - uses ES6 object literal syntax
const player = Object.seal({
	x:-1,
	y:-1,
	element: undefined,
	moveRight(){this.x++;},
	moveDown(){this.y++;},
	moveLeft(){this.x--;},
	moveUp(){this.y--;},
});


// II. INIT code
window.onload = ()=>{		
	//setting the text to null in our starty menu
	document.querySelector("h1").innerHTML = "";
	document.querySelector("p").innerHTML = "";
	document.querySelector("h3").innerHTML = "You are trapped in a prison. Find the key before time runs out. But beware, there are guards all around.";

	document.querySelector(".start").onclick = startGame;
}

function startGame(){
	//making the text for the game
	document.querySelector("h1").innerHTML = "Find the Key!";
	document.querySelector("p").innerHTML = "Time Remaining: ";
	document.querySelector("h3").innerHTML = "";
	started = true;
	worldX = 0;
	worldY = 0;


	currentGameWorld = gameworld["world" + worldX + worldY];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	player.x = 1;
	player.y = 1;
    createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(worldX, worldY);
	drawGameObjects(currentGameObjects);
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
    growlAudio = document.querySelector("#growlAudio");
    growlAudio.volume = 0.3;

	setupEvents();
}

function nextLevel(){
	document.querySelector("#gridContainer").innerHTML = "";

	currentGameWorld = gameworld["world" + worldX + worldY];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
    createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(worldX, worldY);
	drawGameObjects(currentGameObjects);
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
    growlAudio = document.querySelector("#growlAudio");
    growlAudio.volume = 0.3;

	setupEvents();
}


// III. FUNCTIONS
// the elements on the screen that won't change - our "view"
function createGridElements(numRows,numCols){
	const span = document.createElement('span');
	span.className = 'cell';
	for (let row=0;row<numRows;row++){
	cells.push([]);
		for (let col=0;col<numCols;col++){
			let cell = span.cloneNode();
			cell.style.left = `${col * (cellWidth+cellSpacing)}px`;
			cell.style.top = `${row * (cellWidth+cellSpacing)}px`;
			container.appendChild(cell);
			cells[row][col] = cell;
		}
	}
}

// the elements on the screen that can move and change - also part of the "view"
function loadLevel(levelX, levelY){
	currentGameObjects = []; // clear out the old array
	const node =  document.createElement("span");
	node.className = "gameObject";

	// now initialize our player
	
	player.element = node.cloneNode(true);
	player.element.classList.add("player");
	container.appendChild(player.element);
	
	
	/* let's instantiate our game objects */
	// pull the current level data
	const levelObjects = allGameObjects["level" + levelX + levelY];
	
	// loop through this level's objects ... 
	for (let obj of levelObjects){
		const clone = Object.assign({}, obj); 		// clone the object
		clone.element = node.cloneNode(true); 		// clone the element
		clone.element.classList.add(obj.className); // add the className so we see the right image
		currentGameObjects.push(clone);				// add to currentGameObjects array  (so it gets moved onto the map)
		container.appendChild(clone.element);		// add to DOM tree (so we can see it!)
	}
}

function drawGrid(array){
	const numCols = array[0].length;
	const numRows = array.length;
	for (let row=0;row<numRows;row++){
		for (let col=0;col<numCols;col++){
			const tile = array[row][col];
			const element = cells[row][col];
			
			// ** can you figure our how to get rid of this switch? Maybe another enumeration, of the tile CSS classes? **
			switch(tile) {
    			case worldTile.FLOOR:
        		element.classList.add("floor")
        		break;
        		
        		case worldTile.WALL:
        		element.classList.add("wall");
        		break;
        		
        		case worldTile.GRASS:
        		element.classList.add("grass");
        		break;
        		
        		case worldTile.WATER:
        		element.classList.add("water");
        		break;
        		
        		case worldTile.GROUND:
        		element.classList.add("ground");
        		break;
			}
		}
	}
}


function drawGameObjects(array){
	// player
	player.element.style.left = `${player.x * (cellWidth + cellSpacing)}px`;
	player.element.style.top = `${player.y * (cellWidth + cellSpacing)}px`;
	
	// game object
	for (let gameObject of array){
		gameObject.element.style.left = `${gameObject.x * (cellWidth + cellSpacing)}px`;
		gameObject.element.style.top = `${gameObject.y * (cellWidth + cellSpacing)}px`;
	}
	
}


function movePlayer(e){
	let nextX;
	let nextY;	

	switch(e.keyCode){			
		case keyboard.RIGHT:
			nextX = player.x + 1;
			nextY = player.y;
			if(checkIsLegalMove(nextX,nextY)) player.moveRight();			
		break;
				
		case keyboard.DOWN:
			nextX = player.x;
			nextY = player.y + 1;
			if(checkIsLegalMove(nextX,nextY)) player.moveDown();
		break;
				
		case keyboard.LEFT:
			nextX = player.x - 1;
			nextY = player.y;
			if(checkIsLegalMove(nextX,nextY)) player.moveLeft();
		break;
				
		case keyboard.UP:
			nextX = player.x;
			nextY = player.y - 1;
			if(checkIsLegalMove(nextX,nextY)) player.moveUp();
		break;
	}
	
	function checkIsLegalMove(nextX,nextY){
		let nextTile = currentGameWorld[nextY][nextX];
		if (nextTile != worldTile.WALL && nextTile != worldTile.WATER){
			if(nextY == 19){
				worldY += 1;
				player.y = 0;
				nextLevel();						
			}else if(nextX == 0){
				worldX -= 1;
				player.x = 29;
				nextLevel();
			}else if(nextY == 0){
				worldY -= 1;
				player.y = 19;
				nextLevel();	
			}		
			else if(nextX == 29){
				worldX += 1;
				player.x = 0;
				nextLevel();
			}
			//if we are not moving levels we just move normally
			moveEnemy();			
			return true;
		}else{
			effectAudio.play();
			moveEnemy();
			return false;
		}
	}	
	
	if(checkSpaceKey()){
		win();
	}
	if(checkSpaceEnemy()){
		death();
	}
}

function moveEnemy(){	
	for(let i = 0; i < currentGameObjects.length; i++){		
		//make sure that we are not moving the key
		if(currentGameObjects[i].type == "monster"){
			//get 2 random numbers for our scale
			randX = Math.random();
			randY = Math.random();

			//use the X to make a move on the X axis
			if(randX < .5){
				if(checkIsLegalMove(currentGameObjects[i].x - 1, currentGameObjects[i].y)){
					currentGameObjects[i].x -= 1;
				}else{
					currentGameObjects[i].x += 1;
				}		
			}
			else{
				if(checkIsLegalMove(currentGameObjects[i].x + 1, currentGameObjects[i].y)){
					currentGameObjects[i].x += 1;
				}else{
					currentGameObjects[i].x -= 1;
				}
			}

			//use the Y to make a move on the Y axis
			if(randY < .5){
				if(checkIsLegalMove(currentGameObjects[i].x, currentGameObjects[i].y - 1)){
					currentGameObjects[i].y -= 1;
				}else{
					currentGameObjects[i].y += 1;
				}
			}
			else{
				if(checkIsLegalMove(currentGameObjects[i].x, currentGameObjects[i].y + 1)){
					currentGameObjects[i].y += 1;
				}else{
					currentGameObjects[i].y -= 1;
				}
			}
		}
	}

	function checkIsLegalMove(nextX,nextY){
		let nextTile = currentGameWorld[nextY][nextX];
		if (nextTile != worldTile.WALL && nextTile != worldTile.WATER && nextTile != worldTile.GROUND){			
			//if we are not moving levels we just move normally
			return true;
		}else{
			return false;
		}
	}
}

function checkSpaceEnemy(){
	for(let i = 0; i < currentGameObjects.length; i++){
		if(currentGameObjects[i].type == "monster"){
			if(player.x == currentGameObjects[i].x && player.y == currentGameObjects[i].y){
				return true;
			}
		}		
	}	

	return false;
}

function checkSpaceKey(){
	let key = currentGameObjects.length - 1;
	if(currentGameObjects[key].type == "key"){
		if(player.x == currentGameObjects[key].x && player.y == currentGameObjects[key].y){
			return true;
		}
		else{
			return false;
		}
	}	
}

function death(){
	started = false;
	document.querySelector("#gridContainer").innerHTML = "";
	document.querySelector("p").innerHTML = "";
	document.querySelector("h1").innerHTML = "Game Over!";
}

function win(){
	started = false;
	document.querySelector("#gridContainer").innerHTML = "";
	document.querySelector("p").innerHTML = "You had " + min + " minutes & " + sec + " seconds left!";
	document.querySelector("h1").innerHTML = "You Win!";
}

// IV. EVENTS
function setupEvents(){
	window.onmouseup = (e) => {
		e.preventDefault();
		gridClicked(e);
	};
	
	window.onkeydown = (e)=>{
		//console.log("keydown=" + e.keyCode);

		// checking for other keys - ex. 'p' and 'P' for pausing
		var char = String.fromCharCode(e.keyCode);
		if (char == "p" || char == "P"){
		
		}
		movePlayer(e);
		drawGameObjects(currentGameObjects);
	};
}

function gridClicked(e){
	let rect = container.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;
	let columnWidth = cellWidth+cellSpacing;
	let col = Math.floor(mouseX/columnWidth);
	let row = Math.floor(mouseY/columnWidth);
	let selectedCell = cells[row][col];
	// selectedCell.classList.add('cellSelected');
	console.log(`${col},${row}`);
}

// Update the count down every 1 second
var x = setInterval(function() {
	if(started){
		// Get today's date and time
		var now = new Date().getTime(); 
		
		// Find the distance between now and the count down date
		var distance = d - now;
		
		// Time calculations for days, hours, minutes and seconds
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		// Output the result in an element with id="demo"
		document.querySelector("p").innerHTML = "Time Remaining: " + minutes + "m " + seconds + "s ";

		min = minutes;
		sec = seconds;

        if(seconds == 5 || seconds == 15 || seconds == 25 || seconds == 35 || seconds == 45 || seconds == 55){
            growlAudio.play();
        }
		
		// If the count down is over, write some text 
		if (distance < 0) {
			clearInterval(x);
			document.querySelector("p").innerHTML = "";
			death();
		}
	}
	else{
		now = new Date().getTime();
		d = new Date();
		d.setMinutes(d.getMinutes() + 3);
	}	
}, 1000);