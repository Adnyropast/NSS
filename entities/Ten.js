
EC["ten"] = class Ten extends PlayableCharacter {
    constructor() {
        super(...arguments);
        
        this.addActset(AS_HEART);
        this.anim = ANIM_TEN;
        
        this.resetEnergy(200);
    }
};
