
function makeNewGame() {
    return {
        "playerPositionM" : [0, 0],
        "lastMap" : "hub",
        "maps" : JSON.parse(JSON.stringify(maps)),
        "inventoryPath" : "/",
        "playerIdPath" : "/4/"
    };
}

function saveMapState() {
    getCurrentSave().maps[getCurrentSave().lastMap] = getCurrentMapState();
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
    return getInventoryFromPath(currentSavePath);
}

function save_cdParentInventory(saveIdentifier = getCurrentSave()) {
    let inventories = saveIdentifier.inventoryPath.split("/");
    
    let previousInventoryId;
    
    while((previousInventoryId = inventories.pop()) === "");
    
    saveIdentifier.inventoryPath = inventories.join("/") + "/";
    
    let currentInventory = save_getCurrentInventory(saveIdentifier);
    
    for(let i = 0; i < currentInventory.items.length; ++i) {
        if(currentInventory.items[i].id === previousInventoryId) {
            itemIndex = i;
        }
    }
    
    return saveIdentifier;
}

function save_getCurrentInventory(saveIdentifier = getCurrentSave()) {
    return getInventoryFromPath(saveIdentifier.inventoryPath);
}

let currentSavePath = "/8/";
let currentSaveIdentifier = null;
