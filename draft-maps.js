
// 

function makeEntityFromData(entityData) {
    let entityClass = Entity;
    
    if(EC.hasOwnProperty(entityData.classId)) {
        entityClass = EC[entityData.classId];
    } else {
        console.warn(entityData.classId + " not registered in EC.");
    }
    
    return entityClass.fromData(object_clone(entityData));
}

function makeNewMapState(mapname) {
    const map = maps[mapname];
    let camera = undefined;
    
    try {
        camera = object_clone(map.camera);
    } catch(e) {}
    
    let variable_entities = {};
    
    try {
        variable_entities = JSON.parse(JSON.stringify(map.variable_entities));
    } catch(e) {}
    
    return {
        camera: camera,
        variable_entities: variable_entities
    };
}

function makeNewSaveMaps() {
    const mapsStates = {};
    
    for(let mapname in maps) {
        mapsStates[mapname] = makeNewMapState(mapname);
    }
    
    return mapsStates;
}

function map_exists(mapname) {
    return maps.hasOwnProperty(mapname);
}

function loadFromData(data) {
    let lists = {
        "camera" : null,
        "player0" : null,
        "entities" : [],
        "drawables" : []
    };
    
    if(data.hasOwnProperty("camera") && data.camera != undefined) {
        lists.camera = Camera.fromData(object_clone(data.camera));
    }
    
    lists.player0 = getCurrentCharacter();
    lists.player0.initPositionM(getCurrentSave().playerPositionM);
    
    if(data.variable_entities) {
        for(var i = 0; i < data.variable_entities.length; ++i) {
            let entityData = data.variable_entities[i];
            const entity = makeEntityFromData(entityData);
            entity.mapVariable = true;
            
            lists.entities.push(entity);
        }
    }
    
    if(data.fixed_entities) {
        for(var i = 0; i < data.fixed_entities.length; ++i) {
            let entityData = data.fixed_entities[i];
            const entity = makeEntityFromData(entityData);
            
            lists.entities.push(entity);
        }
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
    
    WORLDLOOP.clearSets();
    
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
    if(map_exists(mapname)) {
        const actualMap = maps[mapname];
        
        const save = getCurrentSave();
        const saveMap = save.maps[mapname];
        
        
        save.lastMap = mapname;
        
        loadFromData(saveMap);
        loadFromData({
            camera: saveMap.camera,
            fixed_entities: actualMap.fixed_entities,
            variable_entities: saveMap.variable_entities
        });
    }
}

// 

function loadTest() {
    let lists = {
        "camera" : Camera.fromMiddle([BASEWIDTH / 2, BASEHEIGHT / 2]),
        "player0" : (new (getPlayerClass())([80, 80])),
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
    lists.drawables.push((new RectangleDrawable([-640, 0], [640 * 3, 360])).setZIndex(+Infinity).setStyle("cyan"));
    
    lists.drawables.push((new RectangleDrawable([0, 0], [64, 64])).setZIndex(1).setStyle("green"));
    
    loadFromLists(lists);
}

var maps = {};

maps["test-background"] = {
    "camera" : {"positionM" : [256, 144], "size" : [512, 288]},
    "fixed_entities" : [
        {"classId" : "skyDecoration", "position" : [0, 0], "size" : [512, 288]}
    ]
};

maps["hub"] = {
    "camera" : {"positionM" : [0, 0]},
    "fixed_entities" : [
        {"classId" : "cameraBoundaryAround", "position" : [-240, -135], "size" : [480, 270]},
        
        // {"classId" : "invisibleWall", "positionM" : ["-Infinity", -135], "size" : ["Infinity", 0]},
        // {"classId" : "invisibleWall", "positionM" : ["-Infinity", +135], "size" : ["Infinity", 0]},
        // {"classId" : "invisibleWall", "positionM" : [-240-320, "-Infinity"], "size" : [640, "Infinity"]},
        // {"classId" : "invisibleWall", "positionM" : [+240+320, "-Infinity"], "size" : [640, "Infinity"]},
        {"classId" : "invisibleWallAround", "position" : [-240, -135], "size" : [480, 270]},
        
        {"classId" : "softPlatform", "position" : [-240, -48], "size" : [112, 1]},
        {"classId" : "ladder", "position" : [-240, -48], "size" : [112, 104]},
        
        // {"classId" : "pitArea", "position" : [-640, 360], "size" : [1280, 720], "style" : "#00FF00"},
        {"classId" : "ground", "position" : [-128, 64], "size" : [256, 360-64], "style" : "#FF0000"},
        {"classId" : "ground", "position" : [-256, 56], "size" : [128, 16], "style" : "#0000FF"},
        {"classId" : "ground", "position" : [128, 56], "size" : [128, 16], "style" : "#0000FF"},
        {"classId" : "lookupDoor", "position" : [-120, 32], "size" : [16, 32], "mapname" : "hpp0", "warpPositionM" : [40, 248]/*[-176, 70]*/},
        // {"classId" : "lookupDoor", "position" : [-120, 32], "size" : [16, 32], "mapname" : "hpp1", "warpPositionM" : [16, 56]},
        // {"classId" : "lookupDoor", "position" : [-120, 32], "size" : [16, 32], "mapname" : "hpp2", "warpPositionM" : [16, 248]},
        // {"classId" : "lookupDoor", "position" : [-120, 32], "size" : [16, 32], "mapname" : "hpp3", "warpPositionM" : [16, 56]},
        {"classId" : "lookupDoor", "positionM" : [16, 32+20], "size" : [10, 24], "mapname" : "maze"},
        {"classId" : "lookupDoor", "positionM" : [48, 32+20], "size" : [10, 24], "mapname" : "maze-topdown"},
        {"classId" : "lookupDoor", "positionM" : [80, 32+20], "size" : [10, 24], "mapname" : "maze-sideways"},
        {"classId" : "lookupDoor", "positionM" : [112, 32+20], "size" : [10, 24], "mapname" : "maze-water"},
        {"classId" : "lookupDoor", "positionM" : [-80, 32+20], "size" : [12, 24], "mapname" : "maze0"},
        
        {"classId" : "tree2", "position" : [36, 64-56], "size" : [56, 56]},
        {"classId" : "tree2", "position" : [4, 64-56], "size" : [56, 56]},
        {"classId" : "tree2", "position" : [68, 64-56], "size" : [56, 56]},
        
        {"classId" : "ground", "position" : [-128, -96], "size" : [16, 80]},
        {"classId" : "ground", "position" : [-112, -32], "size" : [224, 16]},
        {"classId" : "ground", "position" : [112, -96], "size" : [16, 128]},
        {"classId" : "waterArea", "position" : [-112, -96], "size" : [224, 64]},
        
        {"classId": "hazard", "position": [-240, 24], "size": [16, 32]},
        
        {"classId" : "sidewaysSetter", "position" : [-640, -360], "size" : [1280, 720]},
        
        {"classId" : "skyDecoration"/*, "position" : [-240, -135], "size" : [480, 270]*/},
        // {"classId" : "sunlightDecoration", "position" : [0, 0]}
    ],
    "variable_entities": [
        {"classId" : "dummy", "position" : [144, 32], "size" : [16, 32]},
        {"classId" : "dummy", "position" : [176, 0], "size" : [48, 56]},
        {"classId" : "dummy", "position" : [-136, -56], "size" : [8, 8]}
    ]
};

maps["maze"] = {
    "fixed_entities" : [{"classId" : "mazeGenerator"}]
};

maps["maze-topdown"] = {
    "fixed_entities" : [{"classId" : "mazeGenerator", "mode" : "topdown"}]
};

maps["maze-sideways"] = {
    "fixed_entities" : [{"classId" : "mazeGenerator", "mode" : "sideways"}]
};

maps["maze-water"] = {
    "fixed_entities" : [{"classId" : "mazeGenerator", "mode" : "sideways-water"}]
};

maps["maze0"] = {
    "camera" : {"positionM" : [256, 144], "size" : [512, 288]},
    "fixed_entities" : [{"classId" : "mazeGenerator", "mode" : "test"}]
};

maps["hpp0"] = {
    "camera" : {"positionM" : [256, 144], "size" : [256*2, 144*2]},
    "fixed_entities" : [
        // {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        // {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        // {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        // {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundaryAround", "position" : [0, 0], "size" : [256*2, 144*2]},
        
        // {"classId" : "lookupDoor", "position" : [-200, 46], "size" : [16, 32], "mapname" : "hub", "warpPositionM" : [0, 0]},
        {"classId" : "lookupDoor", "position" : [16, 224], "size" : [16, 32], "mapname" : "hub", "warpPositionM" : [-96, 56]/*[0, 0]*/},
        
        // {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        // {"classId" : "ground", "position" : [+224, 78], "size" : [448, 48]},
        
        // {"classId" : "treeTrunk", "position" : [-224, -126], "size" : [16, 204]},
        // {"classId" : "treeTrunk", "position" : [+208, -126], "size" : [16, 164]},
        // {"classId" : "invisibleWall", "position" : [-208, -640], "size" : [0, 514]},
        // {"classId" : "invisibleWall", "position" : [+208, -640], "size" : [0, 514]},
        {"classId" : "invisibleWall", "position" : [0, -288], "size" : [512, 288]},
        // {"classId" : "invisibleWallAround", "position" : [0, 0], "size" : [512, 288]},
        
        {"classId" : "treePlatform", "position" : [96, -88]},
        // {"classId" : "treeTrunk", "position" : [80, -128], "size" : [16, 48]},
        // {"classId" : "lookupDoor", "position" : [104, -120], "size" : [16, 32], "mapname" : "hppa", "warpPositionM" : [-128, -16]},
        
        {"classId" : "autoDoor", "position" : [256*2, -126], "size" : [448, 252], "mapname" : "hpp1", "warpPositionM" : [16, 56]},
        
        // {"classId":"ground","position":[0,0],"size":[16,16]},{"classId":"ground","position":[0,16],"size":[16,16]},{"classId":"ground","position":[0,32],"size":[16,16]},{"classId":"ground","position":[0,48],"size":[16,16]},{"classId":"ground","position":[0,64],"size":[16,16]},{"classId":"ground","position":[0,80],"size":[16,16]},{"classId":"ground","position":[0,128],"size":[16,16]},{"classId":"ground","position":[16,80],"size":[16,16]},{"classId":"ground","position":[16,128],"size":[16,16]},{"classId":"ground","position":[32,32],"size":[16,16]},{"classId":"ground","position":[32,80],"size":[16,16]},{"classId":"ground","position":[32,128],"size":[16,16]},{"classId":"ground","position":[48,32],"size":[16,16]},{"classId":"ground","position":[48,80],"size":[16,16]},{"classId":"ground","position":[48,128],"size":[16,16]},{"classId":"ground","position":[64,32],"size":[16,16]},{"classId":"ground","position":[64,80],"size":[16,16]},{"classId":"ground","position":[64,128],"size":[16,16]},{"classId":"ground","position":[80,32],"size":[16,16]},{"classId":"ground","position":[80,80],"size":[16,16]},{"classId":"ground","position":[80,128],"size":[16,16]},{"classId":"ground","position":[96,32],"size":[16,16]},{"classId":"ground","position":[96,80],"size":[16,16]},{"classId":"ground","position":[96,128],"size":[16,16]},{"classId":"ground","position":[112,32],"size":[16,16]},{"classId":"ground","position":[112,80],"size":[16,16]},{"classId":"ground","position":[112,128],"size":[16,16]},{"classId":"ground","position":[128,32],"size":[16,16]},{"classId":"ground","position":[128,80],"size":[16,16]},{"classId":"ground","position":[128,128],"size":[16,16]},{"classId":"ground","position":[144,32],"size":[16,16]},{"classId":"ground","position":[144,80],"size":[16,16]},{"classId":"ground","position":[144,128],"size":[16,16]},{"classId":"ground","position":[160,32],"size":[16,16]},{"classId":"ground","position":[160,80],"size":[16,16]},{"classId":"ground","position":[160,128],"size":[16,16]},{"classId":"ground","position":[176,32],"size":[16,16]},{"classId":"ground","position":[176,80],"size":[16,16]},{"classId":"ground","position":[176,128],"size":[16,16]},{"classId":"ground","position":[192,32],"size":[16,16]},{"classId":"ground","position":[192,80],"size":[16,16]},{"classId":"ground","position":[192,128],"size":[16,16]},{"classId":"ground","position":[208,32],"size":[16,16]},{"classId":"ground","position":[208,80],"size":[16,16]},{"classId":"ground","position":[208,128],"size":[16,16]},{"classId":"ground","position":[224,32],"size":[16,16]},{"classId":"ground","position":[224,128],"size":[16,16]},{"classId":"ground","position":[240,32],"size":[16,16]},{"classId":"ground","position":[240,48],"size":[16,16]},{"classId":"ground","position":[240,64],"size":[16,16]},{"classId":"ground","position":[240,80],"size":[16,16]},{"classId":"ground","position":[240,96],"size":[16,16]},{"classId":"ground","position":[240,112],"size":[16,16]},{"classId":"ground","position":[240,128],"size":[16,16]},
        {"classId":"treeTrunk","position":[0,0],"size":[32,32]},{"classId":"treeTrunk","position":[0,32],"size":[32,32]},{"classId":"treeTrunk","position":[0,64],"size":[32,32]},{"classId":"treeTrunk","position":[0,96],"size":[32,32]},{"classId":"treeTrunk","position":[0,128],"size":[32,32]},{"classId":"treeTrunk","position":[0,160],"size":[32,32]},{"classId":"treeTrunk","position":[0,256],"size":[32,32]},{"classId":"treeTrunk","position":[32,160],"size":[32,32]},{"classId":"treeTrunk","position":[32,256],"size":[32,32]},{"classId":"treeTrunk","position":[64,64],"size":[32,32]},{"classId":"treeTrunk","position":[64,160],"size":[32,32]},{"classId":"treeTrunk","position":[64,256],"size":[32,32]},{"classId":"treeTrunk","position":[96,64],"size":[32,32]},{"classId":"treeTrunk","position":[96,160],"size":[32,32]},{"classId":"treeTrunk","position":[96,256],"size":[32,32]},{"classId":"treeTrunk","position":[128,64],"size":[32,32]},{"classId":"treeTrunk","position":[128,160],"size":[32,32]},{"classId":"treeTrunk","position":[128,256],"size":[32,32]},{"classId":"treeTrunk","position":[160,64],"size":[32,32]},{"classId":"treeTrunk","position":[160,160],"size":[32,32]},{"classId":"treeTrunk","position":[160,256],"size":[32,32]},{"classId":"treeTrunk","position":[192,64],"size":[32,32]},{"classId":"treeTrunk","position":[192,160],"size":[32,32]},{"classId":"treeTrunk","position":[192,256],"size":[32,32]},{"classId":"treeTrunk","position":[224,64],"size":[32,32]},{"classId":"treeTrunk","position":[224,160],"size":[32,32]},{"classId":"treeTrunk","position":[224,256],"size":[32,32]},{"classId":"treeTrunk","position":[256,64],"size":[32,32]},{"classId":"treeTrunk","position":[256,160],"size":[32,32]},{"classId":"treeTrunk","position":[256,256],"size":[32,32]},{"classId":"treeTrunk","position":[288,64],"size":[32,32]},{"classId":"treeTrunk","position":[288,160],"size":[32,32]},{"classId":"treeTrunk","position":[288,256],"size":[32,32]},{"classId":"treeTrunk","position":[320,64],"size":[32,32]},{"classId":"treeTrunk","position":[320,160],"size":[32,32]},{"classId":"treeTrunk","position":[320,256],"size":[32,32]},{"classId":"treeTrunk","position":[352,64],"size":[32,32]},{"classId":"treeTrunk","position":[352,160],"size":[32,32]},{"classId":"treeTrunk","position":[352,256],"size":[32,32]},{"classId":"treeTrunk","position":[384,64],"size":[32,32]},{"classId":"treeTrunk","position":[384,160],"size":[32,32]},{"classId":"treeTrunk","position":[384,256],"size":[32,32]},{"classId":"treeTrunk","position":[416,64],"size":[32,32]},{"classId":"treeTrunk","position":[416,160],"size":[32,32]},{"classId":"treeTrunk","position":[416,256],"size":[32,32]},{"classId":"treeTrunk","position":[448,64],"size":[32,32]},{"classId":"treeTrunk","position":[448,256],"size":[32,32]},{"classId":"treeTrunk","position":[480,64],"size":[32,32]},{"classId":"treeTrunk","position":[480,96],"size":[32,32]},{"classId":"treeTrunk","position":[480,128],"size":[32,32]},{"classId":"treeTrunk","position":[480,160],"size":[32,32]},{"classId":"treeTrunk","position":[480,192],"size":[32,32]},{"classId":"treeTrunk","position":[480,224],"size":[32,32]},{"classId":"treeTrunk","position":[480,256],"size":[32,32]},
        
        {"classId" : "treeTrunk", "position" : [0, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 240], "size" : [16, 16]},
        
        // {"classId" : "sidewaysSetter", "position" : [-224, -126], "size" : [448, 252]},
        {"classId" : "sidewaysSetter", "position" : [0, 0], "size" : [256*2, 144*2]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0]},
        // {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
        {"classId" : "treeBackground", "position" : [0, 0], "size" : [512, 288]}
    ]
};

maps["hpp1"] = {
    // "camera" : {"positionM" : [0, 0], "size" : [448, 252]},
    "camera" : {"positionM" : [256, 144], "size" : [256*2, 144*2]},
    "fixed_entities" : [
        // {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        // {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        // {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        // {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundaryAround", "position" : [0, 0], "size" : [256*2, 144*2]},
        
        {"classId" : "invisibleWall", "position" : [0, -288], "size" : [512, 288]},
        
        // {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        
        {"classId" : "autoDoor", "position" : [-512, 0], "size" : [512, 288], "mapname" : "hpp0", "warpPositionM" : [504, 56]},
        {"classId" : "autoDoor", "position" : [512, 0], "size" : [512, 288], "mapname" : "hpp2", "warpPositionM" : [16, 248]},
        
        {"classId" : "treeTrunk", "position" : [0, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 16], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 32], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 48], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 16], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 32], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 48], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 128], "size" : [16, 16]},
        
        {"classId" : "breakableWood", "position" : [64, 224], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [64, 240], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [128, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [144, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [208, 144], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [208, 160], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [208, 176], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 144], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 160], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 176], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [496, 208], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [496, 224], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [496, 240], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [160, 208], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [160, 224], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [160, 240], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [80, 64], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [96, 64], "size" : [16, 16]},
        
        {"classId" : "sniperEnemy", "position" : [128, 240], "size" : [16, 16]},
        {"classId" : "sniperEnemy", "position" : [240, 176], "size" : [16, 16]},
        {"classId" : "sniperEnemy", "position" : [352, 240], "size" : [16, 16]},
        {"classId" : "sniperEnemy", "position" : [304, 48], "size" : [16, 16]},
        
        // {"classId" : "sidewaysSetter", "position" : [-224, -126], "size" : [448, 252]},
        {"classId" : "sidewaysSetter", "position" : [0, 0], "size" : [512, 288]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0]},
        // {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
        {"classId" : "treeBackground", "position" : [0, 0], "size" : [512, 288]}
    ]
};

