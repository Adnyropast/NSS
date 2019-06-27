
class Item {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.effects = [];
        
        this.count = 1;
        
        this.description = "";
        this.date = new Date();
    }
    
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
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
