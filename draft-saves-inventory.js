
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

INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData(new EC["adnyropast"]())}));
INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData(new EC["haple"]())}));
INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData((new EC["haple"]()).setStats({"regeneration" : 2}))}));
INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData((new EC["haple"]()).resetEnergy(1).setStats({"action-costFactor" : 0}))}));

INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData(new EC["ten"]())}));

/**

for(let i = 3; i < 100; ++i) {
    INVENTORY.addItem(IC["characterIdentifier"].fromData({"character" : getCharacterData(new EC["haple"])}));
}

/**/

INVENTORY.addItem(IC["saveIdentifier"].fromData(makeNewGame()));
INVENTORY.addItem(IC["saveIdentifier"].fromData(makeNewGame()));
INVENTORY.items[0].addItem(IC["saveIdentifier"].fromData(makeNewGame()));

for(let i = 0; i < 16*9; ++i) {
    INVENTORY.addItem(new IC["apple"]());
}

function getInventoryFromPath(path) {
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

function saveInventoryFile() {
    // let filename = (new Date()).toJSON() + ".json";
    // filename = filename.replace(/:/g, "'");
    let filename = "save-inventory.json";
    // let pathname = "saves/" + filename;
    pathname = filename;
    let success = false;
    
    if(fs) {
        fs.writeFileSync(pathname, JSON.stringify(INVENTORY.getData()));
        success = true;
    }
    
    return {
        filename : filename,
        pathname : pathname,
        success : success
    };
}

let saveOnQuit = false;
let saveOnWarp = true;

addEventListener("beforeunload", function() {
    if(saveOnQuit) {
        updateCurrentCharacter();
        saveInventoryFile();
        updateSaveState({savePath : currentSavePath});
    }
});

if(fs != undefined) {
    try {
        let data = JSON.parse(fs.readFileSync("save-inventory.json", {encoding : "utf-8"}));
        
        let inventory = IC["inventory"].fromData(data);
        
        INVENTORY = inventory;
    } catch(error) {
        
    }
}
