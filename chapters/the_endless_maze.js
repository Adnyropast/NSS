
chapters["the_endless_maze"] = {
    "playerPositionM": [0, 0],
    "startMap": "0",
    "maps": {},
    "protagonistClassName": "Haple"
};

chapters["the_endless_maze"].maps["0"] = {
    "camera": {"positionM": [0, 0]},
    "variable_entities": [
        {"className": "MazeGenerator"}
    ]
};

var mazeStyle = makeCTile("#7F5F00", "#5F3F00");
var cellStyle = makeCTile("#00BF00", "#007F00");// makeCTile("#00AF00", "#006F00");

mazeStyle = makeCTile("#00FF00", "#00BF00");
mazeStyle = makeCTile("#00FF00", "#00BF00", "#00DF00");

function possibleCells(mazeSize) {
    const cells = [];
    
    for(let i = 0; i < mazeSize[0] * mazeSize[1]; ++i) {
        cells.push(i);
    }
    
    return cells;
}

function cellNToPos(mazeSize, n) {
    return [n % mazeSize[0], Math.floor(n / mazeSize[0])];
}

function randomCellPositions(mazeSize, count) {
    const ns = array_shuffle(possibleCells(mazeSize));
    const positions = [];
    
    if(count > ns.length) {
        count = ns.length;
    }
    
    for(let i = 0; i < count; ++i) {
        positions.push(cellNToPos(mazeSize, ns[i]));
    }
    
    return positions;
}

class MazeLevelBuilder {
    constructor(mazeSize = [10, 10], cellSize = [128, 96], wallSize = [32, 32]) {
        this.mazeSize = mazeSize;
        this.cellSize = cellSize;
        this.wallSize = wallSize;
        this.fullCellSize;
        this.actualMazeSize;
        this.maze;
        this.playerX;
        this.playerY;
        this.cell;
        this.cX;
        this.cY;
        this.cellCenterX;
        this.cellCenterY;
        
        this.mapState;
        
        this.playerCellFunctions = new SetArray();
        this.cellFunctions = new SetArray();
        
        this.mode = array_random(["topdown", "sideways", "sideways-water"]);
        
        this.doorCount = irandom(1, 4);
        this.doors = new SetArray();
    }
    
    setMazeSize(mazeSize) {
        this.mazeSize = mazeSize;
        
        return this;
    }
    
    setCellSize(cellSize) {
        this.cellSize = cellSize;
        
        return this;
    }
    
    setWallSize(wallSize) {
        this.wallSize = wallSize;
        
        return this;
    }
    
    setMode(mode) {
        this.mode = mode;
        
        return this;
    }
    
    setDoorCount(doorCount) {
        this.doorCount = doorCount;
        
        return this;
    }
    
    getFullCellSize() {
        return Vector.addition(this.cellSize, Vector.multiplication(this.wallSize, 2));
    }
    
    getActualMazeSize() {
        return Vector.multiplication(this.mazeSize, this.getFullCellSize());
    }
    
