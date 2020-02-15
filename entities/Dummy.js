
EC["dummy"] = class Dummy extends Character {
    constructor() {
        super(...arguments);
        
        this.setStats({
            "energy": {
                "real": 1024,
                "effective": 1024,
                "effectiveLock": false
            },
            "regeneration": 0.125
        });
        
        this.resetEnergy();
        
        this.setStyle("#7F3F00");
        this.addInteraction(new DragRecipient(1));
    }
    
    onadd() {
        OPPONENTS_.add(this);
        this.allies = OPPONENTS_;
        this.opponents = ALLIES_;
        
        return super.onadd();
    }
    
    onremove() {
        OPPONENTS_.remove(this);
        
        return super.onremove();
    }
};
