//Some simple candy codes to make my life easier
var candy_codes = {1: '/candies/Blue.png',
                2: '/candies/Green.png',
                3:'/candies/Orange.png',
                4:'/candies/Purple.png',
                5:'/candies/Red.png',
                6:'/candies/Yellow.png',
                7: '/candies/BlueWrapped.png',
                8:'/candies/GreenWrapped.png',
                9:'/candies/OrangeWrapped.png',
                10:'/candies/PurpleWrapped.png',
                11:'/candies/RedWrapped.png',
                12:'/candies/YellowWrapped.png'};




function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

// This function will render an image onto the screen 
function show_image(src, width, height, i, j) {
    var img = document.createElement("img");
    var tdiv = document.createElement("div")

    tdiv.id = j;
    tdiv.width = width;
    tdiv.height = height;
    tdiv.ondrop="drop(event)";
    tdiv.ondragover = "allowDrop(event)";
    

    img.src = src;
    img.width = width;    
    img.height = height;
    img.draggable = true;
    img.ondragstart = "drag(event)";

    // This next line will just add it to the <body> tag
    // but you can adapt to make it append to the element you want.
    tdiv.appendChild(img);
    document.body.getElementsByClassName(i)[0].appendChild(tdiv);
    
}

function printGrid(){

    for (var i =0 ; i < grid.length; i++){
        var ranText = "";
        for (var j = 0; j < grid[i].length; j++){
            ranText += grid[i][j];
            ranText += " ";
          
            
        }
        console.log(ranText);
        ranText = "";
    }
}

// creation of the grid
var grid = new Array(12);
for (var i = 0; i < 12; i++){
    grid[i] = new Array(9);
}


// Rendering of the candy codes
for (let i = 0; i < 12; i++){
    var outerDiv = document.createElement('div');
    outerDiv.className = i;
    document.body.getElementsByClassName("container")[0].appendChild(outerDiv);
    for (let j = 0; j < 9; j++){
        image_num = (Math.floor(Math.random()*5)+1);
        show_image(candy_codes[image_num], 90, 90, i, j);
        grid[i][j] = image_num;
        console.log("hi");
    }

}
printGrid()


// var tempBox = document.createElement("div");
// tempBox.ondragover = "allowDrop(event)";
// tempBox.ondrop="drop(event)";
// document.body.appendChild(tempBox);



