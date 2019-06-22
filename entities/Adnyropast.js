
class Adnyropast extends PlayableCharacter {
    constructor(position, size) {
        super(position, size);
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
    }
    
    updateStyle() {
        this.setStyle("rgb(255, " + (this.getEnergyRatio() * 255) + ", 0)");
        
        return this;
    }
}
