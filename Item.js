
class Item {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.effects = [];
        
        this.durability = 1;
        
        this.description = "";
        this.date = new Date();
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
}

class ConsumableItem extends Item {
    constructor(name) {
        super(name);
    }
}

class Apple extends ConsumableItem {
    constructor() {
        super("apple");
        
        this.id = 0;
    }
}

class WeaponItem extends Item {
    constructor(name) {
        super(name);
        
        
        
    }
    
}

var items = {
    "apple"
};
