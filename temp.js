const candy_codes = {
    1: '/candies/Blue.png',
    2: '/candies/Green.png',
    3: '/candies/Orange.png',
    4: '/candies/Purple.png',
    5: '/candies/Red.png',
    6: '/candies/Yellow.png',
    7: '/candies/BlueWrapped.png',
    8: '/candies/GreenWrapped.png',
    9: '/candies/OrangeWrapped.png',
    10: '/candies/PurpleWrapped.png',
    11: '/candies/RedWrapped.png',
    12: '/candies/YellowWrapped.png'
};

const numOfRows = 9;
const numOfCols = 9;

let grid;
let gridContainerElem;
let visited
//13:56
//document.addEventListener("DOMContentLoaded", init);
// if (document.readyState != 'loading') {
//     console.log("Readyu to start!");
//     init();
// }


// function init() {
//     gridContainerElem = document.getElementById("grid-container");

//     // https://css-tricks.com/updating-a-css-variable-with-javascript
//     let root = document.documentElement;
//     root.style.setProperty('--rows', numOfRows);
//     root.style.setProperty('--cols', numOfCols);

//     createGridArray();
//     createImageGrid();
//     printGridArray();
//     var keepgoing = true;
//     while (keepgoing){
//         keepgoing = eraseValidMoves();
//     }
//     console.log("Fully good array: ")
//     printGridArray();
//     //  initEvents();
// }

// // function initEvents() {
// //     const cloneContainerEl = document.querySelector("#clone-container");
// //     cloneContainerEl.addEventListener("drop", dropClone);
// //     cloneContainerEl.addEventListener("dragover", allowDrop);
// // }

// // ------------------------------------------------------
// //  Grid setup

function createGridArray() {
    grid = new Array(numOfRows);
    for (let i = 0; i < numOfRows; i++) {
        grid[i] = new Array(numOfCols);
    }
}

function createImageGrid() {
    const maxNumOfCandyCodes = Object.keys(candy_codes).length - 6;

    for (let i = 0; i < numOfRows; i++) {
        // Generate image elements within row container
        for (let j = 0; j < numOfCols; j++) {
            image_num = (Math.floor(Math.random() * maxNumOfCandyCodes) + 1);
            
            grid[i][j] = image_num;
        }
    }
}

function createVisted(){
    visited = new Array(numOfRows);
    for (let i = 0; i < numOfRows; i++) {
        visited[i] = new Array(numOfCols);
    }
}

function clearVisited(){
    for (var i =0 ; i < numOfRows; i++){
        for (var j = 0 ; j < numOfCols; j++){
            visited[i][j] = false;
        }
    }
}


function printGridArray() {
    for (let i = 0; i < grid.length; i++) {
        let ranText = "";
        for (let j = 0; j < grid[i].length; j++) {
            ranText += grid[i][j];
            ranText += " ";
        }
        console.log(ranText);
    }
    console.log("Done printing!");
}

function dfs(i, j, grid) {

    let original_Value = grid[i][j];
    let stack = [[i, j]];
    let size = 0;
    while (stack.length != 0) {
        let [x, y] = stack.pop();
        visited[x][y] = true;
        size += 1;
        if (x + 1 < grid.length && grid[x + 1][y] == original_Value && !visited[x + 1][y]) {
            stack.push([x + 1, y]);
        }
        if (x - 1 >= 0 && grid[x - 1][y] == original_Value && !visited[x - 1][y]) {
            stack.push([x - 1, y]);
        }
        if (y + 1 < grid[x].length && grid[x][y + 1] == original_Value && !visited[x][y + 1]) {
            stack.push([x, y + 1]);
        }
        if (y - 1 >= 0 && grid[x][y - 1] == original_Value && !visited[x][y - 1]) {
            stack.push([x, y - 1]);
        }
        
    }
    return size;

}


function changingDFS(i, j, grid){
    let original_Value = grid[i][j];
    let stack = [[i, j]];
    clearVisited();
    while (stack.length != 0){
        let [x,y] = stack.pop();
        grid[x][y] = 0;
        visited[x][y] = true;
        if (x + 1 < grid.length && grid[x + 1][y] == original_Value && !visited[x + 1][y]) {
            stack.push([x + 1, y]);
        }
        if (x - 1 >= 0 && grid[x - 1][y] == original_Value && !visited[x - 1][y]) {
            stack.push([x - 1, y]);
        }
        if (y + 1 < grid[x].length && grid[x][y + 1] == original_Value && !visited[x][y + 1]) {
            stack.push([x, y + 1]);
        }
        if (y - 1 >= 0 && grid[x][y - 1] == original_Value && !visited[x][y - 1]) {
            stack.push([x, y - 1]);
        }
    }
    return clearVisited();
}

function eraseValidMoves() {
    var changesDone = false;
    clearVisited();

    for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
            if (!visited[i][j]) {
                var size = dfs(i, j, grid, visited);
                if (size >= 3) {
                    changingDFS(i,j , grid);
                    gravity();
                    changesDone = true;
                }
            }
        }
    }
    clearVisited()
    return changesDone;
}
function gravity(){
    const maxNumOfCandyCodes = Object.keys(candy_codes).length - 6;
    for (let j =0 ; j < grid[0].length; j++){
        var temp = [];
        for (let i = 0; i < grid.length; i++){
            if (grid[i][j] == 0){
                temp.unshift((Math.floor(Math.random() * maxNumOfCandyCodes) + 1));
            }
            else {
                temp.push(grid[i][j]);
            }
        }    
        for (let i = 0; i < temp.length; i++){
            grid[i][j] = temp.shift();
        }    
    }
    
}



createGridArray();
createImageGrid();
printGridArray();
createVisted();
clearVisited();

var erase = true;
while (erase){
    erase = eraseValidMoves();
    printGridArray();
}
printGridArray();



