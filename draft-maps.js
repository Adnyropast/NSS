
// 

function buildFromData(data) {
    var entities = [];
    
    for(var i = 0; i < data.length; ++i) {
        entities.push(Entity.fromData(data[i]));
    }
    
    buildFromEntities(entities);
}

function buildFromEntities(entities = [], drawables = []) {
    clearEntities();
    
    for(var i = 0; i < entities.length; ++i) {
        addEntity(entities[i]);
    } for(var i = 0; i < drawables.length; ++i) {
        addDrawable(drawables[i]);
    }
}

function loadMap(mapname) {
    
}

// 

function buildTest() {
    var entities = [], drawables = [];
    
    // 
    
    entities.push(CAMERA);
    entities.push(new CameraBoundary([-Infinity, -BASEHEIGHT], [Infinity, BASEHEIGHT]));
    entities.push(new CameraBoundary([-Infinity, BASEHEIGHT], [Infinity, BASEHEIGHT]));
    entities.push(new CameraBoundary([-640, -Infinity], [320, Infinity]));
    entities.push(new CameraBoundary([960, -Infinity], [320, Infinity]));
    
    // 
    
    entities.push((new Adnyropast([80, 80], [16, 16])));
    entities.push((new Enemy([320, 128], [16, 16])));
    entities.push((new Enemy([384, 144], [16, 16])));
    
    entities.push((new Target([320 - 64, 120], [16, 16])));
    entities.push((new Target([0, 120], [16, 16])));
    entities.push((new Target([32, 120], [16, 16])));
    entities.push((new Target([64, 120], [16, 16])));
    entities.push((new Target([96, 120], [16, 16])));
    
    // 
    
    entities.push((new GroundArea([0, 0], [320, 360])).setZIndex(1).setStyle(makeCTile("#00BF00", "#007F00")));
    
    // 
    
    entities.push((new Ground([-640, 328], [1920, 32])).setStyle(makeCTile("#EFDF00", "#9F8F00")));
    
    entities.push((new Ground([360, 320], [64, 8])).setStyle("#0000FF").setSpeed([1, 0]).setReplaceable(true));
    entities.push((new Bouncer([576, 320], [64, 16])).setStyle("#00FFBF"));
    entities.push((new Bouncer([0, 320], [64, 16])).setStyle("#00FFBF"));
    
    <!-- entities.push((new Hazard([320, 160], [32, 16])).setStyle("#7F007F")); -->
    
    entities.push((new Ground([360, 288], [64, 2])).setReplaceId(4));
    entities.push((new Ground([424, 288], [64, 16])).setStyle("#7F7F00"));
    entities.push((new Ground([488, 288], [64, 16])).setStyle("#007F7F"));
    
    <!-- entities.push((new Obstacle([600, 0], [16, Infinity]))); -->
    
    
    <!-- entities.push((new Obstacle([240, 0], [16, 160]))); -->
    <!-- entities.push((new Obstacle([240, 176], [16, 160]))); -->
    
    /**
    
    entities.push((new Obstacle([0, 64], BASEWIDTH, -Infinity)));
    entities.push((new Obstacle(0, BASEHEIGHT - 64, BASEWIDTH, Infinity)));
    entities.push((new Obstacle([64, 0], -Infinity, BASEHEIGHT)));
    entities.push((new Obstacle(BASEWIDTH - 64, 0, Infinity, BASEHEIGHT)));
    
    /**/
    
    
    
    // 
    
    entities.push((new AirArea([-Infinity, -Infinity], [Infinity, Infinity])));
    entities.push((new GravityField([320, 0], [512, 320], [+0, +0.25])));
    
    // 
    
    drawables.push((new RectangleDrawable([16, 304], [16, 80])).setZIndex(-2).setStyle("#9F3F00"));
    // addEntity((new Decoration([-640, 0], [640 * 3, 360])).setZIndex(1000).setStyle(makeCTile("#00CFFF", "#00BFEF")));
    drawables.push((new SkyDrawable([-640, 0], [640 * 3, 360])));
    
    drawables.push((new RectangleDrawable([0, 0], [64, 64])).setZIndex(1).setStyle(PTRN_GRASS1));
    
    buildFromEntities(entities, drawables);
}

