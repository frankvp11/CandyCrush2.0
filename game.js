document.addEventListener('DOMContentLoaded', () => {
    debugger;
    console.log("Hello!");
    const candy_codes = {
        
        1: 'CandyCrush2.0/candies/Blue.png',
        2: 'CandyCrush2.0/candies/Green.png',
        3: 'CandyCrush2.0/candies/Orange.png',
        4: 'CandyCrush2.0/candies/Purple.png',
        5: 'CandyCrush2.0/candies/Red.png',
        6: 'CandyCrush2.0/candies/Yellow.png',
        7: 'CandyCrush2.0/candies/BlueWrapped.png',
        8: 'CandyCrush2.0/candies/GreenWrapped.png',
        9: 'CandyCrush2.0/candies/OrangeWrapped.png',
        10: 'CandyCrush2.0/candies/PurpleWrapped.png',
        11: 'CandyCrush2.0/candies/RedWrapped.png',
        12: 'CandyCrush2.0/candies/YellowWrapped.png'
    };
    
    const numOfRows = 9;
    const numOfCols = 9;
    
    let grid;
    let gridContainerElem;
    let score =0 ;
    gridContainerElem =  document.getElementById("grid-container");
    const scoreText= document.getElementById("score")
    let root = document.documentElement;
    root.style.setProperty('--rows', numOfRows);
    root.style.setProperty('--cols', numOfCols);
    scoreText.innerHTML = "Score: " + score;

    function createGridArray() {
        grid = new Array(numOfRows);
        for (let i = 0; i < numOfRows; i++) {
            grid[i] = new Array(numOfCols);
        }
    }

    function addImage(src, id) {
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
  
        tdiv.appendChild(img);
    
        return tdiv;
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
    createGridArray();
    createImageGrid();
    
    function temp_bfs(i1, j1, visited, original_Value){
        let stack = [[i1, j1]];
        let size =0 ;
        while (stack.length != 0){
            
            let [x, y] = stack.pop();
            visited[x][y] = true;
            size += 1; //  
            if (x + 1 < grid.length && (grid[x + 1][y] == original_Value || (Math.abs(grid[x+1][y]-original_Value) == 6)) && !visited[x + 1][y]) {
                stack.push([x + 1, y]);
            }
            if (x - 1 >= 0 && (grid[x - 1][y] == original_Value || (Math.abs(grid[x-1][y]-original_Value) == 6)) && !visited[x - 1][y]) {
                stack.push([x - 1, y]);
            }
            if (y + 1 < grid[x].length && (grid[x][y + 1] == original_Value || (Math.abs(grid[x][y+1]-original_Value) == 6)) && !visited[x][y + 1]) {
                stack.push([x, y + 1]);
            }
            if (y - 1 >= 0 && (grid[x][y - 1] == original_Value || (Math.abs(grid[x][y-1]-original_Value) == 6)) && !visited[x][y - 1]) {
                stack.push([x, y - 1]);
            }
        }
        return size;
    }

    


    function checkAll(){
        

        let changes= false;
        let visited = Array.from(Array(numOfRows), ()=> Array(numOfCols).fill(false));

        for (let i = 0; i < numOfRows; i++){
            for (let j = 0; j < numOfCols; j++){
                let size = temp_bfs(i, j, visited, grid[i][j]);
                if (size >= 3){
                    
                    changingBFS(i, j);
                    changes = true;
                }
            }
        }
        return changes;
    }

    function updateImages(){
        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                const sourceId = i*numOfRows + j;
                const current_Elem = document.querySelector(`[data-id= "${sourceId}"]`)
              
                current_Elem.src = candy_codes[grid[i][j]];
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
    }
    

    function allowDrop(ev) {
        ev.preventDefault();
    }
    
    function dragstart(ev) {
        ev.dataTransfer.setData("sourceId", ev.target.getAttribute("data-id"));
    }
    function tempSwap(i1, j1, i2, j2){
        var temp_grid_val1 = grid[i1][j1];
        var temp_grid_val2 = grid[i2][j2];
        grid[i1][j1] = temp_grid_val2;
        grid[i2][j2] = temp_grid_val1;
    }
    // So when I add it to this function, it infinite loops aswell. Some how the stack doesn't empty out.
    // ima print out wht elements it is.
    function changingBFS(i1, j1){
        let stack = [[i1, j1]];
        let original_Value = grid[i1][j1];
        let size =0 ;
        let visited = Array.from(Array(numOfRows), ()=> Array(numOfCols).fill(false));

        while (stack.length != 0){
            let [x, y] = stack.pop();
            visited[x][y]= true;
            if (grid[x][y] > 6){
                console.log("Big boom!");
                if (x+1 < grid.length){
                    if (y + 1<  grid[0].length){
                        grid[x+1][y+1] = 0;
                        grid[x][y+1]= 0;
                    } 
                    if (y-1 > 0){
                        grid[x+1][y-1] = 0;
                        grid[x][y-1] = 0;
                    }
                    grid[x+1][y] = 0;
                }
                if (x-1 > 0){
                    if (y + 1<  grid[0].length){
                        grid[x-1][y+1] = 0;
                    }
                    if (y-1 > 0){
                        grid[x-1][y-1] = 0;
                    }
                    grid[x-1][y] = 0;
                    score += 150000;
                }
                
            }
            
            size += 1; // //  || (Math.abs(grid[x+1][y]-original_Value) == 6)
            if (x + 1 < grid.length && (grid[x + 1][y] == original_Value || Math.abs(grid[x+1][y]-original_Value) == 6) && !visited[x+1][y]) {
                stack.push([x + 1, y]);
            }
            if (x - 1 >= 0 && (grid[x - 1][y] == original_Value || Math.abs(grid[x-1][y]-original_Value) == 6) && !visited[x-1][y] ) {
                stack.push([x - 1, y]);
            }
            if (y + 1 < grid[x].length && (grid[x][y + 1] == original_Value || Math.abs(grid[x][y+1]-original_Value) == 6) && !visited[x][y+1]) {
                stack.push([x, y + 1]);
            }
            if (y - 1 >= 0 && (grid[x][y - 1] == original_Value || Math.abs(grid[x][y-1]-original_Value) == 6) && !visited[x][y-1]) {
                stack.push([x, y - 1]);
            }
            grid[x][y] = 0;

            
        }
        if (size >= 5){
            if (original_Value > 6){
                grid[i1][j1] = original_Value;
            }
            else {
                grid[i1][j1] = original_Value+6;
            }
        }
        score += size * 15;
    }

    function bfs(i1, j1, original_Value){
        let stack = [[i1, j1]];
        let size =0 ;
        let visited = Array.from(Array(numOfRows), ()=> Array(numOfCols).fill(false));
        while (stack.length != 0){
            
            let [x, y] = stack.pop();
            visited[x][y] = true;
            size += 1; // || Math.abs(grid[x+1][y]-original_Value) == 6
            if (x + 1 < grid.length && (grid[x + 1][y] == original_Value || Math.abs(grid[x+1][y]-original_Value) == 6) && !visited[x + 1][y]) {
                stack.push([x + 1, y]);
            }
            if (x - 1 >= 0 && (grid[x - 1][y] == original_Value || Math.abs(grid[x-1][y]-original_Value) == 6) && !visited[x - 1][y]) {
                stack.push([x - 1, y]);
            }
            if (y + 1 < grid[x].length && (grid[x][y + 1] == original_Value || Math.abs(grid[x][y+1]-original_Value) == 6 ) && !visited[x][y + 1]) {
                stack.push([x, y + 1]);
            }
            if (y - 1 >= 0 && (grid[x][y - 1] == original_Value || Math.abs(grid[x][y-1]-original_Value) == 6) && !visited[x][y - 1]) {
                stack.push([x, y - 1]);
            }
        }
        return size;
    }

    function gravity(){
        const maxNumOfCandyCodes = Object.keys(candy_codes).length - 6;
        for (let j =0 ; j < numOfCols; j++){
            var temp = [];
            for (let i = 0; i < numOfRows; i++){
                if (grid[i][j] == 0){
                    temp.unshift((Math.floor(Math.random() * maxNumOfCandyCodes) + 1));
                }
                else {
                    temp.push(grid[i][j]);
                }
            }    
            for (let i = 0; i < numOfCols; i++){
                grid[i][j] = temp.shift();
            }    
        }
        
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

        const target_i = Math.floor(targetId / numOfCols);
        const target_j = targetId % numOfCols;
        const source_i = Math.floor(sourceId / numOfCols);
        const source_j = sourceId % numOfCols;
        if (sourceId - targetId == 1) {
            tempSwap(source_i, source_j, target_i, target_j);
            let size = bfs(target_i, target_j, grid[target_i][target_j])
            if (size >= 3){
                console.log("Good swap!");
                changingBFS(target_i, target_j);
                gravity();
                updateImages();
                printGridArray();
            }

            else {
                console.log("Bad swap!");
                tempSwap(source_i, source_j, target_i, target_j);

            }
    
            
        }
        else if (sourceId - targetId == -1) {
            tempSwap(source_i, source_j, target_i, target_j);
            let size = bfs(target_i, target_j, grid[target_i][target_j]);
            if (size >= 3){
                console.log("Good swap!");
                changingBFS(target_i, target_j);
                gravity();
                updateImages();
                printGridArray();
            }
            else {
                console.log("Bad swap!");
                tempSwap(source_i, source_j, target_i, target_j);
            }

    
        }
        else if (sourceId- targetId == numOfRows){
            tempSwap(source_i, source_j, target_i, target_j);
            let size = bfs(target_i, target_j, grid[target_i][target_j]);
            if (size >= 3){
                console.log("Good swap!");
                changingBFS(target_i, target_j);
                gravity();
                updateImages();
                printGridArray();
            }
            else {
                console.log("Bad Swap!");
                tempSwap(source_i, source_j, target_i, target_j);

            }
            
        }
        else if (sourceId- targetId == -numOfRows){
            tempSwap(source_i, source_j, target_i, target_j)
            let size = bfs(target_i, target_j, grid[target_i][target_j]);
            if (size >= 3){
                console.log("Good swap!");
                changingBFS(target_i, target_j);
                gravity();
                updateImages();
                printGridArray();
            }
            else {
                console.log("Bad swap!");
                tempSwap(source_i, source_j, target_i, target_j);
            }
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
    window.setInterval(function(){

        checkAll();
        gravity();
        updateImages();
        scoreText.innerHTML = "Score: " + score;

    }, 100);
})
