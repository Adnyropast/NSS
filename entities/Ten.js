
EC["ten"] = class Ten extends PlayableCharacter {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.addActset(AS_HEART);
        this.anim = IMGCHAR["ten"];
        
        this.setStats({
            "walk-speed.real": 0.375,
            "walk-speed.effective": 0.375,
            "walk-speed-tired.effective": 0.25,
            "air-speed.effective": 0.375,
            "air-speed-tired.effective": 0.25,
            "energy.real": 200,
            "energy-effective": 200
        });
        
        this.resetEnergy();
    }
};
