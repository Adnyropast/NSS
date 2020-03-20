
// Load previous game state from file if possible.

if(INVENTORY === null && fileSystem_isUsable()) {
    try {
        const data = JSON.parse(fs.readFileSync("gameState.json", {encoding : "utf-8"}));
        
        INVENTORY = IC["inventory"].fromData(data);
        
        currentSave = getInventoryFromPath(getSaveState().savePath);
        
        if(currentSave == undefined) {
            currentSave = findItem(function(item) {
                return item instanceof IC["saveIdentifier"];
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
        
        currentSave = getInventoryFromPath(getSaveState().savePath);
        
        if(currentSave == undefined) {
            currentSave = findItem(function(item) {
                return item instanceof IC["saveIdentifier"];
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
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter(new EC["haple"]()));
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter((new EC["haple"]()).setStats({"regeneration" : 2})));
    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter((new EC["haple"]()).setStats({"action-costFactor" : 0, "energy.effective": 1, "energy.effectiveLock": true}).resetEnergy()));

    INVENTORY.addItem(IC["characterIdentifier"].fromCharacter(new EC["ten"]()));

    /**/

    for(let i = 3; i < 100; ++i) {
        INVENTORY.addItem(IC["characterIdentifier"].fromCharacter(new EC["haple"]));
    }

    /**/

    INVENTORY.addItem(currentSave = IC["saveIdentifier"].fromData(makeNewGame()));
    INVENTORY.addItem(IC["saveIdentifier"].fromData(makeNewGame()));
    INVENTORY.items[0].addItem(IC["saveIdentifier"].fromData(makeNewGame()));

    for(let i = 0; i < 16*9; ++i) {
        INVENTORY.addItem(new IC["apple"]());
    }
}

// Start the game.

switchLoop(loadCheck, WORLD_PACE);
