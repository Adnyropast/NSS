
let saves = [];

saves["name1"] = makeNewGame();
// saves["name1"].lastMap = "test-background";

saves["save2"] = makeNewGame();

let currentSave = "name1";

function makeNewGame() {
    return {
        "playerPositionM" : [0, 0],
        "lastMap" : "hub",
        "maps" : JSON.parse(JSON.stringify(maps)),
        "inventoryPath" : ""
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
        entities : entitiesToData(ENTITIES)
    };
    
    return map;
}

function entitiesToData(entities) {
    let dataSet = [];
    
    for(let i = 0; i < entities.length; ++i) {
        let entity = entities[i];
        
        let classId = entity_getClassId(entity);
        
        if(classId !== "nf") {
            let data = entity.getData();
            data.classId = classId;
            
            dataSet.push(data);
        }
    }
    
    return dataSet;
}

function getCurrentSave() {
    return saves[currentSave];
}
