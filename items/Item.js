
class Item {
    constructor(name) {
        this.id = -1;
        // this.name = name;
        // this.effects = [];
        
        // this.durability = 1;
        
        this.description = "";
        this.date = null;
        this.mainCommand = function() {};
        this.commands = {};
        this.stats = {};
    }
    
    static fromData(data) {
        let item = new this();
        
        item.id = data.id;
        item.date = new Date(data.date);
        
        return item;
    }
    
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
    
    getEffect(type) {
        for(var i = 0; i < this.effects.length; ++i) {
            if(this.effects[i].type === type) {
                return this.effects[i].value;
            }
        }
        
        return 0;
    }
    
    consumeBy(entity) {
        return this;
    }
    
    getData() {
        let date = this.date instanceof Date ? this.date.toJSON() : this.date;
        
        return {classId : item_getClassId(this), date : date, id : this.id};
    }
    
    toJSON() {return this.getData();}
    
    setDate(date = new Date()) {this.date = date;}
    
    getImage() {
        return IMGITEM[item_getClassId(this)];
    }
    
    useCommand(commandName) {
        if(arguments.length === 0) {
            this.mainCommand.bind(this)();
        }
        
        else if(typeof this.commands[commandName] === "function") {
            this.commands[commandName].bind(this)();
        }
        
        return this;
    }
    
    static destroySimple() {
        chapter_getCurrentInventory().items.remove(this);
    }
    
    static destroyComplicated() {
        
    }
}

class ConsumableItem extends Item {
    constructor(name) {
        super(name);
        
        let consumable = this;
        
        this.mainCommand = this.commands["consume"] = function consume() {
            consumable.consumeBy(PLAYERS[0].entity);
            chapter_getCurrentInventory().items.remove(consumable);
        };
        this.commands["destroy"] = Item.destroySimple;
        for(let i = 0; i < 0; ++i) {
            this.commands[i] = function() {};
        }
    }
}

class Food extends ConsumableItem {
    constructor() {
        super();
        
        this.stats["consume-energy"] = 0;
        this.energy = 0;
    }
    
    consumeBy(entity) {
        entity.heal(this.energy);
        
        return this;
    }
}

class Apple extends Food {
    constructor() {
        super("apple");
        
        this.energy = 8;
    }
}

class WeaponItem extends Item {
    constructor(name) {
        super(name);
        
        
        
    }
    
}

const IC = {
    "apple" : Apple
};

class PickableItem extends Entity {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new ItemPickable());
        
        this.setStyle("yellow");
        
        // this.items = [new Apple(), new Apple()];
        
        this.addInteraction(new DragRecipient());
        this.addInteraction(new BrakeRecipient());
        this.addInteraction(new ReplaceRecipient());
        
        this.itemClassId = "";
    }
    
    onremove() {
        let itemDrawable = new (this.drawable.constructor)();
        itemDrawable.setLifespan(24);
        itemDrawable.setStyle(this.drawable.getStyle());
        itemDrawable.setSize(this.drawable.size);
        let positionTransition = new VectorTransition(this.getPositionM(), Vector.addition(this.getPositionM(), [0, -8]), itemDrawable.lifespan, powt(1/4));
        
        itemDrawable.controllers.add(function() {
            this.setPositionM(positionTransition.getNext());
        });
        
        addDrawable(itemDrawable);
        
        return super.onremove();
    }
    
    setItemClassId(itemClassId) {
        this.itemClassId = itemClassId;
        this.setItemImage(itemClassId);
        
        return this;
    }
    
    setItemImage(itemClassId) {
        this.drawable.setStyle(IMGITEM[itemClassId]);
        
        return this;
    }
    
    addItem(item) {
        this.items.add(item);
        this.setItemImage(item_getClassId(item));
        
        return this;
    }
}

