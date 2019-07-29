
EC["haple"] = class Haple extends PlayableCharacter {
    constructor(position, size) {
        super(position, size);
        // this.setRegeneration(0.0625);
        this.addAction(new Regeneration(0.0625));
        
        this.cursorDistance = 32;
        
        this.addActset(AS_GOLD, AS_CUTTER, AS_SWORD, "zoneEngage");
        
        this.setBattler(HapleBattler.fromEntity(this));
        
        this.anim = ANIM_HAPLE;
    }
};
