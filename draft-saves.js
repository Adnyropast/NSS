
let saves = [];

saves["name1"] = makeNewGame();
saves["save2"] = makeNewGame();

let currentSave = "name1";

function makeNewGame() {
    return {
        "playerPositionM" : [0, 0],
        "lastMap" : "hub",
        "maps" : JSON.parse(JSON.stringify(maps))
    };
}

function saveLastMap(mapname) {
    saves[currentSave].lastMap = mapname;
}

function saveMapState() {
    saves[currentSave].maps[saves[currentSave].lastMap] = getCurrentMapState();
}

function getCurrentMapState() {
    let map = {
        camera : {positionM : CAMERA.getPositionM(), size : CAMERA.size},
        entities : []
    };
    
    for(let i = 0; i < ENTITIES.length; ++i) {
        let entity = ENTITIES[i];
        
        let classId = entity_getClassId(entity);
        
        if(classId !== "nf") {
            let data = entity.getData();
            data.classId = classId;
            
            map.entities.push(data);
        }
    }
    
    return map;
}
