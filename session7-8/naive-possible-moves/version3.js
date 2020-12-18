class Cell {
    constructor(x,y,obstacle, template, parentRow){
        this.x = x;
        this.y = y;
        this.obstacle = obstacle;
        const htmlElement = template.content.cloneNode(true).querySelector("div");
        htmlElement.classList.add(`x${this.x}y${this.y}`);
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
const distance = 20;
document.querySelector(`.x${startingPoint.x}y${startingPoint.y}`).classList.add("player");


// First iteration on main thread
const directions = [{ x : 0, y : 1 }, { x : 0, y : -1}, { x : 1, y : 0},{ x : -1, y : 0}];

let origins = directions.map((dir) => { return {x : startingPoint.x + dir.x, y : startingPoint.y + dir.y}});
origins = origins.filter((coords) => grid.cells[coords.y] && grid.cells[coords.y][coords.x]);

for(let o of origins){
    document.querySelector(`.x${o.x}y${o.y}`).classList.add("walkable");
}

function launchWorker(stPoint,dist){
    return new Promise((res,rej) => {
        const worker = new Worker("./worker.js");
        worker.addEventListener("message", (e) => {
            const accessible = e.data;
            for(coords of accessible){
                document.querySelector(`.x${coords.x}y${coords.y}`).classList.add("walkable");
            }
            res();
        });
        worker.postMessage({grid,startingPoint : stPoint,distance : dist});
    });
}

const startTime = performance.now();
Promise.all(origins.map((o) => launchWorker(o,distance - 1))).then(() => {
    console.log(`Finished in ${performance.now() - startTime} ms.`); 
    document.querySelector("#loaderContainer").style.display = "none";
});