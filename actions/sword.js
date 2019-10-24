
const AS_SWORD = set_gather("overheadSlash", "multiswordAttack1", "multiswordAttack2", "multiswordAttackFinish", "upwardArcSlash", "downwardArcSlash", "autoSword");

class SwordAbility extends BusyAction {
    constructor() {
        super();
    }
}

class SlashEffect extends Hitbox {
    constructor(position, size) {
        super(position, size);
        this.setTypeOffense(FX_SHARP, 1);
        
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        this.setStyle(INVISIBLE);
        
        this.addInteraction(new TypeDamager());
    }
}

class SwordSlashAction extends SlashAction {
    constructor() {
        super();
        
        this.startlag = 0;
        this.endlag = 0;
        
        this.swordDrawable = MultiPolygonDrawable.from(makeSwordMultiPolygon());
        
        this.swordDrawable.setLifespan(32);
        
        let drawables = this.swordDrawable;
        
        drawables[0].setStyle("#00FFFF");
        drawables[1].setStyle("#00EFEF");
        drawables[2].setStyle("#003F7F");
        drawables[3].setStyle("#005F9F");
        
        drawables[0].setStyle("#FFFFFF");
        drawables[1].setStyle("#EFEFEF");
        drawables[2].setStyle("#7F7F7F");
        drawables[3].setStyle("#F7F7F7");
        
        this.swordDrawable.multiplySize(1/1.5);
        this.swordDrawable.initImaginarySize(rectangle_averageSize(this.hitbox));
        
        this.swordDrawable.zIndex = -10;
        
        // let otherTrail = new TrailDrawable();
        // otherTrail.edgeWidth = 2;
        // this.trailDrawable.otherTrails.add(otherTrail);
        
        for(let i = 0; i < 4; ++i) {
            let otherTrail = new TrailDrawable();
            otherTrail.edgeWidth = 4-i*4; irandom(-8, +2);
            this.trailDrawable.otherTrails.add(otherTrail);
        }
    }
    
    updateTrailDrawableStyle(detProgress) {
        // this.trailDrawable.trailStyle = new ColorTransition([127*detProgress, 255, 255, 1], [0, 255*detProgress, 255, 0], 8);
        // this.trailDrawable.trailStyle = (new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.25], 7, bezierLinear)).setStep(1-detProgress);
        // this.trailDrawable.trailStyle = (new ColorTransition([0, 0, 127, 1], [0, 0, 255, 0], 7, bezierLinear)).setStep(1-detProgress);
        // this.trailDrawable.trailStyle = (new ColorTransition([255, 63, 63, 1], [255, 0, 0, 0], 7, bezierLinear)).setStep(1-detProgress);
        this.trailDrawable.trailStyle = (new MultiColorTransition([[127, 255, 255, 1], [0, 255, 255, 1], [0, 223, 255, 0.875], [0, 191, 255, 0.75], [0, 63, 255, 0.5], [0, 0, 255, 0]], 7, bezierLinear)).setStep(1-detProgress);
        
        for(let i = 0; i < this.trailDrawable.otherTrails.length; ++i) {
            let lifespan = 11;
            
            this.trailDrawable.otherTrails[i].trailStyle = (new ColorTransition([255, 255, 255, irandom(75, 100)/100], [255, 255, 0, 0], lifespan, bezierLinear)).setStep(1-detProgress);
            // this.trailDrawable.otherTrails[i].trailStyle = (new ColorTransition([191, 191, 255, irandom(75, 100)/100], [31, 0, 255, 0], lifespan, bezierLinear)).setStep(1-detProgress);
            // this.trailDrawable.otherTrails[i].trailStyle = (new ColorTransition([255, 95, 95, irandom(75, 100)/100], [255, 0, 0, 0], lifespan, bezierLinear)).setStep(1-detProgress);
            // this.trailDrawable.otherTrails[i].trailStyle = (new MultiColorTransition([[255, 255, 255, 1], [127, 255, 255, 1], [0, 255, 255, 0.75], [0, 127, 255, 0.5], [0, 0, 255, 0]], lifespan, bezierLinear)).setStep(1-detProgress);
        }
        
        return this;
    }
    /**/
    onadd() {
        addDrawable(this.swordDrawable);
        
        return super.onadd();
    }
    
    onend() {
        removeDrawable(this.swordDrawable);
        
        return super.onend();
    }
    
    use() {
        super.use();
        
        this.swordDrawable.setPositionM(this.hitbox.getPositionM());
        
        let progression = (Math.min(this.phase, this.startlag + this.slashDuration) - this.startlag) / (this.slashDuration);
        
        let angle = this.bladeAngleTransition.at(progression)[0];
        
        this.swordDrawable.setImaginaryAngle(angle);
        this.swordDrawable.setImaginarySize(rectangle_averageSize(this.hitbox));
        
        return this;
    }
    /**/
}

class OverheadSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
        
        this.setUseCost(3);
        this.setUseCost(1.5);
        this.det = 3;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] == 0) {
            face[0] = this.user.faceSave;
        }
        
        this.baseAngleTransition = new ColorTransition([-Math.PI/2 - 2 * 2*face[0] * 0.1875], [-Math.PI/2 + 8 * 2*face[0] * 0.1875]);
        
        // this.baseDistanceTransition = new ColorTransition([12], [12]);
        this.baseDistanceTransition = new ColorTransition([0], [12], 1, function timing(t) {return Math.pow(t, 1/1.0625);});
        
        // this.bladeAngleTransition = this.baseAngleTransition;
        // this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI*3/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
        this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI*2.5/4], [-Math.PI/2 + face[0] * 5/4 * Math.PI]);
        
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        this.bladeWidthTransition = new ColorTransition([0], [20], 1, ovalTransition);
        
        this.edgeWidthTransition = new VectorTransition([2], [2]);
        
        this.hitbox.addInteraction(new DragActor(face.times(0.25)));
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 7 && AS_SWORD.includes(action.getId())) {
            this.nextAction = new MultiswordAttack1();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        this.preventsAddition = function() {return false};
        
        if(this.nextAction instanceof Action) {
            this.user.addAction(this.nextAction);
        }
        
        return super.onend();
    }
}

class UpwardArcSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("upwardArcSlash");
        
        this.slashDuration = 9;
        // this.startlag = 6;
        
        this.hitbox.addInteraction(new DragActor([0, -4]));
        
        this.setUseCost(3);
        this.setUseCost(2);
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave;
        
        this.baseAngleTransition = new ColorTransition([-Math.PI/2 - Math.PI/2], [-Math.PI/2 + Math.PI/2]);
        this.baseDistanceTransition = new ColorTransition([12], [12]);
        this.bladeAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 + 2*Math.PI - 3*Math.PI/4]);
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
        return this;
    }
}

class MultiswordAttack1 extends SwordSlashAction {
    constructor() {
        super();
        this.setId("multiswordAttack1");
        
        this.slashDuration = 6;
        this.det = 6;
        this.endlag = 1;
        
        this.nextAction = MultiswordAttackFinish;
        this.followup = MultiswordAttack2;
        
        this.setUseCost(3);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI/4], [-Math.PI/2 + face[0] * (Math.PI - Math.PI/4)]);
            this.baseDistanceTransition = new ColorTransition([12], [12], 1, function(t) {
                return 1 - Math.pow((t - 0.5)/0.5, 2);
            });
            
            this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI/4], [-Math.PI/2 + face[0] * Math.PI]);
            this.bladeWidthTransition = new ColorTransition([8], [20], 1, function(t) {
                return 1 - Math.pow(Math.abs(t - 0.5)/0.5, 2);
            });
            
            this.hitbox.addInteraction(new DragActor([face[0] * 0.125, 0]));
        } else if(face[1] != 0) {
            this.preventsAddition = function() {return false};
            if(face[1] < 0) {
                this.user.addAction(new UpwardArcSlash());
            } else {
                this.user.addAction(new DownwardArcSlash());
            }
            this.end();
            return false;
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 0 && AS_SWORD.includes(action.getId()) && typeof this.followup == "function") {
            this.nextAction = new this.followup();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        this.preventsAddition = function() {return false};
        
        if(this.nextAction instanceof Action) {
            this.user.addAction(this.nextAction);
        } else if(typeof this.nextAction == "function") {
            this.user.addAction(new this.nextAction());
        }
        
        return super.onend();
    }
}

class MultiswordAttack2 extends MultiswordAttack1 {
    constructor() {
        super();
        this.setId("multiswordAttack2");
        
        this.followup = MultiswordAttack1;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 + face[0] * Math.PI/4], [-Math.PI/2 + face[0] * (Math.PI + Math.PI/4)]);
            this.baseDistanceTransition = new ColorTransition([12], [12], 1, function(t) {
                return 1 - Math.pow((t - 0.5)/0.5, 2);
            });
            
            this.bladeAngleTransition = this.baseAngleTransition;
            this.bladeWidthTransition = new ColorTransition([8], [20], 1, function(t) {
                return 1 - Math.pow(Math.abs(t - 0.5)/0.5, 2);
            });
            
            this.hitbox.addInteraction(new DragActor([face[0] * 0.125, 0]));
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
}

class MultiswordAttackFinish extends MultiswordAttack2 {
    constructor() {
        super();
        this.setId("multiswordAttackFinish");
        
        this.slashDuration = 8;
        this.endlag = 12;
        
        this.nextAction = null;
        this.followup = null;
        this.setUseCost(0);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([Math.PI/2], [Math.PI/2 - face[0] * Math.PI]);
            this.baseDistanceTransition = new ColorTransition([12], [12]);
            
            this.bladeAngleTransition = new ColorTransition([Math.PI/2 + face[0] * Math.PI/4], [Math.PI/2 - face[0] * 5/4*Math.PI]);
            this.bladeWidthTransition = new ColorTransition([20], [20]);
            
            this.hitbox.addInteraction(new DragActor(face.times(2)));
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
}

class DownwardArcSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("downwardArcSlash");
        
        this.hitbox.addInteraction(new DragActor([0, +4]));
        
        this.setUseCost(3);
        this.setUseCost(2);
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave;
        
        this.baseAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 - 3/4 * Math.PI]);
        this.baseDistanceTransition = new ColorTransition([12], [12]);
        this.bladeAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 - 3/4*Math.PI]);
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
        return this;
    }
}

class AutoSword extends SwordAbility {
    constructor() {
        super();
        this.setId("autoSword");
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.collidesWithPoint(this.user.cursor.getPositionM())) {
                
            } else {
                let cursorDirection = this.user.getCursorDirection();
                
                if(Math.abs(cursorDirection[0]) >= Math.abs(cursorDirection[1])) {
                    this.user.addAction(new OverheadSlash());
                } else if(cursorDirection[1] < 0) {
                    this.user.addAction(new UpwardArcSlash());
                } else if(cursorDirection[1] > 0) {
                    this.user.addAction(new DownwardArcSlash());
                } else {
                    this.end();
                }
            }
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return AS_SWORD.includes(action.getId()) && !this.sharesId(action);
    }
}

AC["autoSword"] = AutoSword;
