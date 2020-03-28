
const ENETRA_DEF = new ColorTransition([255, 0, 0, 1], [0, 255, 0, 1]);
const ENETRA_DEFMAX = new MultiColorTransition([[255, 0, 0, 1], [0, 255, 0, 1], [0, 255, 255, 1]], 1, function(t) {
    if(t === 1) {
        return 1;
    }
    
    return t / 2;
});

const ENETRA_DEF2 = new MultiColorTransition([[255, 0, 0, 1], [255, 255, 0, 1], [0, 255, 0, 1]]);
const ENETRA_DEFMAX2 = new MultiColorTransition([[255, 0, 0, 1], [255, 255, 0, 1], [0, 255, 0, 1], [0, 255, 255, 1]], 1, function(t) {
    if(t === 1) {
        return 1;
    }
    
    return 3/4 * t;
});

const EBAR_HEIGHTPROP = 12/36;
const EBAR_BORDERPROP = 4/36;

class EnergyBarDrawable extends RectangleDrawable {
    constructor(position, size = [36, 12]) {
        super(position, size);
        this.setZIndex(-200);
        this.setStyle("#00003F");
        this.colorTransition = ENETRA_DEFMAX2;
        this.borderWidth = 4;
        this.energyRatio = 1;
        
        this.energyBar = new RectangleDrawable(position, size);
    }
    
    setCameraMode() {
        super.setCameraMode(...arguments);
        this.energyBar.setCameraMode(...arguments);
        
        return this;
    }
    
    setEnergyTransition(colorTransition) {this.colorTransition = colorTransition; return this;}
    
    setEnergyRatio(energyRatio) {
        this.energyRatio = energyRatio;
        
        if(this.energyRatio < 0) {
            this.energyRatio = 0;
        }
        
        return this;
    }
    
    draw(context) {
        super.draw(context);
        
        this.energyBar.setStyle(this.colorTransition.getStyleAt(this.energyRatio));
        
        this.energyBar.setWidth(this.energyRatio * (this.getWidth() - this.borderWidth));
        this.energyBar.setHeight(this.getHeight() - this.borderWidth);
        this.energyBar.setX(this.getX() + this.borderWidth / 2);
        this.energyBar.setYM(this.getYM());
        
        this.energyBar.draw(context);
        
        return this;
    }
    
    setBorderWidth(borderWidth) {
        this.borderWidth = borderWidth;
        
        return this;
    }
    
    setCamera(camera) {
        super.setCamera(camera);
        this.energyBar.setCamera(camera);
        
        return this;
    }
    
    setProperWidth(width, heightProp = EBAR_HEIGHTPROP, borderProp = EBAR_BORDERPROP) {
        this.setWidth(width).setHeight(width * heightProp).setBorderWidth(width * borderProp);
        
        return this;
    }
}
