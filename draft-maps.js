
// 

function loadFromData(data) {
    let lists = {
        "camera" : null,
        "player0" : null,
        "entities" : [],
        "drawables" : []
    };
    
    if(data.hasOwnProperty("camera")) {
        lists.camera = Camera.fromData(data.camera);
    }
    
    lists.player0 = getPlayerClass().fromData({positionM : playerPositionM});
    
    for(var i = 0; i < data.entities.length; ++i) {
        let entityData = data.entities[i];
        let entityClass = Entity;
        
        if(EC.hasOwnProperty(entityData.classId)) {
            entityClass = EC[entityData.classId];
        }
        
        lists.entities.push(entityClass.fromData(entityData));
    }
    
    if(Array.isArray(data["drawables"])) for(let i = 0; i < data.drawables.length; ++i) {
        // lists.drawables.push();
    }
    
    loadFromLists(lists);
}

function loadFromLists(lists) {
    // if(!(lists.camera instanceof Entity)) {console.warn("Camera not defined :", lists.camera)}
    // if(!(lists.player0 instanceof Entity)) {console.warn("Player not defined :", lists.player0)}
    // if(!Array.isArray(lists.entities)) {console.warn("Entities not defined :", lists.entities)}
    
    clearMap();
    
    if(lists.camera instanceof Entity) {
        setCamera(lists.camera);
    } if(lists.player0 instanceof Entity) {
        setPlayer(lists.player0);
    }
    
    for(var i = 0; i < lists.entities.length; ++i) {
        addEntity(lists.entities[i]);
    }
    
    if(lists.hasOwnProperty("drawables")) for(var i = 0; i < lists.drawables.length; ++i) {
        addDrawable(lists.drawables[i]);
    }
}

function loadMap(mapname) {
    if(maps.hasOwnProperty(mapname)) {
        loadFromData(maps[mapname]);
    }
}

// 

function loadTest() {
    let lists = {
        "camera" : Camera.fromMiddle([BASEWIDTH / 2, BASEHEIGHT / 2]),
        "player0" : (new Adnyropast([80, 80])),
        entities : [],
        drawables : []
    };
    
    // 
    
    lists.entities.push(new CameraBoundary([-Infinity, -BASEHEIGHT], [Infinity, BASEHEIGHT]));
    lists.entities.push(new CameraBoundary([-Infinity, BASEHEIGHT], [Infinity, BASEHEIGHT]));
    lists.entities.push(new CameraBoundary([-640, -Infinity], [320, Infinity]));
    lists.entities.push(new CameraBoundary([960, -Infinity], [320, Infinity]));
    
    // 
    
    lists.entities.push((new Enemy([320, 128], [16, 16])));
    lists.entities.push((new Enemy([384, 144], [16, 16])));
    
    lists.entities.push((new Target([320 - 64, 120], [16, 16])));
    lists.entities.push((new Target([0, 120], [16, 16])));
    lists.entities.push((new Target([32, 120], [16, 16])));
    lists.entities.push((new Target([64, 120], [16, 16])));
    lists.entities.push((new Target([96, 120], [16, 16])));
    
    // 
    
    lists.entities.push((new GroundArea([0, 0], [320, 360])).setZIndex(1).setStyle(makeCTile("#00BF00", "#007F00")));
    
    // 
    
    lists.entities.push((new Ground([-640, 328], [1920, 32])).setStyle(makeCTile("#EFDF00", "#9F8F00")));
    
    lists.entities.push((new MovingObstacle([360, 320], [64, 8])).setStyle("#0000FF").setSpeed([1, 0]).addInteraction(new ReplaceRecipient()));
    lists.entities.push((new Bouncer([576, 320], [64, 16])).setStyle("#00FFBF"));
    lists.entities.push((new Bouncer([0, 320], [64, 16])).setStyle("#00FFBF"));
    
    <!-- lists.entities.push((new Hazard([320, 160], [32, 16])).setStyle("#7F007F")); -->
    
    // lists.entities.push((new Ground([360, 288], [64, 2])).setReplaceId(4));
    lists.entities.push((new Ground([424, 288], [64, 16])).setStyle("#7F7F00"));
    lists.entities.push((new Ground([488, 288], [64, 16])).setStyle("#007F7F"));
    
    <!-- lists.entities.push((new Obstacle([600, 0], [16, Infinity]))); -->
    
    
    <!-- lists.entities.push((new Obstacle([240, 0], [16, 160]))); -->
    <!-- lists.entities.push((new Obstacle([240, 176], [16, 160]))); -->
    
    /**
    
    lists.entities.push((new Obstacle([0, 64], BASEWIDTH, -Infinity)));
    lists.entities.push((new Obstacle(0, BASEHEIGHT - 64, BASEWIDTH, Infinity)));
    lists.entities.push((new Obstacle([64, 0], -Infinity, BASEHEIGHT)));
    lists.entities.push((new Obstacle(BASEWIDTH - 64, 0, Infinity, BASEHEIGHT)));
    
    /**/
    
    
    
    // 
    
    lists.entities.push((new AirArea([-Infinity, -Infinity], [Infinity, Infinity])));
    lists.entities.push((new GravityField([320, 0], [512, 320], [+0, +0.25])));
    
    // 
    
    lists.drawables.push((new RectangleDrawable([16, 304], [16, 80])).setZIndex(-2).setStyle("#9F3F00"));
    // addEntity((new Decoration([-640, 0], [640 * 3, 360])).setZIndex(1000).setStyle(makeCTile("#00CFFF", "#00BFEF")));
    lists.drawables.push((new SkyDrawable([-640, 0], [640 * 3, 360])).setStyle(makeSkyPattern(45*16)));
    
    lists.drawables.push((new RectangleDrawable([0, 0], [64, 64])).setZIndex(1).setStyle(PTRN_GRASS1));
    
    loadFromLists(lists);
}

