class Cell {
    constructor(x,y,obstacle, template, parentRow){
        this.x = x;
        this.y = y;
        this.obstacle = obstacle;
        const htmlElement = template.content.cloneNode(true).querySelector("div");
        htmlElement.classList.add(`x${x}y${y}`);
        if(this.obstacle){
            htmlElement.classList.add("obstacle");
        }
        parentRow.appendChild(htmlElement);
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
    
}

function randInt(min,max){
    return min + Math.floor((max-min)*Math.random());
}

const grid = new Grid(80,80,0.25);
const startingPoint = {x : randInt(0,80), y : randInt(0,80)};
const distance = 14;
document.querySelector(`.x${startingPoint.x}y${startingPoint.y}`).classList.add("player");

const worker = new Worker("./worker.js");
const startTime = performance.now();
worker.addEventListener("message",(e) => {
    const endTime = performance.now();
    console.log(`It took ${endTime - startTime} ms.`);
    const accessible = e.data;
    for(const cell of accessible){
        document.querySelector(`.x${cell.x}y${cell.y}`).classList.add("walkable");
    }
    document.querySelector("#loaderContainer").style.display = "none";
});

worker.postMessage({grid,distance,startingPoint});
