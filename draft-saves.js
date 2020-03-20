
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
    if(fileSystem_isUsable()) {
        try {
            let saveState = fs.readFileSync("saveState.json", {encoding:"utf-8"});
            
            let data = JSON.parse(saveState);
            
            return data;
        } catch(e) {
            
        }
    }
    
    if(localStorage_isUsable()) {
        if(localStorage.hasOwnProperty("saveState")) {
            const saveState = localStorage.getItem("saveState");
            
            const data = JSON.parse(saveState);
            
            return data;
        }
    }
    
    return {};
}

function updateSaveState(properties) {
    const saveState = getSaveState();
    
    for(let i in properties) {
        saveState[i] = properties[i];
    }
    
    if(fileSystem_isUsable()) {
        fs.writeFileSync("saveState.json", JSON.stringify(saveState));
    }
    
    else if(localStorage_isUsable()) {
        localStorage.setItem("saveState", JSON.stringify(saveState));
    }
}

function save_getCurrentInventoryPath(saveIdentifier = getCurrentSave()) {
    return saveIdentifier.inventoryPath;
}
