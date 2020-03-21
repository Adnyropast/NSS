
function saveMapState() {
    const chapter = getCurrentChapter();
    
    chapter.maps[chapter.lastMap] = getCurrentMapState();
}

function getCurrentMapState() {
    let map = {
        camera : {positionM : CAMERA.getPositionM(), size : CAMERA.size},
        variable_entities : entitiesToData(WORLDLOOP.entities.filter(function(entity) {return entity.mapVariable;}))
    };
    
    return map;
}

let currentChapter;

function getCurrentChapter() {
    return currentChapter;
}

function chapter_cdParentInventory(chapterIdentifier = getCurrentChapter()) {
    let inventories = chapterIdentifier.inventoryPath.split("/");
    
    while(inventories.pop() === "");
    
    chapterIdentifier.inventoryPath = inventories.join("/") + "/";
    
    return chapterIdentifier;
}

function chapter_getCurrentInventory(chapterIdentifier = getCurrentChapter()) {
    return getInventoryFromPath(chapterIdentifier.inventoryPath);
}

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

function chapter_getCurrentInventoryPath(chapterIdentifier = getCurrentChapter()) {
    return chapterIdentifier.inventoryPath;
}

function chapter_getLastMap(chapter = getCurrentChapter()) {
    return chapter.lastMap;
}
