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
let visited;
//13:56
//document.addEventListener("DOMContentLoaded", init);
if (document.readyState != 'loading') {
    console.log("Ready to start!");
    init();
}


function init() {
    gridContainerElem = document.getElementById("grid-container");

    // https://css-tricks.com/updating-a-css-variable-with-javascript
    let root = document.documentElement;
    root.style.setProperty('--rows', numOfRows);
    root.style.setProperty('--cols', numOfCols);

    createGridArray();
    createImageGrid();
    createVisted();
    clearVisited();
    printGridArray();
    var keepgoing = true;
    while (keepgoing){
        keepgoing = eraseValidMoves();
        console.log("Not done yet!")
    }
    console.log("Fully good array: ")
    printGridArray();
    updateImages()
    //  initEvents();
}

// function initEvents() {
//     const cloneContainerEl = document.querySelector("#clone-container");
//     cloneContainerEl.addEventListener("drop", dropClone);
//     cloneContainerEl.addEventListener("dragover", allowDrop);
// }

// ------------------------------------------------------
//  Grid setup

function createGridArray() {
    grid = new Array(numOfRows);
    for (let i = 0; i < numOfRows; i++) {
        grid[i] = new Array(numOfCols);
    }
}

function createImageGrid() {
    const maxNumOfCandyCodes = Object.keys(candy_codes).length - 6;

    let uniqueIdIndex = 0;

    for (let i = 0; i < numOfRows; i++) {
        // Generate image elements within row container
        for (let j = 0; j < numOfCols; j++) {
            image_num = (Math.floor(Math.random() * maxNumOfCandyCodes) + 1);
            const src = candy_codes[image_num];
            // "img" + 
            const uniqueId = uniqueIdIndex++;
            const tdiv = addImage(src, uniqueId);
            gridContainerElem.appendChild(tdiv);
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



function updateImages(){
    for (let i = 0; i < grid.length; i++){
        for (let j = 0; j < grid[i].length; j++){
            var img = document.getElementById((i*12)+j);
            img.src=  candy_codes[grid[i][j]];
        }
    }
}


function addImage(src, id) {
    // Create a container for the image element
    const tdiv = document.createElement("div");
    tdiv.className = "image-container";
    tdiv.addEventListener("dragover", allowDrop);
    tdiv.addEventListener("drop", dropSwapOrMove);

    const img = document.createElement("img");
    img.className = "color-image";
    img.src = src;
    img.id = id;
    img.setAttribute("data-id", id);
    img.draggable = true;
    img.addEventListener("dragstart", dragstart);

    // Set the 'alt' attribute using the 'src' file name
    // and the 'id' parameter.
    //let filename = src.replace(/^.*[\\\/]/, ''); // Remove path
    //filename = filename.split(".")[0]; // Remove extension
    //const splitWordsArr = filename.split(/(?=[A-Z])/);
    //const combinedWords = splitWordsArr.join(" ").toLowerCase();
    //img.setAttribute("alt", `${combinedWords} ${id}`);

    // For debugging purposes
    //tdiv.setAttribute("data-color", splitWordsArr[0].toLowerCase());

    // Append image element to a div container
    tdiv.appendChild(img);

    return tdiv;
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

function tempSwap(i1, j1, i2, j2){
    var temp_grid_val1 = grid[i1][j1];
    var temp_grid_val2 = grid[i2][j2];
    grid[i1][j1] = temp_grid_val2;
    grid[i2][j2] = temp_grid_val1;
}
// ------------------------------------------------------
//  Drag and drop

function allowDrop(ev) {
    ev.preventDefault();
}

function dragstart(ev) {
    ev.dataTransfer.setData("sourceId", ev.target.getAttribute("data-id"));
}

function dropSwapOrMove(ev) {
    ev.preventDefault();


    // Get source image ID set in the 'dragstart()' event handler
    const sourceId = ev.dataTransfer.getData("sourceId");
    const sourceImageElem = document.querySelector(`[data-id= "${sourceId}"]`);
    const sourceContainerElem = sourceImageElem.closest(".image-container");
    const sourceColor = sourceContainerElem.getAttribute("data-color");

    const targetContainerElem = ev.currentTarget;
    const targetImageElem = targetContainerElem.querySelector("img");
    const targetId = targetImageElem.getAttribute("data-id");
    const targetColor = targetContainerElem.getAttribute("data-color");


    // Swap images

    // Append the target image element first to the source
    // since 'sourceImageElem.closest(".image-container")'
    // returns the image container of the source image
    // BEFORE it's moved to the target image container.
    if (sourceId - targetId == 1) {
        console.log("Good swap!");


        sourceContainerElem.appendChild(targetImageElem);
        sourceContainerElem.setAttribute("data-color", targetColor);

        // 'ev.currentTarget' represents the image container
        // (i.e. div.image-container)
        targetContainerElem.appendChild(sourceImageElem);
        targetContainerElem.setAttribute("data-color", sourceColor);
        console.log(`SWAP ${sourceId} (source) with ${targetId} (target)`);
    }
    else if (sourceId - targetId == -1) {
        console.log("Good swap!");
 
        sourceContainerElem.appendChild(targetImageElem);
        sourceContainerElem.setAttribute("data-color", targetColor);

        // 'ev.currentTarget' represents the image container
        // (i.e. div.image-container)
        targetContainerElem.appendChild(sourceImageElem);
        targetContainerElem.setAttribute("data-color", sourceColor);

        console.log(`SWAP ${sourceId} (source) with ${targetId} (target)`);
    }
    else if (sourceId- targetId == 12){
        console.log("Good swap!");

        sourceContainerElem.appendChild(targetImageElem);
        sourceContainerElem.setAttribute("data-color", targetColor);

        // 'ev.currentTarget' represents the image container
        // (i.e. div.image-container)
        targetContainerElem.appendChild(sourceImageElem);
        targetContainerElem.setAttribute("data-color", sourceColor);
        console.log(tempi1 + " " + tempj1 + "Value: " + grid[tempi1][tempj1]);
        console.log(`SWAP ${sourceId} (source) with ${targetId} (target)`);
    }
    else if (sourceId- targetId == -12){
        console.log("Good swap!");
        
        sourceContainerElem.appendChild(targetImageElem);
        sourceContainerElem.setAttribute("data-color", targetColor);

        // 'ev.currentTarget' represents the image container
        // (i.e. div.image-container)
        targetContainerElem.appendChild(sourceImageElem);
        targetContainerElem.setAttribute("data-color", sourceColor);

        console.log(`SWAP ${sourceId} (source) with ${targetId} (target)`);
    }
}

function dropClone(ev) {
    ev.preventDefault();
    const sourceId = ev.dataTransfer.getData("sourceId");
    const clone = document.querySelector(`[data-id= "${sourceId}"]`).cloneNode(true);
    ev.target.innerHTML = "";
    ev.target.appendChild(clone);
    console.log("Dropped clone " + sourceId);
}





