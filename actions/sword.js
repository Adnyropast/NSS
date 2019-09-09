
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

class BladeTransition {
    constructor() {
        this.userPositions = [];
        
    }
    
    start(userPosition, baseAngle, baseDistance, bladeAngle) {
        
    }
    
    addStep(userPosition, baseRotateAngle, baseDistance, bladeRotateAngle) {
        this.userPositions.push(userPosition);
        
        
        return this;
    }
    
    at(t) {
        let res = {
            "userPosition" : null,
            "baseDirection" : null,
            "bladeAngle" : undefined
        };
    }
}

class OverheadSlash extends SwordAbility {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
        
        this.trailDrawable = new TrailDrawable();
        
        this.setUseCost(3);
    }
    
    use() {
        if(this.phase == 0) {
            this.face = new Vector(Math.sign(this.user.getCursor().getXM() - this.user.getXM()), 0);
            this.face = this.user.getCursorDirection();
            
            if(this.user.getEnergy() <= this.getUseCost()) {
                return this.end();
            }
            
            this.user.hurt(this.getUseCost());
            
            this.center = this.user.getPositionM();
            
            this.setRemovable(false);
            
            if(this.face[0] != 0) {
                this.face[0] = Math.sign(this.face[0]);
                this.face[1] = 0;
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
                
                this.user.setFace(this.face[0]);
            } else if(this.face[1] != 0) {
                this.face[1] = Math.sign(this.face[1]);
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
            } else {
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
            }
            
            this.effect.setLifespan(16);
            this.effect.shareBlacklist(this.user.getBlacklist());
            // this.effect.setForce(this.face.multiply(2));
            this.effect.addInteraction(new DragActor(this.face.times(0.25)));
            
            addEntity(this.effect);
            
            addDrawable(this.trailDrawable);
        }
        
        if(this.phase <= 10) {
            var angle = -Math.PI / 2 + (this.phase - 2) * 2*this.face[0] * 0.1875 + 2*this.face[1] * (this.phase + 2*this.face[1] * Math.PI) * -0.1875;
            
            var s = 32 - Math.abs(this.phase - 5) * 16 / 5;
            
            this.effect.setSize([s, s]);
            
            var farX = this.user.getXM() + Math.cos(angle) * 24;
            var farY = this.user.getYM() + Math.sin(angle) * 24;
            
            this.effect.setPositionM(0, farX);
            this.effect.setPositionM(1, farY);
            /**/
            
            if(true || this.lastPositionM) {
                let positionTransition = new ColorTransition(this.lastPositionM || this.user.getPositionM(), this.user.getPositionM());
                
                let det = 3;
                
                for(let i = 1; i <= det; ++i) {
                    let angle = -Math.PI / 2 + (this.phase-1 + i/det - 2) * 2*this.face[0] * 0.1875 + 2*this.face[1] * (this.phase-1 + i/det + 2*this.face[1] * Math.PI) * -0.1875;
                    
                    let positionM = positionTransition.at(i/det);
                    
                    var closeX = positionM[0] + Math.cos(angle) * 12;
                    var closeY = positionM[1] + Math.sin(angle) * 12;
                    
                    this.trailDrawable.trailStyle = new ColorTransition([127*i/det, 255, 255, 1], [0, 255*i/det, 255, 0], 8, function(t) {if(t == 1) {return 1}; return t / 1.5;});
                    
                    this.trailDrawable.addSized([closeX, closeY], angle, 20, 18.75);
                }
            }
            
            // var angle = -Math.PI / 2 + (this.phase - 2) * this.face[0] * 0.1875 + this.face[1] * (this.phase + this.face[1] * Math.PI) * -0.1875;
            
            // var closeX = this.user.getXM() + Math.cos(angle) * 12;
            // var closeY = this.user.getYM() + Math.sin(angle) * 12;
            
            // this.trailDrawable.addSized([closeX, closeY], angle, 20, 18.75);
            
            
            /**
            
            let vert = Math.PI / 2;
            
            let sign = Math.sign(this.face[0]);
            
            for(let i = this.phase; i <= this.phase; ++i) {
                var baseAngle = -Math.PI / 2 + (i-3) * sign * Math.PI/12;
                var bladeAngle = baseAngle - (12-i)/12 * sign * Math.PI/2
                
                let size = 20 - Math.abs(this.phase - 10);
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(8 + this.phase / 3);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, size, size * 1.125);
            }
            /**
            
            let sign = Math.sign(this.face[0]);
            
            if(this.phase == 0) {
                var baseAngle = -Math.PI/2 - sign * Math.PI / 4;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(0);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
            } else if(this.phase == 1) {
                var baseAngle = -Math.PI/2 - sign * Math.PI/4 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 - sign * Math.PI/4 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
            } else if(this.phase == 2) {
                var baseAngle = -Math.PI/2 + sign * Math.PI/4 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/4 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/4;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2 - sign * Math.PI/2 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2 - sign * Math.PI/2 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
                var baseAngle = -Math.PI/2 + sign * (3/4 * Math.PI/2 - Math.PI/2 * 2/3);
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * (3/4 * Math.PI - Math.PI/2 * 1/3);
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * 3/4 * Math.PI;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
            }
            /**/
            
            this.lastPositionM = this.user.getPositionM();
        } else {
            this.setRemovable(true);
            this.end();
        }
        
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

class UpwardArcSlash extends SlashAction {
    constructor() {
        super();
        this.setId("upwardArcSlash");
        
        this.slashDuration = 6;
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

class MultiswordAttack1 extends SlashAction {
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

class DownwardArcSlash extends SlashAction {
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
            let cursorDirection = this.user.getCursorDirection();
            
            if(cursorDirection[0] != 0) {
                this.user.addAction(new OverheadSlash());
            } else if(cursorDirection[1] < 0) {
                this.user.addAction(new UpwardArcSlash());
            } else if(cursorDirection[1] > 0) {
                this.user.addAction(new DownwardArcSlash());
            } else {
                this.end();
            }
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return AS_SWORD.includes(action.getId()) && !this.sharesId(action);
    }
}

AC["autoSword"] = AutoSword;
