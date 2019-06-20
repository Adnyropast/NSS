
class Adnyropast extends PlayableCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
    }
    
    updateStyle() {
        this.setStyle("rgb(255, " + (this.getEnergyRatio() * 255) + ", 0)");
        
        return this;
    }
}