    build() {
        this.mapState = {
            "camera": {"positionM": []},
            "variable_entities": []
        };
        
        this.fullCellSize = this.getFullCellSize();
        this.actualMazeSize = this.getActualMazeSize();
        
        this.maze = makeMaze(this.mazeSize[0], this.mazeSize[1]);
        
        ////  ////
        
        const boundaryWidth = Math.max(this.actualMazeSize[0], DEF_CAMSIZE[0]);
        const boundaryHeight = Math.max(this.actualMazeSize[1], DEF_CAMSIZE[1]);
        this.mapState.variable_entities.push({"className": "CameraBoundaryAround", "position": [0, 0], "size": [boundaryWidth, boundaryHeight]});
        
        // 
        
        this.playerX = Math.floor(Math.random() * this.mazeSize[0]);
        this.playerY = Math.floor(Math.random() * this.mazeSize[1]);
        
        this.doors = randomCellPositions(this.mazeSize, this.doorCount);
        
        // 
        
        for(this.x = 0; this.x < this.mazeSize[0]; ++this.x) {
            for(this.y = 0; this.y < this.mazeSize[1]; ++this.y) {
                this.cell = this.maze[this.y][this.x];
                this.cX = this.x * this.fullCellSize[0];
                this.cY = this.y * this.fullCellSize[1];
                this.cellCenterX = this.cX + this.wallSize[0] + this.cellSize[0]/2;
                this.cellCenterY = this.cY + this.wallSize[1] + this.cellSize[1]/2;
                
                this.cellData();
                
            }
        }
        
        // 
        
        if(this.mode === "topdown") {
            /**/
            
            this.mapState.variable_entities.push({
                "className": "MazeGroundArea",
                "position": [0, 0],
                "size": this.actualMazeSize
            });
            
            /**
            
            for(let x = 0; x < this.actualMazeSize[0]; x += this.fullCellSize[0]) {
                for(let y = 0; y < this.actualMazeSize[1]; y += this.fullCellSize[1]) {
                    this.mapState.variable_entities.push({
                        "className": "MazeGroundArea",
                        "position": [x, y],
                        "size": this.fullCellSize
                    });
                }
            }
            
            /**/
            
            this.mapState.variable_entities.push({
                "className": "SunlightDecoration",
                "position": [0, 0]
            });
        }
        
        else if(this.mode === "sideways") {
            this.mapState.variable_entities.push({
                "className": "SidewaysSetter",
                "position": [0, 0],
                "size": this.actualMazeSize
            });
            this.mapState.variable_entities.push({
                "className": "SkyDecoration",
                "position": [0, 0],
                "size": this.actualMazeSize
            });
            this.mapState.variable_entities.push({
                "className": "SunlightDecoration",
                "position": [0, 0]
            });
        }
        
        else if(this.mode === "sideways-water") {
            this.mapState.variable_entities.push({
                "className": "WaterArea",
                "position": [0, 0],
                "size": this.actualMazeSize
            });
            this.mapState.variable_entities.push({
                "className": "SunlightDecoration",
                "position": [0, 0]
            });
        }
        
        return this.mapState;
    }
    
    playerCellData() {
        // Camera
        
        const camera = (Camera.fromMiddle([this.cellCenterX, this.cellCenterY]));
        camera.maxSize = this.actualMazeSize;
        
        this.mapState.camera.positionM = camera.getPositionM();
        this.mapState.camera.size = camera.size;
        
        // Player
        
        getCurrentChapter().playerPositionM = [this.cellCenterX, this.cellCenterY];
        
        // Support platform
        
        if(this.mode === "sideways" && !(this.cell.walls & 8)) {
            this.mapState.variable_entities.push({
                "className": "SoftPlatform",
                "positionM": [
                    this.cX + this.fullCellSize[0]/2,
                    this.cY + this.fullCellSize[1] - this.wallSize[1] + 4
                ],
                "size": [this.cellSize[0], 8]
            });
        }
        
        // 
        
        for(let i in this.playerCellFunctions) {
            this.playerCellFunctions[i].bind(this)();
        }
    }
    
    enemyCellData() {
        const enemySize = [
            8 + Math.floor(Math.random() * this.cellSize[0]/2),
            8 + Math.floor(Math.random() * this.cellSize[1]/2)
        ];
        
        const enemyPosition = [
            this.cX + this.wallSize[0] + Math.floor(Math.random() * (this.cellSize[0] - enemySize[0])),
            this.cY + this.wallSize[1] + Math.floor(Math.random() * (this.cellSize[1] - enemySize[1]))
        ];
        
        let className = "Enemy";
        
        if(irandom(0, 1) === 0) {
            className = "SniperEnemy";
        }
        
        this.mapState.variable_entities.push({
            "className": className,
            "position": enemyPosition,
            "size": enemySize
        });
    }
    
