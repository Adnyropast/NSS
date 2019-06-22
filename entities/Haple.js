
const AS_TEST = gather(AS_ZYXEI, AS_CUTTER, AS_SWORD);

var K_FLURRY = [70];

class RunToggle extends Action {
    use() {
        var particle = Particle.fromMiddle([this.user.getXM(), this.user.getYM()], [8, 8]).setZIndex(-97);
        particle.setColorTransition([0, 255, 255, 255], [0, 255, 255, 0], 16);
        particle.setLifespan(16);
        
        addEntity(particle);
        
        return this;
    }
}

class Haple extends PlayableCharacter {
    constructor(position, size) {
        super(position, size);
        this.setStyle(IMG_HAPLE_STD_RIGHT);
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
        
        this.addPossibleAction([ProjectileShot, RunToggle, ZoneEngage]);
        // this.addAbilities(["zyxei", "cutter", "sword"]);
        this.addActset(AS_TEST);
        
        this.route = Vector.addition(this.getPositionM(), [1, 0]);
        
        this.faceSave = "right";
    }
    
    updateStyle() {
        var faceDirection = this.cursor.getXM() - this.getXM(0);
        
        if(!this.hasState("grounded")) {
            if(this.speed[1] < 0) {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(IMG_HAPLE_JUMP_RIGHT);
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(IMG_HAPLE_JUMP_LEFT);
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMG_HAPLE_JUMP_RIGHT);
                    } else {
                        this.setStyle(IMG_HAPLE_JUMP_LEFT);
                    }
                }
            } else {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(IMG_HAPLE_FALL_RIGHT);
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(IMG_HAPLE_FALL_LEFT);
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMG_HAPLE_FALL_RIGHT);
                    } else {
                        this.setStyle(IMG_HAPLE_FALL_LEFT);
                    }
                }
            }
        } else if(this.hasState("moving")) {
            if(this.route[0] > this.getPositionM(0)) {
                this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                this.faceSave = "right";
            } else if(this.route[0] < this.getPositionM(0)) {
                this.setStyle(IMGS_HAPLE_RUN_LEFT);
                this.faceSave = "left";
            } else {
                /**
                if(this.faceSave == "right") {
                    this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                } else {
                    this.setStyle(IMGS_HAPLE_RUN_LEFT);
                }
                /**/
                if(faceDirection > 0) {
                    this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                } else if(faceDirection < 0) {
                    this.setStyle(IMGS_HAPLE_RUN_LEFT);
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                    } else {
                        this.setStyle(IMGS_HAPLE_RUN_LEFT);
                    }
                }
            }
        } else {
            if(faceDirection > 0) {
                this.setStyle(IMG_HAPLE_STD_RIGHT);
            } else if(faceDirection < 0) {
                this.setStyle(IMG_HAPLE_STD_LEFT);
            } else {
                if(this.faceSave == "right") {
                    this.setStyle(IMG_HAPLE_STD_RIGHT);
                } else {
                    this.setStyle(IMG_HAPLE_STD_LEFT);
                }
            }
        }
        
        return this;
    }
}
