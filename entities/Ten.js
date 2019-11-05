
EC["ten"] = class Ten extends PlayableCharacter {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.addActset(AS_HEART);
        this.anim = IMGCHAR["ten"];
        
        this.resetEnergy(200);
        
        this.stats["walk-speed"] = 0.375;
        this.stats["walk-speed-tired"] = 0.25;
        this.stats["air-speed"] = 0.375;
        this.stats["air-speed-tired"] = 0.25;
    }
};