maps["hpp2"] = {
    "camera" : {"positionM" : [256, 144], "size" : [256*2, 144*2]},
    "fixed_entities" : [
        {"classId" : "cameraBoundaryAround", "position" : [0, 0], "size" : [256*2, 144*2]},
        {"classId" : "invisibleWall", "position" : [0, -288], "size" : [512, 288]},
        
        // {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        
        {"classId" : "autoDoor", "position" : [-512, 0], "size" : [512, 288], "mapname" : "hpp1", "warpPositionM" : [504, 248]},
        {"classId" : "autoDoor", "position" : [512, 0], "size" : [512, 288], "mapname" : "hpp3", "warpPositionM" : [16, 56]},
        {"classId" : "autoDoor", "position" : [0, 288], "size" : [512, 288], "mapname" : "hpp2", "warpPositionM" : [16, 248]},
        
        {"classId" : "treeTrunk", "position" : [0, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [480, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [496, 288], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 16], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 32], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 48], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 64], "size" : [16, 16]},
        
        {"classId" : "breakableWood", "position" : [16, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [32, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [80, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [96, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [464, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [480, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [432, 80], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [432, 96], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [432, 112], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 80], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 96], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [448, 112], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [464, 80], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [464, 96], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [464, 112], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [480, 80], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [480, 96], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [480, 112], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [416, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [432, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [176, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [192, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [128, 256], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [128, 272], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [144, 256], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [144, 272], "size" : [16, 16]},
        
        {"classId" : "sidewaysSetter", "position" : [0, 0], "size" : [512, 288]},
        {"classId" : "sunlightDecoration", "position" : [0, 0]},
        {"classId" : "treeBackground", "position" : [0, 0], "size" : [512, 288]}
    ]
};

maps["hpp3"] = {
    "camera" : {"positionM" : [256, 144], "size" : [512, 288]},
    "fixed_entities" : [
        {"classId" : "cameraBoundaryAround", "position" : [0, 0], "size" : [256*2, 144*2]},
        {"classId" : "invisibleWall", "position" : [0, -288], "size" : [512, 288]},
        
        {"classId" : "autoDoor", "position" : [-512, 0], "size" : [512, 288], "mapname" : "hpp2", "warpPositionM" : [504, 56]},
        
        {"classId" : "treeTrunk", "position" : [0, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 64], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 80], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 96], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 112], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 128], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [432, 224], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [448, 208], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [464, 192], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [416, 240], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 144], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 160], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 176], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 272], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [0, 0], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [16, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [32, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [48, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [64, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [80, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [96, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [112, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [128, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [144, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [160, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [176, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [192, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [208, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [224, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [240, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [256, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [272, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [288, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [304, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [320, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [336, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [352, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [368, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [384, 256], "size" : [16, 16]},
        {"classId" : "treeTrunk", "position" : [400, 256], "size" : [16, 16]},
        
        {"classId" : "breakableWood", "position" : [16, 64], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [32, 64], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [48, 64], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [16, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [32, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [48, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [80, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [96, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [112, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [144, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [160, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [176, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [208, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [224, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [240, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [272, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [288, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [304, 128], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [16, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [32, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [48, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [80, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [96, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [112, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [144, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [160, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [176, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [208, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [224, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [240, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [272, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [288, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [304, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [336, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [352, 192], "size" : [16, 16]},
        {"classId" : "breakableWood", "position" : [368, 192], "size" : [16, 16]},
        
        {"classId" : "breakableWood", "position" : [16, 80], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [80, 80], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [144, 80], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [272, 80], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [208, 80], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [16, 208], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [80, 208], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [144, 208], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [208, 208], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [272, 208], "size" : [48, 48]},
        {"classId" : "breakableWood", "position" : [336, 208], "size" : [48, 48]},
        
        {"classId" : "sidewaysSetter", "position" : [0, 0], "size" : [512, 288]},
        {"classId" : "sunlightDecoration", "position" : [0, 0]},
        {"classId" : "skyDecoration", "position" : [0, 0], "size" : [512, 288]}
    ]
};

maps["hppa"] = {
    "camera" : {"positionM" : [0, 0], "size" : [448, 252]},
    "fixed_entities" : [
        {"classId" : "cameraBoundary", "position" : [0, -126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [0, +126], "size" : ["Infinity", 0]},
        {"classId" : "cameraBoundary", "position" : [-224, 0], "size" : [0, "Infinity"]},
        {"classId" : "cameraBoundary", "position" : [+224, 0], "size" : [0, "Infinity"]},
        
        {"classId" : "treeTrunk", "position" : [-224, 78], "size" : [448, 48]},
        
        {"classId" : "autoDoor", "position" : [-672, -126], "size" : [448, 252], "mapname" : "hpp0", "warpPositionM" : [208, 70]},
        {"classId" : "autoDoor", "position" : [224, -126], "size" : [448, 252], "mapname" : "hpp1", "warpPositionM" : [-128, -16]},
        
        {"classId" : "groundArea", "position" : [-224, -126], "size" : [448, 252]},
        
        {"classId" : "sunlightDecoration", "position" : [0, 0]},
        {"classId" : "treeBackground", "position" : [-224, -126], "size" : [448, 252]}
    ]
};

var mazeStyle = makeCTile("#7F5F00", "#5F3F00");
var cellStyle = makeCTile("#00BF00", "#007F00");// makeCTile("#00AF00", "#006F00");

mazeStyle = makeCTile("#00FF00", "#00BF00");
mazeStyle = makeCTile("#00FF00", "#00BF00", "#00DF00");

function rv() {return Math.random() * 255;}

function buildMazeLevel(mazeSize, cellSize, wallSize, mode) {
    let map = {
        "camera" : {"positionM" : []},
        "variable_entities" : []
    };
    
    const actualMazeSize = [mazeSize[0] * (cellSize[0] + wallSize[0] * 2), mazeSize[1] * (cellSize[1] + wallSize[1] * 2)];
    const fullCellSize = [cellSize[0] + wallSize[0] * 2, cellSize[1] + wallSize[1] * 2];
    
    const maze = makeMaze(mazeSize[0], mazeSize[1]);
    let lists = {
        camera : null,
        player0 : null,
        entities : [],
        drawables : []
    };
    
    /**/
    
    let entities = lists.entities, drawables = lists.drawables;
    
    var playerX = Math.floor(Math.random() * mazeSize[0]);
    var playerY = Math.floor(Math.random() * mazeSize[1]);
    
    let boundaryWidth = Math.max(actualMazeSize[0], DEF_CAMSIZE[0]);
    let boundaryHeight = Math.max(actualMazeSize[1], DEF_CAMSIZE[1]);
    
    // entities.push(new CameraBoundary([-Infinity, -boundaryHeight], [Infinity, boundaryHeight]));
    // entities.push(new CameraBoundary([-Infinity, boundaryHeight], [Infinity, boundaryHeight]));
    // entities.push(new CameraBoundary([-boundaryWidth, -Infinity], [boundaryWidth, Infinity]));
    // entities.push(new CameraBoundary([boundaryWidth, -Infinity], [boundaryWidth, Infinity]));
    map.variable_entities.push({classId : "cameraBoundaryAround", position : [0, 0], size : [boundaryWidth, boundaryHeight]});
    
    for(var x = 0; x < mazeSize[0]; ++x) {
        for(var y = 0; y < mazeSize[1]; ++y) {
            var cell = maze[y][x];
            var cX = x * fullCellSize[0], cY = y * fullCellSize[1];
            
            if(x == playerX && y == playerY) {
                let camera = (Camera.fromMiddle([cX + wallSize[0] + cellSize[0] / 2, cY + wallSize[1] + cellSize[1] / 2]));
                camera.maxSize = actualMazeSize;
                
                // lists.camera = camera;
                map.camera.positionM = camera.getPositionM();
                map.camera.size = camera.size;
                
                // lists.player0 = (getPlayerClass().fromMiddle([cX + wallSize[0] + cellSize[0] / 2, cY + wallSize[1] + cellSize[1] / 2]));
                getCurrentSave().playerPositionM = [cX + wallSize[0] + cellSize[0] / 2, cY + wallSize[1] + cellSize[1] / 2];
                
                if(mode == "sideways" && !(cell.walls & 8)) {
                    let ground = (Ground.fromMiddle([cX + fullCellSize[0] / 2, cY + fullCellSize[1] - wallSize[1] + 4], [cellSize[0], 8]));
                    
                    // entities.push(ground);
                    map.variable_entities.push({classId : "softPlatform", "positionM" : ground.getPositionM(), "size" : ground.size});
                }
            } else if(Math.floor(Math.random() * 3) == 0) {
                var size = [Math.floor(Math.random() * cellSize[0] / 2 + 8), Math.floor(Math.random() * cellSize[1] / 2 + 8)];
                
                let enemy = (new Enemy(
                    [cX + wallSize[0] + Math.floor(Math.random() * (cellSize[0] - size[0])), cY + wallSize[1] + Math.floor(Math.random() * (cellSize[1] - size[1]))],
                    size
                ));
                
                // entities.push(enemy);
                
                let classId = "enemy";
                
                if(Math.floor(Math.random() * 2)) {
                    classId = "sniperEnemy";
                }
                
                map.variable_entities.push({classId : classId, position : enemy.position, size : enemy.size});
            }
            
            if(cell.walls & 1) {
                /**
                entities.push(new Obstacle(
                    [cX, cY],
                    [wallSize[0], 2 * wallSize[1] + cellSize[1]]
                ));
                /**/
                
                let wall = new MazeWall(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                );
                
                // entities.push(wall);
                map.variable_entities.push({classId : "mazeWall", position : wall.position, size : wall.size});
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
                
                let wall = new MazeWall(
                    [cX + wallSize[0] + cellSize[0], cY - wallSize[0]],
                    [wallSize[0] * 2, 4 * wallSize[1] + cellSize[1]]
                );
                
                // entities.push(wall);
                map.variable_entities.push({classId : "mazeWall", position : wall.position, size : wall.size});
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
                
                let wall = new MazeWall(
                    [cX - wallSize[0], cY - wallSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                );
                
                // entities.push(wall);
                map.variable_entities.push({classId : "mazeWall", position : wall.position, size : wall.size});
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
                
                let wall = new MazeWall(
                    [cX - wallSize[0], cY + wallSize[1] + cellSize[1]],
                    [4 * wallSize[0] + cellSize[0], wallSize[1] * 2]
                );
                
                // entities.push(wall);
                map.variable_entities.push({classId : "mazeWall", position : wall.position, size : wall.size});
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
        
        // entities.push(groundArea);
        map.variable_entities.push({classId : "mazeGroundArea", position : groundArea.position, size : groundArea.size});
        map.variable_entities.push({classId : "sunlightDecoration", position : [0, 0]});
    } else if(mode == "sideways") {
        // entities.push((new AirArea([0, 0], actualMazeSize)));
        // entities.push((new GravityField([0, 0], actualMazeSize)));
        // entities.push((new EC["skyDecoration"]([0, 0], actualMazeSize)));
        // entities.push((new EC["sunlightDecoration"]()));
        
        map.variable_entities.push({classId : "sidewaysSetter", position : [0, 0], size : actualMazeSize});
        map.variable_entities.push({classId : "skyDecoration", position : [0, 0], size : actualMazeSize});
        map.variable_entities.push({classId : "sunlightDecoration", position : [0, 0]});
    } else if(mode == "sideways-water") {
        // entities.push((new WaterArea([0, 0], actualMazeSize)));
        
        // waterStyle = makeGradientCanvas(new ColorTransition([0, 191, 255, 0.25], [31, 127, 159, 0.25]), 1, actualMazeSize[1] / CTILE_WIDTH);
        
        // drawables.push((new RectangleDrawable([0, 0], actualMazeSize)).setZIndex(-Infinity).setStyle(waterStyle));
        // entities.push((new EC["sunlightDecoration"]()));
        
        map.variable_entities.push({classId : "waterArea", position : [0, 0], size : actualMazeSize});
        map.variable_entities.push({classId : "sunlightDecoration", position : [0, 0]});
    }
    
    return map;
    // return lists;
}

function loadMaze(mazeSize = [10, 10], cellSize = [128, 96], wallSize = [32, 32], mode = array_random(["topdown", "sideways", "sideways-water"])) {
    var res = buildMazeLevel(mazeSize, cellSize, wallSize, mode);
    
    // loadFromLists(res);
    loadFromData(res);
}

// loadMaze([10, 10]);
<!-- loadMaze([Math.floor(Math.random() * 7 + 3), Math.floor(Math.random() * 7 + 3)]); -->
<!-- loadTest(); -->

function str_divideCells(string, width = 32, height = 18) {
    let strings = [];
    let firstIndexOfRow = 0;
    let stringIndex = firstIndexOfRow;
    let stringY = 0;
    let beg = true;
    
    for(let i = 0; i < string.length; ++i) {
        // console.log(string[i], i - stringY, stringY, stringIndex);
        
        if(!beg && (i - stringY) % width == 0) {
            strings[stringIndex] += '\n';
            ++stringIndex;
            beg = true;
        } else {
            beg = false;
        }
        
        if(string.charAt(i) === '\n') {
            ++stringY;
            
            if(stringY % height == 0) {
                firstIndexOfRow = strings.length;
            }
            
            stringIndex = firstIndexOfRow;
        } else {
            if(!strings[stringIndex]) {
                strings[stringIndex] = [];
            }
            
            strings[stringIndex] += string.charAt(i);
        }
    }
    
    return strings;
}

function stringToMaps(string, width = 32, height = 18) {
    let strings = str_divideCells(...arguments);
    
    let maps = [];
    let mapIndex = 0;
    let x = 0, y = 0;
    
    for(let i = 0; i < strings.length; ++i) {
        let str = strings[i];
        maps[i] = [];
        
        for(let j = 0; j < str.length; ++j) {
            console.log(str.charAt(j), x, y);
            
            if(str.charAt(j) === '\n') {
                ++y;
                x = -1;
            } else if(str.charAt(j) !== '-') {
                maps[i].push({classId : str.charAt(j), position : [16*x, 16*y], size : [16, 16]});
            }
            
            ++x;
            
            if(y >= height) {
                y = 0;
            }
        }
    }
    
    return maps;
}
