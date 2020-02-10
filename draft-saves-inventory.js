
let INVENTORY = IC["inventory"].fromData({"classId" : "inventory", "id" : "0", "displayWidth" : 16, "date" : new Date(), "items" : [
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

function saveInventoryFile() {
    // let filename = (new Date()).toJSON() + ".json";
    // filename = filename.replace(/:/g, "'");
    let filename = "save-inventory.json";
    // let pathname = "saves/" + filename;
    pathname = filename;
    let success = false;
    
    if(fs) {
        fs.writeFileSync(pathname, JSON.stringify(INVENTORY));
        success = true;
    }
    
    return {
        filename : filename,
        pathname : pathname,
        success : success
    };
}

addEventListener("beforeunload", function() {
    if(getCurrentSave().saveOnQuit) {
        updateCurrentCharacter();
        saveInventoryFile();
        updateSaveState({savePath : getInventoryItemPath(getCurrentSave())});
    }
});

if(fs != undefined) {
    try {
        let data = JSON.parse(fs.readFileSync("save-inventory.json", {encoding : "utf-8"}));
        
        let inventory = IC["inventory"].fromData(data);
        
        INVENTORY = inventory;
    } catch(error) {
        
    }
    
    currentSave = getInventoryFromPath(getSaveState().savePath) || currentSave;
}