    cellData() {
        if(this.x === this.playerX && this.y === this.playerY) {
            this.playerCellData();
        }
        
        else {
            if(irandom(0, 2) === 0) {
                this.enemyCellData();
            }
        }
        
        for(let i = 0; i < this.doors.length; ++i) {
            const x = this.doors[i][0];
            const y = this.doors[i][1];
            
            if(this.x === x && this.y === y) {
                const doorSize = [16, 16];
                
                const chapter = getCurrentChapter();
                
                let nextMapName = 0;
                
                for(let i in chapter.maps) {
                    ++nextMapName;
                }
                
                // console.log("Generating a door with nextmapname: " + nextMapName);
                
                const doorData = {
                    "className": "MazeExit",
                    "position": [
                        this.cX + this.wallSize[0] + Math.floor(Math.random() * (this.cellSize[0] - doorSize[0])),
                        this.cY + this.wallSize[1] + Math.floor(Math.random() * (this.cellSize[1] - doorSize[1]))
                    ],
                    "size": doorSize,
                    "mapName": nextMapName
                };
                
                this.mapState.variable_entities.push(doorData);
                
                // console.log("Creating map maze \"" + nextMapName + "\"");
                
                chapter.maps[nextMapName] = {
                    "camera": {"positionM": [0, 0]},
                    "variable_entities": [
                        {"className": "MazeGenerator", "previousMapName": chapter.lastMap, "entrancePositionM": Vector.addition(doorData.position, Vector.division(doorData.size, 2))}
                    ]
                };
            }
        }
        
        // Left walls
        
        if(this.cell.walls & 1) {
            const wallSize = [
                2 * this.wallSize[0],
                4 * this.wallSize[1] + this.cellSize[1]
            ];
            
            const wallPosition = [
                this.cX - this.wallSize[0],
                this.cY - this.wallSize[1]
            ];
            
            this.mapState.variable_entities.push({
                "className": "MazeWall",
                position: wallPosition,
                size: wallSize
            });
        }
        
        // Right walls
        
        if(this.cell.walls & 2) {
            const wallSize = [
                2 * this.wallSize[0],
                4 * this.wallSize[1] + this.cellSize[1]
            ];
            
            const wallPosition = [
                this.cX + this.wallSize[0] + this.cellSize[0],
                this.cY - this.wallSize[1]
            ];
            
            this.mapState.variable_entities.push({
                "className": "MazeWall",
                position: wallPosition,
                size: wallSize
            });
        }
        
        // Top walls
        
        if(this.cell.walls & 4) {
            const wallSize = [
                4 * this.wallSize[0] + this.cellSize[0],
                2 * this.wallSize[1]
            ];
            
            const wallPosition = [
                this.cX - this.wallSize[0],
                this.cY - this.wallSize[1]
            ];
            
            this.mapState.variable_entities.push({
                "className": "MazeWall",
                position: wallPosition,
                size: wallSize
            });
        }
        
        // Bottom walls
        
        if(this.cell.walls & 8) {
            const wallSize = [
                4 * this.wallSize[0] + this.cellSize[0],
                2 * this.wallSize[1]
            ];
            
            const wallPosition = [
                this.cX - this.wallSize[0],
                this.cY + this.wallSize[1] + this.cellSize[1]
            ];
            
            this.mapState.variable_entities.push({
                "className": "MazeWall",
                position: wallPosition,
                size: wallSize
            });
        }
        
        // Other
        
        if(this.mode === "topdown") {
            for(let i = 0, plantCount = irandom(1, 5); i < plantCount; ++i) {
                const position = [
                    this.cX + this.wallSize[0] + random(0, this.cellSize[0] - 16),
                    this.cY + this.wallSize[1] + random(0, this.cellSize[1] - 16)
                ];
                
                let className = "GrassPatch";
                
                if(irandom(0, 1)) {
                    className = "TopdownTree";
                }
                
                this.mapState.variable_entities.push({
                    "className": className,
                    "position": position
                });
            }
        }
        
        // 
        
        for(let i in this.cellFunctions) {
            this.cellFunctions[i].bind(this)();
        }
    }
}