function buildTest2() {
    clearEntities();
    
    addEntity(CAMERA);
    
    addEntity((new Adnyropast([320, 180], [16, 16])));
    
    addEntity((new GroundArea([0, 0], [640, 360])).setZIndex(+1).setStyle(IMG_MAP_DRAFT));
    
    addEntity((new Obstacle([0, 0], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([624, 0], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([0, 344], [16, 16])).setStyle("#7F7F00"));
    addEntity((new Obstacle([624, 344], [16, 16])).setStyle("#7F7F00"));
    
    addEntity((new Obstacle([0, 16], [16, 328])));
    addEntity((new Obstacle([16, 0], [608, 16])));
    addEntity((new Obstacle([16, 344], [608, 16])));
    addEntity((new Obstacle([624, 16], [16, 328])));
    
    // addEntity((new Obstacle([32, 32], [16, 16])));
    
    /*/ 
    
    addEntity((new Obstacle([224, 80], [8, 8])));
    addEntity((new Obstacle([232, 80], [8, 8])));
    addEntity((new Obstacle([240, 80], [8, 8])));
    addEntity((new Obstacle([248, 80], [8, 8])));
    addEntity((new Obstacle([256, 80], [8, 8])));
    addEntity((new Obstacle([264, 80], [8, 8])));
    addEntity((new Obstacle([272, 80], [8, 8])));
    addEntity((new Obstacle([280, 80], [8, 8])));
    addEntity((new Obstacle([288, 80], [8, 8])));
    addEntity((new Obstacle([296, 80], [8, 8])));
    addEntity((new Obstacle([304, 80], [8, 8])));
    addEntity((new Obstacle([312, 80], [8, 8])));
    addEntity((new Obstacle([320, 80], [8, 8])));
    addEntity((new Obstacle([224, 88], [104, 8])));
    addEntity((new Obstacle([224, 96], [104, 16])));
    addEntity((new Obstacle([224, 112], [104, 24])));
    addEntity((new Obstacle([224, 136], [104, 32])));
    
    /**/ 
    
    addEntity((new Braker([0, 0], [640, 360], 1.25)));
}

function buildTest3() {
    clearEntities();
    
    addEntity((new Haple([312, 32], [16, 16])));
    
    addEntity((new GroundArea([0, 0], [640, 360])).setZIndex(+1).setStyle(IMG_MAP_GRASS));
    
    addEntity((new Obstacle([0, 0], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 0], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([0, 344], [16, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 344], [16, 16])).setStyle(INVISIBLE));
    
    addEntity((new Obstacle([0, 16], [16, 328])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 0], [608, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 344], [608, 16])).setStyle(INVISIBLE));
    addEntity((new Obstacle([624, 16], [16, 328])).setStyle(INVISIBLE));
    
    addEntity((new Obstacle([64, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 64], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 16], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 64], [8, 232])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([16, 232], [56, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([64, 184], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 120], [232, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([120, 232], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([232, 288], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([176, 176], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 176], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 16], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 64], [288, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([344, 176], [64, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([400, 120], [8, 120])).setStyle(INVISIBLE));
    addEntity((new Obstacle([288, 232], [232, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([344, 232], [8, 112])).setStyle(INVISIBLE));
    addEntity((new Obstacle([400, 288], [8, 56])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 288], [120, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([568, 232], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 176], [168, 8])).setStyle(INVISIBLE));
    addEntity((new Obstacle([456, 64], [8, 64])).setStyle(INVISIBLE));
    addEntity((new Obstacle([512, 120], [112, 8])).setStyle(INVISIBLE));
    
    addEntity((new Decoration([0, 0], [640, 360])).setStyle(IMG_DCRT_L3));
    
    addEntity((new Braker([0, 0], [640, 360], 1.0009765625)));
}

var maps = {};

maps["test"] = [
    {"position" : [0, 0], "size" : [16, 16], "style" : "#FF0000"},
    {"position" : [32, 0], "size" : [16, 16], "style" : "#00FF00"},
    {"position" : [0, 32], "size" : [16, 16], "style" : "#0000FF"},
    {"position" : [32, 32], "size" : [16, 16], "style" : "#FFFF00"},
    {}
];

var mazeStyle = makeCTile("#7F5F00", "#5F3F00");
var cellStyle = makeCTile("#00BF00", "#007F00");// makeCTile("#00AF00", "#006F00");
var wallStyle = makeCTile("#7F7F8F", "#3F3F7F", "#8F8F9F");
mazeStyle = cellStyle;

function makeMazeLevel(mazeSize, cellSize, wallSize) {
    var actualMazeSize = [mazeSize[0] * (cellSize[0] + wallSize[0] * 2), mazeSize[1] * (cellSize[1] + wallSize[1] * 2)];
    var fullCellSize = [cellSize[0] + wallSize[0] * 2, cellSize[1] + wallSize[1] * 2];
    
    var maze = makeMaze(mazeSize[0], mazeSize[1]);
    var entities = [], drawables = [];
    
    entities.push(CAMERA);
    
    entities.push(new CameraBoundary([-Infinity, -BASEHEIGHT], [Infinity, BASEHEIGHT]));
    entities.push(new CameraBoundary([-Infinity, actualMazeSize[1]], [Infinity, BASEHEIGHT]));
    entities.push(new CameraBoundary([-BASEWIDTH, -Infinity], [BASEWIDTH, Infinity]));
    entities.push(new CameraBoundary([actualMazeSize[0], -Infinity], [BASEWIDTH, Infinity]));
    
    entities.push(Haple.fromMiddle([wallSize[0] + cellSize[0] / 2, wallSize[1] + cellSize[1] / 2], [16, 16]).addAction(new FollowMe()));
    
    for(var x = 0; x < mazeSize[0]; ++x) {
        for(var y = 0; y < mazeSize[1]; ++y) {
            var cell = maze[y][x];
            var cX = x * (wallSize[0] * 2 + cellSize[0]), cY = y * (wallSize[1] * 2 + cellSize[1]);
            
            if(cell.walls & 1) {
                /**
                entities.push(new Obstacle(
                    [cX, cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                ));
                /**/
                entities.push((new Ground(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                )).setStyle(wallStyle));
                /**/
            } else {
                /**
                entities.push((new GroundArea(
                    [cX, cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                )).setZIndex(+10).setStyle(cellStyle));
                /**/
            }
            
            if(cell.walls & 2) {
                /**
                entities.push(new Obstacle(
                    [cX + wallSize[0] + cellSize[0], cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                ));
                /**/
                entities.push((new Ground(
                    [cX + wallSize[0] + cellSize[0], cY - wallSize[0]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                )).setStyle(wallStyle));
                /**/
            } else {
                /**
                entities.push((new GroundArea(
                    [cX + wallSize[0] + cellSize[0], cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                )).setZIndex(+10).setStyle(cellStyle));
                /**/
            }
            
            if(cell.walls & 4) {
                /**
                entities.push(new Obstacle(
                    [cX, cY],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                ));
                /**/
                entities.push((new Ground(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                )).setStyle(wallStyle));
                /**/
            } else {
                /**
                entities.push((new GroundArea(
                    [cX, cY],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                )).setZIndex(+10).setStyle(cellStyle));
                /**/
            }
            
            if(cell.walls & 8) {
                /**
                entities.push(new Obstacle(
                    [cX, cY + wallSize[1] + cellSize[1]],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                ));
                /**/
                entities.push((new Ground(
                    [cX - wallSize[0], cY + wallSize[1] + cellSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                )).setStyle(wallStyle));
                /**/
            } else {
                /**
                entities.push((new GroundArea(
                    [cX, cY + wallSize[1] + cellSize[1]],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                )).setZIndex(+10).setStyle(cellStyle));
                /**/
            }
            /**
            entities.push((new GroundArea(
                [cX + wallSize[0], cY + wallSize[1]],
                cellSize
            )).setZIndex(+9).setStyle(cellStyle));
            /**/
            
            if((x > 0 || y > 0) && Math.floor(Math.random() * 3) == 0) {
                var size = [Math.floor(Math.random() * cellSize[0] + 8), Math.floor(Math.random() * cellSize[1] + 8)];
                
                entities.push((new Enemy(
                    [cX + wallSize[0] + Math.floor(Math.random() * (cellSize[0] - wallSize[0])), cY + wallSize[1] + Math.floor(Math.random() * (cellSize[1] - wallSize[1]))],
                    size
                )));
            }
        }
    }
    
    if(Math.floor(Math.random() * 2) == 0) {
        entities.push((new GroundArea([0, 0], [mazeSize[0] * (2 * wallSize[0] + cellSize[0]), mazeSize[1] * (2 * wallSize[1] + cellSize[1])])).setZIndex(+100).setStyle(mazeStyle));
    } else {
        entities.push((Ground.fromMiddle([fullCellSize[0] / 2, fullCellSize[1] - wallSize[1]], [32, 8])));
        entities.push((new AirArea([0, 0], actualMazeSize)));
        entities.push((new GravityField([0, 0], actualMazeSize)));
        drawables.push((new SkyDrawable([0, 0], actualMazeSize)).setStyle(makeSkyPattern(actualMazeSize[1] * 2)));
    }
    
    return {"entities" : entities, "drawables" : drawables};
}

function buildMaze(mazeSize = [10, 10], cellSize = [128, 96], wallSize = [32, 32]) {
    var res = makeMazeLevel(mazeSize, cellSize, wallSize);
    
    buildFromEntities(res.entities, res.drawables);
}
