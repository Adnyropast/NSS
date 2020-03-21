
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

function makeNewMapState(map) {
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

function makeNewChapterMaps(maps) {
    const mapsStates = {};
    
    for(let mapName in maps) {
        mapsStates[mapName] = makeNewMapState(maps[mapName]);
    }
    
    return mapsStates;
}

function map_exists(mapName) {
    return getCurrentChapter().maps.hasOwnProperty(mapName);
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
    
    lists.player0 = makeEntityFromData(getCurrentCharacterData());
    lists.player0.initPositionM(getCurrentChapter().playerPositionM);
    
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

function loadMap(mapName) {
    const chapter = getCurrentChapter();
    
    const staticMap = chapters[chapter.chapterName].maps[mapName];
    const chapterMap = chapter.maps[mapName];
    
    const fixedEntities = staticMap !== undefined ? staticMap.fixed_entities : {};
    
    chapter.lastMap = mapName;
    
    loadFromData({
        camera: chapterMap.camera,
        fixed_entities: fixedEntities,
        variable_entities: chapterMap.variable_entities
    });
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

const chapters = {};

function makeNewChapter(chapterName) {
    if(chapters.hasOwnProperty(chapterName)) {
        const chapter = chapters[chapterName];
        
        const characterIdentifier = IC["characterIdentifier"].fromCharacter(new EC[chapter.protagonistClassId]());
        INVENTORY.addItem(characterIdentifier);
        
        const chapterData = {
            "playerPositionM": chapter.playerPositionM,
            "lastMap": chapter.startMap,
            "maps": makeNewChapterMaps(chapter.maps),
            "chapterName": chapterName,
            "inventoryPath": "/",
            "playerIdPath": getInventoryItemPath(characterIdentifier)
        };
        
        return chapterData;
    }
    
    return null;
}
