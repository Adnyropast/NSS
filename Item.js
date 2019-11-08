
class Item {
    constructor(name) {
        this.id = -1;
        // this.name = name;
        // this.effects = [];
        
        // this.durability = 1;
        
        this.description = "";
        this.date = null;
        this.commands = [function() {}];
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
}

class ConsumableItem extends Item {
    constructor(name) {
        super(name);
        
        let consumable = this;
        
        this.commands[0] = function consume() {
            consumable.consumeBy(PLAYER);
            save_getCurrentInventory().items.remove(consumable);
        };
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
        
        this.commands[0] = function cd() {
            getCurrentSave().inventoryPath += inventory.id + "/";
            itemIndex = 0;
        };
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
        
        this.commands[0] = function() {
            updateCurrentCharacter();
            
            let positionM = PLAYER.getPositionM();
            let faceSave = PLAYER.faceSave;
            
            removeEntity(PLAYER);
            
            let characterData = characterIdentifier.characterData;
            let character = EC[characterData.classId].fromData(characterData);
            
            getCurrentSave().playerIdPath = getCurrentSave().inventoryPath + characterIdentifier.id + "/";
            setPlayer(character);
            
            PLAYER.initPositionM(positionM);
            PLAYER.setFace(faceSave);
        };
        
        this.commands[1] = function() {
            
        };
    }
    
    static fromData(data) {
        let characterIdentifier = super.fromData(data);
        
        // characterIdentifier.character = EC[data.character.classId].fromData(data.character);
        characterIdentifier.characterData = data.character;
        
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

IC["saveIdentifier"] = class SaveIdentifier extends Item {
    constructor() {
        super();
        
        this.playerPositionM = [0, 0];
        this.lastMap = "";
        this.maps = null;
        this.inventoryPath = "";
        this.playerIdPath = "";
        
        let saveIdentifier = this;
        
        this.commands[0] = function() {
            currentSavePath = getCurrentSave().inventoryPath + saveIdentifier.id + "/";
            itemIndex = 0;
            loadMap(getCurrentSave().lastMap);
        };
        
        this.commands[1] = function duplicate() {
            
        };
        
        this.commands[2] = function erase() {
            
        };
    }
    
    static fromData(data) {
        let saveIdentifier = super.fromData(data);
        
        saveIdentifier.playerPositionM = data.playerPositionM;
        saveIdentifier.lastMap = data.lastMap;
        saveIdentifier.maps = data.maps;
        saveIdentifier.inventoryPath = data.inventoryPath;
        saveIdentifier.playerIdPath = data.playerIdPath;
        
        return saveIdentifier;
    }
    
    getData() {
        let data = super.getData();
        
        data.playerPositionM = this.playerPositionM;
        data.lastMap = this.lastMap;
        data.maps = this.maps;
        data.inventoryPath = this.inventoryPath;
        data.playerIdPath = this.playerIdPath;
        
        return data;
    }
};
