
function makeNewGame() {
    return {
        "playerPositionM" : [0, 0],
        "lastMap" : "hub",
        "maps" : makeNewSaveMaps(),
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
        variable_entities : entitiesToData(WORLDLOOP.entities.filter(function(entity) {return entity.mapVariable;}))
    };
    
    return map;
}

function entitiesToData(entities) {
    let dataSet = [];
    
    for(let i = 0; i < entities.length; ++i) {
        const entity = entities[i];
        const data = entity.getData();
        
        dataSet.push(data);
    }
    
    return dataSet;
}

function getCurrentSave() {
    return currentSave;
}

function save_cdParentInventory(saveIdentifier = getCurrentSave()) {
    let inventories = saveIdentifier.inventoryPath.split("/");
    
    while(inventories.pop() === "");
    
    saveIdentifier.inventoryPath = inventories.join("/") + "/";
    
    return saveIdentifier;
}

function save_getCurrentInventory(saveIdentifier = getCurrentSave()) {
    return getInventoryFromPath(saveIdentifier.inventoryPath);
}

let currentSave;

function getSaveState() {
    if(fs != undefined) {
        try {
            let saveState = fs.readFileSync("save-state.json", {encoding:"utf-8"});
            
            let data = JSON.parse(saveState);
            
            return data;
        } catch(error) {
            // fs.writeFileSync("save-state.json", "{}");
        }
    }
    
    return {};
}

function updateSaveState(properties) {
    if(fs != undefined) {
        let saveState = getSaveState();
        
        for(let i in properties) {
            saveState[i] = properties[i];
        }
        
        fs.writeFileSync("save-state.json", JSON.stringify(saveState));
    }
}

function save_getCurrentInventoryPath(saveIdentifier = getCurrentSave()) {
    return saveIdentifier.inventoryPath;
}
