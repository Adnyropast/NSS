
// Load previous game state from file if possible.

if(INVENTORY === null && fileSystem_isUsable()) {
    try {
        const data = JSON.parse(fs.readFileSync("gameState.json", {encoding : "utf-8"}));
        
        INVENTORY = IC["inventory"].fromData(data);
        
        currentChapter = getInventoryFromPath(getSaveState().chapterPath);
        
        if(currentChapter == undefined) {
            currentChapter = findItem(function(item) {
                return item instanceof IC["chapterIdentifier"];
            });
        }
    } catch(e) {
        console.warn(e);
    }
}

// Load previous game state from local storage if possible.

if(INVENTORY === null && localStorage_isUsable()) {
    try {
        const data = JSON.parse(localStorage.getItem("gameState"));
        
        INVENTORY = IC["inventory"].fromData(data);
        
        currentChapter = getInventoryFromPath(getSaveState().chapterPath);
        
        if(currentChapter == undefined) {
            currentChapter = findItem(function(item) {
                return item instanceof IC["chapterIdentifier"];
            });
        }
    } catch(e) {
        console.warn(e);
    }
}

// Create default game state.

if(INVENTORY === null) {
    INVENTORY = IC["inventory"].fromData({"classId" : "inventory", "id" : "0", "displayWidth" : 16, "date" : new Date(), "items" : [
        {"classId" : "inventory", "id" : "0", "displayWidth" : 16, "items" : [
            {"classId" : "apple", "id" : "0"},
            {"classId" : "apple", "id" : "1"},
            {"classId" : "apple", "id" : "2"},
            {"classId" : "apple", "id" : "3"},
            {"classId" : "apple", "id" : "4"},
            {"classId" : "inventory", "id" : "5", "displayWidth" : 16, "items" : []},
        ]},
        {"classId" : "inventory", "id" : "1", "displayWidth" : 16, "items" : [
            {"classId" : "inventory", "id" : "0", "displayWidth" : 16, "items" : []},
            {"classId" : "inventory", "id" : "1", "displayWidth" : 16, "items" : []},
            {"classId" : "inventory", "id" : "2", "displayWidth" : 16, "items" : []},
            {"classId" : "inventory", "id" : "3", "displayWidth" : 16, "items" : []},
        ]},
        {"classId" : "inventory", "id" : "2", "displayWidth" : 16, "items" : []}
    ]});
    
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter(new EC["adnyropast"]()));
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter((new EC["haple"]()).setStats({"regeneration" : 2})));
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter((new EC["haple"]()).setStats({"action-costFactor" : 0, "energy.effective": 1, "energy.effectiveLock": true}).resetEnergy()));
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter(new EC["ten"]()));
    
    INVENTORY.addItem(currentChapter = IC["chapterIdentifier"].fromData(makeNewChapter("not_so_simple")));
    INVENTORY.addItem(IC["chapterIdentifier"].fromData(makeNewChapter("the_endless_maze")));
    INVENTORY.items[0].addItem(IC["chapterIdentifier"].fromData(makeNewChapter("not_so_simple")));
    
    for(let i = 0; i < 16*9 + 1; ++i) {
        INVENTORY.items[2].addItem(new IC["apple"]());
    }
}

// Start the game.

switchLoop(loadCheck, WORLD_PACE);
