
const AS_SWORD = set_gather("overheadSlash", "multiswordAttack1", "multiswordAttack2", "multiswordAttackFinish", "upwardArcSlash", "downwardArcSlash", "autoSword");

class SwordAbility extends BusyAction {
    constructor() {
        super();
    }
}

class SlashEffect extends Hitbox {
    constructor(position, size) {
        super(position, size);
        // this.setOffense(FX_SHARP, 1);
        
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        this.setStyle(INVISIBLE);
        
        this.addInteraction(new TypeDamager([{"type" : FX_SHARP, "value" : 1}]));
    }
}

class SwordSlashAction extends SlashAction {
    constructor() {
        super();
        
        this.endlag = 0;
    }
    
    updateTrailDrawableStyle(detProgress) {
        this.trailDrawable.trailStyle = new ColorTransition([127*detProgress, 255, 255, 1], [0, 255*detProgress, 255, 0], 8);
        
        // let ct = new ColorTransition([63, 255, 255, 1], [0, 0, 255, 0], 8, bezierLinear);
        // this.trailDrawable.trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), 8, bezierLinear);
        
        return this;
    }
}

class OverheadSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
        
        this.trailDrawable = new TrailDrawable();
        
        this.setUseCost(3);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        this.baseAngleTransition = new ColorTransition([-Math.PI/2 - 2 * 2*face[0] * 0.1875], [-Math.PI/2 + 8 * 2*face[0] * 0.1875]);
        this.baseDistanceTransition = new ColorTransition([12], [12]);
        
        this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI*3/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
        this.bladeAngleTransition = this.baseAngleTransition;
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
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
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave == "right" ? +1 : -1;
        
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
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave == "right" ? +1 : -1;
        
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
