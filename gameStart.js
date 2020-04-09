
// Load previous game state from file if possible.

if(INVENTORY === null && fileSystem_isUsable()) {
    try {
        const data = JSON.parse(fs.readFileSync("gameState.json", {encoding : "utf-8"}));
        
        INVENTORY = Inventory.fromData(data);
        
        currentChapter = getInventoryFromPath(getSaveState().chapterPath);
        
        if(currentChapter == undefined) {
            currentChapter = findItem(function(item) {
                return item instanceof ChapterIdentifier;
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
        
        INVENTORY = Inventory.fromData(data);
        
        currentChapter = getInventoryFromPath(getSaveState().chapterPath);
        
        if(currentChapter == undefined) {
            currentChapter = findItem(function(item) {
                return item instanceof ChapterIdentifier;
            });
        }
    } catch(e) {
        console.warn(e);
    }
}

// Create default game state.

if(INVENTORY === null) {
    INVENTORY = Inventory.fromData({"className" : "Inventory", "id" : "0", "displayWidth" : 16, "date" : new Date(), "items" : [
        {"className" : "Inventory", "id" : "0", "displayWidth" : 16, "items" : [
            {"className" : "Apple", "id" : "0"},
            {"className" : "Apple", "id" : "1"},
            {"className" : "Apple", "id" : "2"},
            {"className" : "Apple", "id" : "3"},
            {"className" : "Apple", "id" : "4"},
            {"className" : "Inventory", "id" : "5", "displayWidth" : 16, "items" : []},
        ]},
        {"className" : "Inventory", "id" : "1", "displayWidth" : 16, "items" : [
            {"className" : "Inventory", "id" : "0", "displayWidth" : 16, "items" : []},
            {"className" : "Inventory", "id" : "1", "displayWidth" : 16, "items" : []},
            {"className" : "Inventory", "id" : "2", "displayWidth" : 16, "items" : []},
            {"className" : "Inventory", "id" : "3", "displayWidth" : 16, "items" : []},
        ]},
        {"className" : "Inventory", "id" : "2", "displayWidth" : 16, "items" : []}
    ]});
    
    INVENTORY.addItem(CharacterIdentifier.fromCharacter(new Adnyropast()));
    INVENTORY.addItem(CharacterIdentifier.fromCharacter((new Haple()).setStats({"regeneration" : 2})));
    INVENTORY.addItem(CharacterIdentifier.fromCharacter((new Haple()).setStats({"action-costFactor" : 0, "energy.effective": 1, "energy.effectiveLock": true}).resetEnergy()));
    INVENTORY.addItem(CharacterIdentifier.fromCharacter(new Ten()));
    
    INVENTORY.addItem(currentChapter = ChapterIdentifier.fromData(makeNewChapter("not_so_simple")));
    INVENTORY.addItem(ChapterIdentifier.fromData(makeNewChapter("the_endless_maze")));
    INVENTORY.items[0].addItem(ChapterIdentifier.fromData(makeNewChapter("not_so_simple")));
    
    for(let i = 0; i < 16*9 + 1; ++i) {
        INVENTORY.items[2].addItem(new Apple());
    }
}

// Start the game.

switchLoop(loadCheck, WORLD_PACE);
