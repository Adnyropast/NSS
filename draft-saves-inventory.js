
let INVENTORY = null;

function getInventoryFromPath(path) {
    if(typeof path === "string") {
        let inventory = INVENTORY;
        let idList = path.split("/");
        
        for(let i = 0; i < idList.length; ++i) {
            let items = inventory.items;
            
            if(idList[i] !== "") {
                if(Array.isArray(items)) {
                    let next = items.find(function(item) {return item.id === idList[i];});
                    
                    if(typeof next != "undefined") {
                        inventory = next;
                    } else {
                        return inventory;
                    }
                } else {
                    return inventory;
                }
            }
        }
        
        return inventory;
    }
    
    return null;
}

function getInventoryItemPath(searchItem, inventory = INVENTORY, path = "/") {
    let res = null;
    
    for(let i = 0; i < inventory.items.length; ++i) {
        const item = inventory.items[i];
        
        if(item === searchItem) {
            return path + item.id;
        } else if(item instanceof IC["inventory"]) {
            let r = getInventoryFromPath(searchItem, item, path + item.id + "/");
            
            if(r) {
                return r;
            }
        }
    }
    
    return res;
}

function saveGameState() {
    let fileName, pathName;
    
    if(typeof saveGameState.fileName === "function") {
        fileName = saveGameState.fileName();
    } else {
        fileName = saveGameState.fileName;
    }
    
    // let filename = (new Date()).toJSON() + ".json";
    // filename = filename.replace(/:/g, "'");
    
    if(typeof saveGameState.pathName === "function") {
        pathName = saveGameState.pathName(fileName);
    } else {
        pathName = fileName;
    }
    
    // pathname = "saves/" + filename;
    
    //// Resetting values ////
    
    saveGameState.outputtedType = null;
    saveGameState.resFileName = null;
    saveGameState.resPathName = null;
    saveGameState.success = false;
    
    //// Trying to save the game state somewhere ////
    
    if(fileSystem_isUsable()) {
        fs.writeFileSync(pathName, JSON.stringify(INVENTORY));
        
        saveGameState.outputtedType = "file";
        saveGameState.resFileName = fileName;
        saveGameState.resPathName = pathName;
        saveGameState.success = true;
    }
    
    else if(localStorage_isUsable()) {
        localStorage.setItem("gameState", JSON.stringify(INVENTORY));
        
        saveGameState.outputtedType = "local storage";
        saveGameState.success = true;
    }
}

saveGameState.outputtedType = null;
saveGameState.fileName = "gameState.json";
saveGameState.pathName = saveGameState.fileName;
saveGameState.resFileName = null;
saveGameState.resPathName = null;
saveGameState.success = false;

addEventListener("beforeunload", function() {
    if(getCurrentChapter().saveOnQuit) {
        getCurrentChapter().playerPositionM = PLAYERS[0].entity.getPositionM();
        updateCurrentCharacter();
        saveMapState();
        saveGameState();
        updateSaveState({chapterPath : getInventoryItemPath(getCurrentChapter())});
    }
});

function inventory_findItem(inventory, predicate) {
    for(let i = 0; i < inventory.items.length; ++i) {
        const item = inventory.items[i];
        
        if(predicate(item)) {
            return item;
        }
    }
    
    for(let i = 0; i < inventory.items.length; ++i) {
        const item = inventory.items[i];
        
        if(item instanceof IC["inventory"]) {
            const foundItem = inventory_findItem(item, predicate);
            
            if(foundItem !== null) {
                return foundItem;
            }
        }
    }
    
    return null;
}

function findItem(predicate) {
    return inventory_findItem(INVENTORY, predicate);
}

function findCharacterIdentifier() {
    return findItem(function(item) {
        return item instanceof IC["characterIdentifier"];
    });
}