function loadTest2() {
    clearMap();
    
    addEntity(Camera.fromMiddle([BASEWIDTH / 2, BASEHEIGHT / 2]));
    
    addEntity((new Adnyropast([320, 180])));
    
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

var maps = {};

maps["hub"] = {
    "camera" : {"positionM" : [0, 0]},
    "entities" : [
        {"classId" : "cameraBoundary", "position" : [0, -135], "size" : [0, 0]},
        {"classId" : "cameraBoundary", "position" : [0, +135], "size" : [0, 0]},
        {"classId" : "cameraBoundary", "position" : [-240, 0], "size" : [0, 0]},
        {"classId" : "cameraBoundary", "position" : [+240, 0], "size" : [0, 0]},
        
        {"classId" : "invisibleWall", "position" : ["-Infinity", -135], "size" : ["Infinity", 0]},
        {"classId" : "invisibleWall", "position" : ["-Infinity", +135], "size" : ["Infinity", 0]},
        {"classId" : "invisibleWall", "position" : [-240, "-Infinity"], "size" : [0, "Infinity"]},
        {"classId" : "invisibleWall", "position" : [+240, "-Infinity"], "size" : [0, "Infinity"]},
        
        {"classId" : "softPlatform", "position" : [-240, -48], "size" : [112, 1]},
        {"classId" : "ladder", "position" : [-240, -48], "size" : [112, 104]},
        
        // {"classId" : "pitArea", "position" : [-640, 360], "size" : [1280, 720], "style" : "#00FF00"},
        {"classId" : "ground", "position" : [-128, 64], "size" : [256, 360-64], "style" : "#FF0000"},
        {"classId" : "ground", "position" : [-256, 56], "size" : [128, 16], "style" : "#0000FF"},
        {"classId" : "ground", "position" : [128, 56], "size" : [128, 16], "style" : "#0000FF"},
        {"classId" : "lookupDoor", "position" : [-120, 32], "size" : [16, 32], "mapname" : "hpp0", "warpPositionM" : [-176, 70]},
        {"classId" : "lookupDoor", "position" : [8, 32], "size" : [16, 32], "mapname" : "maze"},
        {"classId" : "lookupDoor", "position" : [40, 32], "size" : [16, 32], "mapname" : "maze-topdown"},
        {"classId" : "lookupDoor", "position" : [72, 32], "size" : [16, 32], "mapname" : "maze-sideways"},
        {"classId" : "lookupDoor", "position" : [104, 32], "size" : [16, 32], "mapname" : "maze-water"},
        
        {"classId" : "dummy", "position" : [144, 32], "size" : [16, 32]},
        
        {"classId" : "sidewaysSetter", "position" : [-640, -360], "size" : [1280, 720]},
        
        {"classId" : "skyDecoration", "position" : [-240, -135], "size" : [480, 270]},
        {"classId" : "sunlightDecoration", "position" : [0, 0], "size" : [CANVAS.width, CANVAS.height]}
    ]
};

maps["maze"] = {
    "entities" : [{"classId" : "mazeGenerator"}]
};

maps["maze-topdown"] = {
    "entities" : [{"classId" : "mazeGenerator", "mode" : "topdown"}]
};

maps["maze-sideways"] = {
    "entities" : [{"classId" : "mazeGenerator", "mode" : "sideways"}]
};

maps["maze-water"] = {
    "entities" : [{"classId" : "mazeGenerator", "mode" : "sideways-water"}]
};

maps["hpp0"] = {
    "camera" : {"positionM" : [0, 0], "size" : [448, 252]},
    "entities" : [
        {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        
        {"classId" : "lookupDoor", "position" : [-200, 46], "size" : [16, 32], "mapname" : "hub", "warpPositionM" : [0, 0]},
        
        {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        {"classId" : "ground", "position" : [+224, 78], "size" : [448, 48]},
        
        {"classId" : "treeTrunk", "position" : [-224, -126], "size" : [16, 204]},
        {"classId" : "treeTrunk", "position" : [+208, -126], "size" : [16, 164]},
        {"classId" : "invisibleWall", "position" : [-208, -640], "size" : [0, 514]},
        {"classId" : "invisibleWall", "position" : [+208, -640], "size" : [0, 514]},
        
        {"classId" : "treePlatform", "position" : [96, -88]},
        {"classId" : "treeTrunk", "position" : [80, -128], "size" : [16, 48]},
        {"classId" : "lookupDoor", "position" : [104, -120], "size" : [16, 32], "mapname" : "hppa", "warpPositionM" : [-128, -16]},
        
        {"classId" : "autoDoor", "position" : [224, -126], "size" : [448, 252], "mapname" : "hpp1", "warpPositionM" : [-216, 70]},
        
        {"classId" : "sidewaysSetter", "position" : [-224, -126], "size" : [448, 252]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0], "size" : [CANVAS.width, CANVAS.height]},
        {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
    ]
};

maps["hpp1"] = {
    "camera" : {"positionM" : [0, 0], "size" : [448, 252]},
    "entities" : [
        {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        
        {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        
        {"classId" : "autoDoor", "position" : [-672, -126], "size" : [448, 252], "mapname" : "hpp0", "warpPositionM" : [216, 70]},
        {"classId" : "autoDoor", "position" : [224, -126], "size" : [448, 252], "mapname" : "hpp1", "warpPositionM" : [-128, -16]},
        
        {"classId" : "sidewaysSetter", "position" : [-224, -126], "size" : [448, 252]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0], "size" : [CANVAS.width, CANVAS.height]},
        {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
    ]
};

maps["hppa"] = {
    "camera" : {"positionM" : [0, 0], "size" : [448, 252]},
    "entities" : [
        {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        
        {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        
        {"classId" : "autoDoor", "position" : [-672, -126], "size" : [448, 252], "mapname" : "hpp0", "warpPositionM" : [208, 70]},
        {"classId" : "autoDoor", "position" : [224, -126], "size" : [448, 252], "mapname" : "hpp1", "warpPositionM" : [-128, -16]},
        
        {"classId" : "groundArea", "position" : [-224, -126], "size" : [448, 252]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0], "size" : [CANVAS.width, CANVAS.height]},
        {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
    ]
};

loadMap("hub");
transitionIn(), transitionOut();

var mazeStyle = makeCTile("#7F5F00", "#5F3F00");
var cellStyle = makeCTile("#00BF00", "#007F00");// makeCTile("#00AF00", "#006F00");
var wallPattern = makeCTile("#7F7F8F", "#3F3F7F", "#8F8F9F");
mazeStyle = makeCTile("#00FF00", "#00BF00");
mazeStyle = makeCTile("#00FF00", "#00BF00", "#00DF00");
wallPattern = CANVAS.makePattern(makeGradientCTilesCanvas(4, 4, new ColorTransition([0, 0, 0, 1], [255, 255, 255, 1]), new ColorTransition([0, 0, 0, 1], [0, 0, 0, 1])), 64, 64, "repeat");
wallPattern = CANVAS.makePattern(makeGradientCanvas(new ColorTransition(CV_WHITE, [127, 127, 127, 1]), 4, 4), CTILE_WIDTH, CTILE_WIDTH, "repeat");

function rv() {return Math.random() * 255;}

function buildMazeLevel(mazeSize, cellSize, wallSize, mode) {
    var actualMazeSize = [mazeSize[0] * (cellSize[0] + wallSize[0] * 2), mazeSize[1] * (cellSize[1] + wallSize[1] * 2)];
    var fullCellSize = [cellSize[0] + wallSize[0] * 2, cellSize[1] + wallSize[1] * 2];
    
    var maze = makeMaze(mazeSize[0], mazeSize[1]);
    let lists = {
        camera : null,
        player0 : null,
        entities : [],
        drawables : []
    };
    
    /**/
    
    // wallPattern = makeGradientCTiles(4, 4, new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]), new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]));
    skyStyle = makeSkyPattern(actualMazeSize[1] * 2 / CTILE_WIDTH);
    // skyStyle = makeGradientCTilesPattern(1, actualMazeSize[1] * 2 / 16, new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]), new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]));
    skyStyle = makeGradientCanvas(new ColorTransition("#0000FF", "#00FFFF"), 1, actualMazeSize[1] / CTILE_WIDTH);
    // mazeStyle = makeStyledCanvas(makeGradientCTiles(actualMazeSize[0] * 2, actualMazeSize[1] * 2, new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]), new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1])), actualMazeSize[0] * 2, actualMazeSize[1] * 2);
    
    /**/
    
    let entities = lists.entities, drawables = lists.drawables;
    
    var playerX = Math.floor(Math.random() * mazeSize[0]);
    var playerY = Math.floor(Math.random() * mazeSize[1]);
    
    let boundaryWidth = Math.max(actualMazeSize[0], DEF_CAMSIZE[0]);
    let boundaryHeight = Math.max(actualMazeSize[1], DEF_CAMSIZE[1]);
    
    entities.push(new CameraBoundary([-Infinity, -boundaryHeight], [Infinity, boundaryHeight]));
    entities.push(new CameraBoundary([-Infinity, boundaryHeight], [Infinity, boundaryHeight]));
    entities.push(new CameraBoundary([-boundaryWidth, -Infinity], [boundaryWidth, Infinity]));
    entities.push(new CameraBoundary([boundaryWidth, -Infinity], [boundaryWidth, Infinity]));
    
    for(var x = 0; x < mazeSize[0]; ++x) {
        for(var y = 0; y < mazeSize[1]; ++y) {
            var cell = maze[y][x];
            var cX = x * fullCellSize[0], cY = y * fullCellSize[1];
            
            if(x == playerX && y == playerY) {
                lists.camera = (Camera.fromMiddle([cX + wallSize[0] + cellSize[0] / 2, cY + wallSize[1] + cellSize[1] / 2]));
                lists.camera.maxSize = actualMazeSize;
                
                lists.player0 = (getPlayerClass().fromMiddle([cX + wallSize[0] + cellSize[0] / 2, cY + wallSize[1] + cellSize[1] / 2]));
                
                if(mode == "sideways") {
                    entities.push((Ground.fromMiddle([cX + fullCellSize[0] / 2, cY + fullCellSize[1] - wallSize[1]], [32, 8])));
                }
            } else if(Math.floor(Math.random() * 3) == 0) {
                var size = [Math.floor(Math.random() * cellSize[0] / 2 + 8), Math.floor(Math.random() * cellSize[1] / 2 + 8)];
                
                entities.push((new Enemy(
                    [cX + wallSize[0] + Math.floor(Math.random() * (cellSize[0] - wallSize[0])), cY + wallSize[1] + Math.floor(Math.random() * (cellSize[1] - wallSize[1]))],
                    size
                )));
            }
            
            if(cell.walls & 1) {
                /**
                entities.push(new Obstacle(
                    [cX, cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                ));
                /**/
                
                let wall = new Ground(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                );
                
                wall.setStyle(makeStyledCanvas(wallPattern, wall.getWidth(), wall.getHeight()));
                
                entities.push(wall);
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
                
                let wall = new Ground(
                    [cX + wallSize[0] + cellSize[0], cY - wallSize[0]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                );
                
                wall.setStyle(makeStyledCanvas(wallPattern, wall.getWidth(), wall.getHeight()));
                
                entities.push(wall);
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
                
                let wall = new Ground(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                );
                
                wall.setStyle(makeStyledCanvas(wallPattern, wall.getWidth(), wall.getHeight()));
                
                entities.push(wall);
                /**/
            } else {
                /**
                entities.push((new GroundArea(
                    [cX, cY],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                )).setZIndex(+10).setStyle(cellStyle));
                /**/
                
                // entities.push((Ladder.fromMiddle([cX + fullCellSize[0] / 2, cY + fullCellSize[1] / 2], [16, fullCellSize[1]])));
                // entities.push((SoftPlatform.fromMiddle([cX + fullCellSize[0] / 2, cY + fullCellSize[1] / 2], [fullCellSize[0], 16])));
            }
            
            if(cell.walls & 8) {
                /**
                entities.push(new Obstacle(
                    [cX, cY + wallSize[1] + cellSize[1]],
                    [2 * wallSize[0] + cellSize[0], wallSize[1]]
                ));
                /**/
                // console.log("============================================");
                // console.log(4 * wallSize[0] + cellSize[0], wallSize[1] * 2);
                // console.log(wallSize[0] * 16, wallSize[1] * 4);
                
                let wall = new Ground(
                    [cX - wallSize[0], cY + wallSize[1] + cellSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                );
                
                wall.setStyle(makeStyledCanvas(wallPattern, wall.getWidth(), wall.getHeight()));
                
                entities.push(wall);
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
        }
    }
    
    if(mode == "topdown") {
        let groundArea = new GroundArea([0, 0], actualMazeSize);
        
        groundArea.setZIndex(ALMOST_ZERO).setStyle(makeStyledCanvas(mazeStyle, groundArea.getWidth(), groundArea.getHeight()));
        
        entities.push(groundArea);
    } else if(mode == "sideways") {
        entities.push((new AirArea([0, 0], actualMazeSize)));
        entities.push((new GravityField([0, 0], actualMazeSize)));
        drawables.push((new SkyDrawable([0, 0], actualMazeSize)).setStyle(skyStyle));
    } else if(mode == "sideways-water") {
        entities.push((new WaterArea([0, 0], actualMazeSize)));
        
        waterStyle = makeGradientCanvas(new ColorTransition([0, 191, 255, 0.25], [31, 127, 159, 0.25]), 1, actualMazeSize[1] / CTILE_WIDTH);
        
        drawables.push((new SkyDrawable([0, 0], actualMazeSize)).setZIndex(-Infinity).setStyle(waterStyle));
    }
    
    return lists;
}

function loadMaze(mazeSize = [10, 10], cellSize = [128, 96], wallSize = [32, 32], mode = array_random(["topdown", "sideways", "sideways-water"])) {
    var res = buildMazeLevel(mazeSize, cellSize, wallSize, mode);
    
    loadFromLists(res);
}

// loadMaze([10, 10]);
<!-- loadMaze([Math.floor(Math.random() * 7 + 3), Math.floor(Math.random() * 7 + 3)]); -->
<!-- loadTest(); -->
