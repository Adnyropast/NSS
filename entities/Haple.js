
const AS_TEST = gather(AS_ZYXEI, AS_CUTTER, AS_SWORD, AS_FOCUS, "keySteer", "followMe");

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
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
        
        this.addPossibleAction([ProjectileShot, RunToggle, ZoneEngage]);
        // this.addAbilities(["zyxei", "cutter", "sword"]);
        this.addActset(AS_TEST);
        
        this.faceSave = "right";
    }
    
    updateDrawable() {
        var faceDirection = this.cursor.getXM() - this.getXM(0);
        
        if(!this.hasState("grounded")) {
            if(this.speed[1] < 0) {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["jump-right"]));
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["jump-left"]));
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["jump-right"]));
                    } else {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["jump-left"]));
                    }
                }
            } else {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["fall-right"]));
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["fall-left"]));
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["fall-right"]));
                    } else {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["fall-left"]));
                    }
                }
            }
        } else if(this.hasState("moving")) {
            if(this.route[0] > this.getPositionM(0)) {
                this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-right"]));
                this.faceSave = "right";
            } else if(this.route[0] < this.getPositionM(0)) {
                this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-left"]));
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
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-right"]));
                } else if(faceDirection < 0) {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-left"]));
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-right"]));
                    } else {
                        this.setStyle(AnimatedImages.from(ANIM_HAPLE["run-left"]));
                    }
                }
            }
        } else {
            if(faceDirection > 0) {
                this.setStyle(AnimatedImages.from(ANIM_HAPLE["std-right"]));
            } else if(faceDirection < 0) {
                this.setStyle(AnimatedImages.from(ANIM_HAPLE["std-left"]));
            } else {
                if(this.faceSave == "right") {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["std-right"]));
                } else {
                    this.setStyle(AnimatedImages.from(ANIM_HAPLE["std-left"]));
                }
            }
        }
        
        return super.updateDrawable();
    }
}