IC["inventory"] = class InventoryItem extends Item {
    constructor() {
        super();
        
        this.items = new SetArray();
        this.displayWidth = 16;
        // this.displayHeight = 9;
        
        let inventory = this;
        
        this.mainCommand = this.commands["open"] = function open() {
            getCurrentChapter().inventoryPath += inventory.id + "/";
        };
        this.commands["destroy"] = Item.destroyComplicated;
    }
    
    static fromData(data) {
        let inventory = super.fromData(data);
        
        inventory.displayWidth = data.displayWidth;
        // inventory.displayHeight = data.displayHeight;
        
        for(let i = 0; i < data.items.length; ++i) {
            let itemData = data.items[i];
            
            inventory.items.push(IC[itemData.classId].fromData(itemData));
        }
        
        return inventory;
    }
    
    setItems(items) {
        this.items = Array.from(items);
        
        return this;
    }
    
    getData() {
        let data = super.getData();
        
        data.displayWidth = this.displayWidth;
        // data.displayHeight = this.displayHeight;
        
        data.items = [];
        
        for(let i = 0; i < this.items.length; ++i) {
            data.items.push(this.items[i].getData());
        }
        
        return data;
    }
    
    getNextId() {
        let id = 0;
        
        for(let i = 0; i < this.items.length; ++i) {
            let iid = Number(this.items[i].id);
            
            if(iid >= id) {
                id = iid + 1;
            }
        }
        
        return id;
    }
    
    addItems(items) {
        let id = this.getNextId();
        
        for(let i = 0; i < items.length; ++i) {
            let item = items[i];
            
            this.addItem(item, id);
            
            ++id;
        }
        
        return this;
    }
    
    addItem(item, id = this.getNextId()) {
        item.setDate();
        item.id = String(id);
        
        let itemData = item.getData();
        itemData.id = String(id);
        
        this.items.push(item);
        
        return this;
    }
};

function item_getClassId(item) {
    for(let i in IC) {
        if(item.constructor === IC[i]) {
            return i;
        }
    }
    
    console.warn(item.constructor.name, "not found in items list IC.");
    
    return "nf";
}

IC["characterIdentifier"] = class CharacterIdentifier extends Item {
    constructor() {
        super();
        
        // this.character = null;
        this.characterData = null;
        
        let characterIdentifier = this;
        
        this.mainCommand = this.commands["use"] = function() {
            updateCurrentCharacter();
            
            let positionM = PLAYERS[0].entity.getPositionM();
            let faceSave = PLAYERS[0].entity.faceSave;
            
            removeEntity(PLAYERS[0].entity);
            
            let characterData = characterIdentifier.characterData;
            let character = EC[characterData.classId].fromData(characterData);
            
            getCurrentChapter().playerIdPath = getCurrentChapter().inventoryPath + characterIdentifier.id + "/";
            setPlayer(character);
            
            PLAYERS[0].entity.initPositionM(positionM);
            PLAYERS[0].entity.setFace(faceSave);
        };
        
        this.commands["hire"] = function() {
            
        };
        
        this.commands["stats"] = function() {
            
        };
        
        this.commands["destroy"] = Item.destroyComplicated;
    }
    
    static fromData(data) {
        let characterIdentifier = super.fromData(data);
        
        // characterIdentifier.character = EC[data.character.classId].fromData(data.character);
        characterIdentifier.characterData = data.character;
        
        return characterIdentifier;
    }
    
    static fromCharacter(character) {
        const characterIdentifier = new this();
        
        characterIdentifier.characterData = getCharacterData(character);
        
        return characterIdentifier;
    }
    
    getData() {
        let data = super.getData();
        
        data.character = this.characterData;
        
        return data;
    }
    
    getImage() {
        return IMGCHAR[this.characterData.classId]["icon"];
    }
};

