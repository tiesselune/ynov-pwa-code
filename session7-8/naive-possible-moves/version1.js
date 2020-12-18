class Cell {
    constructor(x,y,obstacle, template, parentRow){
        this.x = x;
        this.y = y;
        this.obstacle = obstacle;
        this.htmlElement = template.content.cloneNode(true).querySelector("div");
        if(this.obstacle){
            this.htmlElement.classList.add("obstacle");
        }
        parentRow.appendChild(this.htmlElement);
    }
}

class Grid {
    /**
    * @constructor Generates a x * y grid with random obstacles.
    * @param {Number} width horizontal size of the map
    * @param {Number} height vertical size of the map
    * @param {Number} rate percentage of chance that a cell is an obstacle between 0 and 1
    */
    constructor(width,height,rate){
        this.width = width;
        this.height = height;
        this.cells = [];
        
        const cellTemplate = document.querySelector("#cellT");
        const rowTemplate = document.querySelector("#rowT");
        const main = document.querySelector("main");
        for(let i = 0; i < height; i++){
            const row = [];
            const rowDiv = rowTemplate.content.cloneNode(true).querySelector("div");
            for(let j = 0; j < width; j++){
                row.push(new Cell(j,i,Math.random() < rate,cellTemplate,rowDiv));
            }
            main.appendChild(rowDiv);
            this.cells.push(row);
        }
    }
    
    /**
    * Determines the walkable cells around the starting point given a distance ( Naive implementation )
    * @param {Number} x X position of the starting point
    * @param {Number} y Y position of the starting point
    * @param {Number} distance number of walkable cells to point out
    * @param {Set} existingSet cells that have already been flagged as walkable
    * @returns {Array} An array of the cell coordinates that are walkable from the starting point
    */
    accessibleCellsAround(x,y,distance,existingSet){
        if(distance == 0){
            return existingSet;
        }
        const directions = [{ x : 0, y : 1 }, { x : 0, y : -1}, { x : 1, y : 0},{ x : -1, y : 0}];
        if(!existingSet){
            existingSet = new Set([]);
        }
        for(const dir of directions){
            const target = {x : x + dir.x, y : y + dir.y};
            if( this.cellIsWalkable(target.x, target.y)){
                existingSet.add(this.cells[target.y][target.x]);
                this.accessibleCellsAround(target.x,target.y,distance - 1,existingSet);
            }
        }
        return existingSet;
    }
    
    /**
    * Determines if a given cell is walkable
    * @param {Number} x x coordinate of the cell
    * @param {Number} y y coordinate of the cell
    * @returns {Boolean} A boolean wether the cell is walkable or not
    */
    cellIsWalkable(x,y){
        if( x < 0 || x >= this.width || y < 0 || y >= this.height){
            return false;
        }
        return !this.cells[y][x].obstacle;
    }
}

function randInt(min,max){
    return min + Math.floor((max-min)*Math.random());
}

const grid = new Grid(80,80,0.25);
const startingPoint = {x : randInt(0,80), y : randInt(0,80)};
const distance = 14;
grid.cells[startingPoint.y][startingPoint.x].htmlElement.classList.add("player");
setTimeout(()=> {
    const startTime = performance.now();
    
    const accessible = grid.accessibleCellsAround(startingPoint.x,startingPoint.y,distance);
    const endTime = performance.now();
    
    console.log(endTime-startTime + " ms");
    
    for(const cell of accessible){
        cell.htmlElement.classList.add("walkable");
    }
    document.querySelector("#loaderContainer").style.display = "none";
},16);

