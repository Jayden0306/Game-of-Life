
var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = '#e1e1e1';
ctx.fillStyle  = '#EB8A7F';
var width = this.ctx.canvas.width;
var height = this.ctx.canvas.height;
var cellsInRow = width/8;
var cellsInColumn = height/8;
var timeID;
var grid = [];
var result = [];


initGrid();
addRandomCell();

function start() {
	timeID = setInterval(function() {
		draw();
		update();
	}, 150);
}

function step() {
	draw();
	update();
}

function stop() {
	clearInterval(timeID);
}

function reset() {
	initGrid();
	addRandomCell();
	draw();
}

var socket = io.connect("http://76.28.150.193:8888");
//save data to the server
function save() {
	socket.emit("save", { studentname: "Jayden Tan", statename: "gameoflife", data: grid});
}

//fetch the data from server
function load() {
	socket.emit("load", {studentname: "Jayden Tan", statename: "gameoflife"});
}

//onclick listener for socket io's  load
socket.on("load", function(data) {
	// console.log(data.data);
	for (var i = 0; i < cellsInRow; i++) { 
        for (var j = 0; j < cellsInColumn; j++) {
            grid[i][j] = data.data[i][j];
        }
    }
    draw();
})


function initGrid() {
	//create 2D grid for the game of life
    for(var i = 0; i < cellsInRow; i++) {
        grid[i] = [];
        result[i] = [];
        for(var j = 0; j < cellsInColumn; j++) {
            grid[i][j] = 0;
            result[i][j] = 0;
        }
    }
}

// function addCell() {
// 	grid[2][1] = 1;
// 	grid[2][2] = 1;
// 	grid[2][3] = 1;
// }

 


// add random cells in the grid
function addRandomCell() {
	var numLiveCells = Math.floor(Math.random() * (cellsInRow * cellsInColumn));
    for(var i = 0; i < numLiveCells; i++) {
        //generate random index for row
        var randomRow = Math.floor(Math.random() * (cellsInRow-1));
        //generate random index for column
        var randomColumn = Math.floor(Math.random() * (cellsInColumn-1));
        grid[randomRow][randomColumn] = 1;
    }
}

//determine the current cell is alive or dead
function determineAlive(i, j) {
	var numOfNeighbor = countNeighbor(i, j);
	//live cell
	if(grid[i][j] === 1) {
		if(numOfNeighbor < 2 ) {
			//dead if less than 2
			result[i][j] = 0;
		} else if(numOfNeighbor === 2 || numOfNeighbor === 3) {
			//alive if 2 or 3 neighbors
			result[i][j] = 1;
		} else if(numOfNeighbor > 3) {
			//dead if more than 3
			result[i][j] = 0
		}
	}else {
		//dead cell
		//alive if it has 3 neighbors
		if(numOfNeighbor === 3) {
			result[i][j] = 1;
		}else {
			result[i][j] = 0;
		}
	}
}

//count how many neighbors in the current cell       
function countNeighbor(i, j) {
	var totalNeighbor = 0; 
	if( grid[i-1][j-1]) {
		//top left
		totalNeighbor++;
	}
	 if( grid[i-1][j]) {
		//top middle
		totalNeighbor++;
	}
	if( grid[i-1][j+1]) {
		//top right
		totalNeighbor++;
	}
	 if( grid[i][j-1]) {
		//middle left
		totalNeighbor++;
	}
	 if(grid[i][j+1]) {
		//middle right
		totalNeighbor++;
	}
	 if( grid[i+1][j-1]) {
		//bottom left
		totalNeighbor++;
	}
	if( grid[i+1][j]) {
		//bottom middle
		totalNeighbor++;
	}
	if( grid[i+1][j+1]) {
		//bottom right
		totalNeighbor++;
	}
	return totalNeighbor;
}


//draw the grid determine by live or dead
function draw() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for(var i = 0; i < cellsInRow; i++) {
		for(var j = 0; j < cellsInColumn; j++) {
			ctx.beginPath();
			ctx.rect(i*10, j*10, 10, 10);
			if(grid[i][j] === 1) {
				ctx.fill();
			}else{
				ctx.stroke();
			}
		}
	}

}

function update() {
	//determine which cells are alive in the next update
	for(var i = 1; i<cellsInRow -1; i++) {
		for(var j = 1; j<cellsInColumn - 1; j++) {
			determineAlive(i,j);
		}
	}

	//update the grid with the changes update
	for (var i = 0; i < cellsInRow; i++) { 
        for (var j = 0; j < cellsInColumn; j++) {
            grid[i][j] = result[i][j];

        }
    }
}


