IC["chapterIdentifier"] = class ChapterIdentifier extends Item {
    constructor() {
        super();
        
        this.playerPositionM = [0, 0];
        this.lastMap = "";
        this.maps = null;
        this.inventoryPath = "";
        this.playerIdPath = "";
        
        this.saveOnQuit = true;
        this.saveOnWarp = true;
        
        this.chapterName = null;
        
        let chapterIdentifier = this;
        
        this.mainCommand = this.commands["load"] = function() {
            const previousChapter = getCurrentChapter();
            
            previousChapter.playerPositionM = PLAYERS[0].entity.getPositionM();
            updateCurrentCharacter();
            saveMapState();
            
            ESCAPELOOP.pathsItemIndexes = {};
            
            currentChapter = chapterIdentifier;
            loadMap(chapter_getLastMap());
            
            if(previousChapter.saveOnQuit) {
                saveGameState();
                updateSaveState({chapterPath : getInventoryItemPath(getCurrentChapter())});
            }
        };
        
        this.commands["settings"] = function() {
            
        };
        
        this.commands["duplicate"] = function duplicate() {
            
        };
        
        this.commands["destroy"] = Item.destroyComplicated;
    }
    
    static fromData(data) {
        const chapterIdentifier = super.fromData(data);
        
        chapterIdentifier.chapterName = data.chapterName;
        chapterIdentifier.playerPositionM = data.playerPositionM;
        chapterIdentifier.lastMap = data.lastMap;
        chapterIdentifier.maps = data.maps;
        chapterIdentifier.inventoryPath = data.inventoryPath;
        chapterIdentifier.playerIdPath = data.playerIdPath;
        
        return chapterIdentifier;
    }
    
    getData() {
        let data = super.getData();
        
        data.chapterName = this.chapterName;
        data.playerPositionM = this.playerPositionM;
        data.lastMap = this.lastMap;
        data.maps = this.maps;
        data.inventoryPath = this.inventoryPath;
        data.playerIdPath = this.playerIdPath;
        
        return data;
    }
};

IC["controlsIdentifier"] = class ControlsIdentifier extends Item {
    constructor() {
        super();
        
        this.keyOnce = [];
        this.keyRepeat = [];
        this.keyToggle = [];
        this.mouseOnce = [];
        this.mouseRepeat = [];
        this.mouseToggle = [];
        this.buttonOnce = [];
        this.buttonRepeat = [];
        this.buttonToggle = [];
        
        let controlsIdentifier = this;
        
        this.mainCommand = this.commands["use"] = function() {
            updateEventAction(controlsIdentifier);
        };
        
        this.commands["destroy"] = Item.destroyComplicated;
    }
    
    setProperties(data) {
        if(Array.isArray(data.keyOnce)) this.keyOnce = Array.from(data.keyOnce);
        if(Array.isArray(data.keyRepeat)) this.keyRepeat = Array.from(data.keyRepeat);
        if(Array.isArray(data.keyToggle)) this.keyToggle = Array.from(data.keyToggle);
        if(Array.isArray(data.mouseOnce)) this.mouseOnce = Array.from(data.mouseOnce);
        if(Array.isArray(data.mouseRepeat)) this.mouseRepeat = Array.from(data.mouseRepeat);
        if(Array.isArray(data.mouseToggle)) this.mouseToggle = Array.from(data.mouseToggle);
        if(Array.isArray(data.buttonOnce)) this.buttonOnce = Array.from(data.buttonOnce);
        if(Array.isArray(data.buttonRepeat)) this.buttonRepeat = Array.from(data.buttonRepeat);
        if(Array.isArray(data.buttonToggle)) this.buttonToggle = Array.from(data.buttonToggle);
        
        return this;
    }
    
    static fromData(data) {
        let controlsIdentifier = super.fromData(data);
        
        controlsIdentifier.setProperties(data);
        
        return controlsIdentifier;
    }
    
    getData() {
        let data = super.getData();
        
        data.keyOnce = Array.from(this.keyOnce);
        data.keyRepeat = Array.from(this.keyRepeat);
        data.keyToggle = Array.from(this.keyToggle);
        data.mouseOnce = Array.from(this.mouseOnce);
        data.mouseRepeat = Array.from(this.mouseRepeat);
        data.mouseToggle = Array.from(this.mouseToggle);
        data.buttonOnce = Array.from(this.buttonOnce);
        data.buttonRepeat = Array.from(this.buttonRepeat);
        data.buttonToggle = Array.from(this.buttonToggle);
        
        return data;
    }
};
