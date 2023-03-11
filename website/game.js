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
const numOfCols = 12;

let grid;
let gridContainerElem;

//13:56
//document.addEventListener("DOMContentLoaded", init);
if (document.readyState != 'loading') {
    console.log("Readyu to start!");
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
    printGridArray();
    eraseValidMoves();
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
    let filename = src.replace(/^.*[\\\/]/, ''); // Remove path
    filename = filename.split(".")[0]; // Remove extension
    const splitWordsArr = filename.split(/(?=[A-Z])/);
    const combinedWords = splitWordsArr.join(" ").toLowerCase();
    img.setAttribute("alt", `${combinedWords} ${id}`);

    // For debugging purposes
    tdiv.setAttribute("data-color", splitWordsArr[0].toLowerCase());

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
var dr = [1, -1, 0, 0];
var dc = [0, 0, 1, -1];
function dfs(i, j, grid, visited) {

    let original_Value = grid[i][j];
    let stack = [[i, j]];
    let size = 0;
    while (stack.length != 0) {
        let [i, j] = stack.pop();
        visited[i][j] = true;
        size += 1;
        if (i + 1 < grid.length && grid[i + 1][j] == original_Value && !visited[i + 1][j]) {
            stack.push([i + 1, j]);
        }
        if (i - 1 > 0 && grid[i - 1][j] == original_Value && !visited[i - 1][j]) {
            stack.push([i - 1, 0]);
        }
        if (j + 1 < grid[i].length && grid[i][j + 1] == original_Value && !visited[i][j + 1]) {
            stack.push([i, j + 1]);
        }
        if (j - 1 > 0 && grid[i][j - 1] == original_Value && !visited[i][j - 1]) {
            stack.push([i, j - 1]);
        }
    }
    return size;

}

function eraseValidMoves() {
    visited = new Array(numOfRows);
    for (let i = 0; i < numOfRows; i++) {
        visited[i] = new Array(numOfCols);
        for (let j = 0; j < numOfCols; j++) {
            visited[i][j] = false;
        }
    }

    for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfCols; j++) {
            if (!visited[i][j]) {
                var size = dfs(i, j, grid, visited);
                if (size >= 3) {
                    console.log("There is a component bigger than 3 at: " + i + " " + j);
                    grid[i][j] = 9;
                    var img = document.getElementById(i*12+j);
                    img.src = candy_codes[grid[i][j]];
                    console.log(img.src);
                }
            }
        }
    }


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
    if ((Math.abs(sourceId - targetId) == 1) || (Math.abs(sourceId - targetId) == 12)) {
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





