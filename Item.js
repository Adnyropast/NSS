
class Item {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.effects = [];
        
        this.durability = 1;
        
        this.description = "";
        this.date = null;
        this.commands = [];
        this.stats = {};
    }
    
    static fromData(data) {
        let item = new this();
        
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
        
        return {classId : item_getClassId(this), date : date};
    }
    
    toJSON() {return this.getData();}
    
    setDate(date = new Date()) {this.date = date;}
}

class ConsumableItem extends Item {
    constructor(name) {
        super(name);
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
        
        this.items = [];
        this.displayWidth = 16;
        // this.displayHeight = 9;
    }
    
    static fromData(data) {
        let inventory = super.fromData(data);
        
        inventory.displayWidth = data.displayWidth;
        // inventory.displayHeight = data.displayHeight;
        inventory.items = data.items;
        
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
        data.items = this.items;
        
        return data;
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
