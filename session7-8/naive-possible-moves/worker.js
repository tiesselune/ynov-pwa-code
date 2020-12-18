self.addEventListener("message",(e) => {
    const {grid,distance,startingPoint} = e.data;
    const accessible = accessibleCellsAround(grid,startingPoint.x,startingPoint.y,distance);
    postMessage(accessible);
});

/**
    * Determines the walkable cells around the starting point given a distance ( Naive implementation )
    * @param {Number} x X position of the starting point
    * @param {Number} y Y position of the starting point
    * @param {Number} distance number of walkable cells to point out
    * @param {Set} existingSet cells that have already been flagged as walkable
    * @returns {Array} An array of the cell coordinates that are walkable from the starting point
    */
function accessibleCellsAround(grid,x,y,distance,existingSet){
    if(distance == 0){
        return existingSet;
    }
    const directions = [{ x : 0, y : 1 }, { x : 0, y : -1}, { x : 1, y : 0},{ x : -1, y : 0}];
    if(!existingSet){
        existingSet = new Set([]);
    }
    for(const dir of directions){
        const target = {x : x + dir.x, y : y + dir.y};
        if( cellIsWalkable(grid,target.x, target.y)){
            existingSet.add(grid.cells[target.y][target.x]);
            accessibleCellsAround(grid,target.x,target.y,distance - 1,existingSet);
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
function cellIsWalkable(grid,x,y){
    if( x < 0 || x >= grid.width || y < 0 || y >= grid.height){
        return false;
    }
    return !grid.cells[y][x].obstacle;
}