
EC["ten"] = class Ten extends PlayableCharacter {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.addActset(AS_HEART);
        this.anim = IMGCHAR["ten"];
        
        this.resetEnergy(200);
    }
};
