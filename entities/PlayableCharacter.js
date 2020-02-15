
class PlayableCharacter extends Character {
    constructor(position, size = [16, 16]) {
        super(position, size);
        
        this.setStats({
            "energy": {
                "real": 50,
                "effective": 50,
                "effectiveLock": false
            }
        });
        
        this.resetEnergy();
        
        // this.setEffectFactor("default", 1);
        
        this.cursor = PlayerCursor.fromMiddle(this.getPositionM(), [256, 256]);
        
        this.anim = null;
        this.lastAnim = "";
        
        this.defaultAnimStyle = "cyan";
        
        this.setEventListener("defeat", "vanish", function() {
            const positionM = this.getPositionM();
            const size = this.size;
            const avgsz = rectangle_averageSize(this);
            
            makeBurstEffect(PlayableCharacterVanishParticle, positionM, size, this.speed);
            
            makeShockwave.lifespan = 48;
            makeShockwave.lineWidth = avgsz/4;
            makeShockwave(positionM, avgsz/2)
            .getDrawable()
            .setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 0], 48, powt(1/4)));
            makeShockwave.lifespan = 24;
            makeShockwave.lineWidth = 1;
        });
        
        this.cursorDistance = 1024;
    }
    
    onadd() {
        ALLIES_.add(this);
        this.allies = ALLIES_;
        this.opponents = OPPONENTS_;
        
        return super.onadd();
    }
    
    onremove() {
        ALLIES_.remove(this);
        
        return super.onremove();
    }
    
    setAnimStyle(id, animStyle = this.getAnimStyle(id)) {
        if(this.lastAnim != id) {
            this.setStyle(animStyle);
            this.lastAnim = id;
        }
        
        return this;
    }
    
    getAnimStyle(id) {
        if(this.anim != null && this.anim.hasOwnProperty(id)) {
            if(this.anim[id] instanceof AnimatedImages || this.anim[id] instanceof ColorTransition) {
                return this.anim[id].copy();
            }
            
            return this.anim[id];
        }
        
        return this.defaultAnimStyle;
    }
    
    updateDrawable() {
        super.updateDrawable();
        
        if(this.anim != null) {
            // var faceDirection = this.cursor.getXM() - this.getXM(0);
            
            // let face = this.faceSave;
            
            // if(faceDirection > 0) {face = "right";}
            // else if(faceDirection < 0) {face = "left"}
            
            let action;
            
            if(this.hasState("hurt")) {
                this.onstatehurt();
            } else if((action = this.actions.find(function(a) {return a instanceof BusyAction})) && action.phase > 0) {
                let direction = this.getCursorDirection();
                
                if(Math.abs(direction[0]) >= Math.abs(direction[1])) {
                    if(direction[0] > 0) {
                        this.setAnimStyle("attack-right");
                    } else {
                        this.setAnimStyle("attack-left");
                    }
                } else {
                    if(direction[1] > 0) {
                        this.setAnimStyle("attack-down");
                    } else {
                        this.setAnimStyle("attack-up");
                    }
                }
            } else if(this.hasState("ladder")) {
                this.setAnimStyle("attack-up");
            } else if(this.hasState("water")) {
                if(this.hasState("moving")) {
                    this.onstateswim();
                } else {
                    this.onstatewater();
                }
            } else if(!this.hasState("actuallyGrounded")) {
                let wallState = this.findState("wall");
                
                if(typeof wallState != "undefined") {
                    this.onstatewall(wallState);
                } else if(this.speed[1] < 0) {
                    this.onstatejump();
                } else {
                    this.onstatefall();
                }
            } else if(this.hasState("moving")) {
                this.onstatewalk();
            } else if(this.hasState("crouch")) {
                this.onstatecrouch();
            } else {
                this.onstatestd();
            }
        }
        
        return this;
    }
    
    onstatehurt() {
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("hurt-right");
        } else {
            this.setAnimStyle("hurt-left");
        }
        
        return this;
    }
    
    onstateswim() {
        if(this.route[0] > this.getPositionM(0)) {
            this.faceSave = FRIGHT;
        } else if(this.route[0] < this.getPositionM(0)) {
            this.faceSave = FLEFT;
        }
        
        if(this.faceSave == FRIGHT) {
            this.setAnimStyle("swim-right");
        } else {
            this.setAnimStyle("swim-left");
        }
        
        return this;
    }
    
    onstatewater() {
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("water-right");
        } else {
            this.setAnimStyle("water-left");
        }
        
        return this;
    }
    
    onstatewall(wallState) {
        if(wallState.side < 0) {
            this.setAnimStyle("cling-right");
        } else if(wallState.side > 0) {
            this.setAnimStyle("cling-left");
        }
        
        return this;
    }
    
    onstatejump() {
        /**
        if(this.route[0] > this.getPositionM(0)) {
            this.faceSave = "right";
        } else if(this.route[0] < this.getPositionM(0)) {
            this.faceSave = "left";
        }
        /**/
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("jump-right");
        } else {
            this.setAnimStyle("jump-left");
        }
        
        return this;
    }
    
    onstatefall() {
        /**
        if(this.route[0] > this.getPositionM(0)) {
            this.faceSave = "right";
        } else if(this.route[0] < this.getPositionM(0)) {
            this.faceSave = "left";
        }
        /**/
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("fall-right");
        } else {
            this.setAnimStyle("fall-left");
        }
        
        return this;
    }
    
    onstatewalk() {
        // if(this.route[0] > this.getPositionM(0)) {
        if(this.speed[0] > 0) {
            this.faceSave = FRIGHT;
        // } else if(this.route[0] < this.getPositionM(0)) {
        } else if(this.speed[0] < 0) {
            this.faceSave = FLEFT;
        }
        
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("run-right");
        } else {
            this.setAnimStyle("run-left");
        }
        
        if((this.drawable.style.iindex % 2) == 0 && this.drawable.style.icount == 0) {
            let offsetX = -Math.sign(this.speed[0]) * this.getWidth()/2;
            const position = [this.getXM() + offsetX, this.getY2()];
            
            
            let avgsz = rectangle_averageSize(this);
            
            let avgsz2 = avgsz/2;
            let smokeSize = [avgsz2, avgsz2];
            
            /**/
            
            var particle = SpikeSmokeParticle.fromMiddle(position, [avgsz, avgsz]);
            
            particle.setSpeed(this.speed.rotated(Math.PI).normalize(2));
            
            addEntity(particle);
            
            /**/
            
            angledSparks.initialAngle = this.speed.getAngle() + Math.PI;
            angledSparks(5, SmokeParticle, position, smokeSize, new NumberTransition(-0.625, 0.625))
            .forEach(function(entity, index) {
                let speedNorm = 1.5 - Math.abs(index - 2) * 0.125;
                
                entity.speed.multiply(speedNorm);
            });
            angledSparks.initialAngle = 0;
            
            /**/
        }
        
        return this;
    }
    
    onstatecrouch() {
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("crouch-right");
        } else {
            this.setAnimStyle("crouch-left");
        }
        
        return this;
    }
    
    onstatestd() {
        if(this.faceSave === FRIGHT) {
            this.setAnimStyle("std-right");
        } else {
            this.setAnimStyle("std-left");
        }
        
        return this;
    }
}

class ComposedAction extends Action {
    constructor() {
        super();
        this.setId("composedAction");
        
        this.actions = [];
    }
    
    addAction(action) {this.actions.push(action); return this;}
    
    onadd() {
        for(let i = 0; i < this.actions.length; ++i) {
            this.user.addAction(this.actions[i]);
        }
        
        return super.onadd();
    }
    
    onend() {
        for(let i = 0; i < this.actions.length; ++i) {
            this.user.removeAction(this.actions[i]);
        }
        
        return super.onend();
    }
}

class CursorSmoke extends Entity {
    constructor() {
        super(...arguments);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setLifespan(irandom(12, 24));
        this.addInteraction(new DragRecipient(0.03125));
        
        this.setSizeTransition(new VectorTransition(Array.from(this.size), [0, 0], this.lifespan, powt(2)));
        
        let drawable = new PolygonDrawable(makeRandomPolygon(16, 12, 16));
        drawable.multiplySize(avgsz/polygon_averageSize(drawable));
        drawable.initImaginarySize(avgsz);
        drawable.setZIndex(-1000);
        
        this.setDrawable(drawable);
        
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.shadowBlur = this.lifespan - this.lifeCounter;
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class PlayerCursor extends Cursor {
    constructor() {
        super(...arguments);
        
        let crosshair = new MultiPolygonDrawable();
        crosshair.setZIndex(-1000);
        
        for(let i = 0; i < 8; ++i) {
            let angle = i/8 * 2*Math.PI;
            let vector = Vector.fromAngle(angle).normalize(16);
            
            let drawable = new PolygonDrawable(makePathPolygon([[0, 0], vector.divided(2), vector], 1));
            drawable.setStyle(CT_RAINBOW.copy().setDuration(1024));
            drawable.shadowBlur = 8;
            
            crosshair.push(drawable);
        }
        
        this.drawables[0] = crosshair;
        
        let circle = new PolygonDrawable(makePathPolygon(makeOvalPath(32, 8, 8), 0.5))
        circle.setZIndex(-1000);
        circle.setStyle(CT_RAINBOW.copy().setDuration(1024));
        circle.shadowBlur = 16;
        // this.drawables[1] = circle;
        this.drawables[0].push(circle);
        
        this.controllers.add(function() {
            if(this.speed.getNorm() > 1.5 && this.lifeCounter % 1 === 0) {
                let vector = (new Vector(random(0, 4), 0)).rotate(Math.random() * 2*Math.PI);
                
                let smoke = CursorSmoke.fromMiddle(Vector.addition(this.getPositionM(), vector), [8, 8]);
                
                smoke.setSpeed(vector.normalize(random(0, 0.5)));
                
                let cv = this.drawables[0][0].style.getCurrent();
                let cv_start = colorVector_brighten(cv, 192);
                let cv_end = colorVector_alterAlpha(cv, -0.5);
                smoke.drawable.setStyle(new ColorTransition(cv_start, cv_end, smoke.lifespan));
                
                smoke.alwaysLoad = true;
                
                addEntity(smoke);
            }
        });
        
        this.alwaysLoad = true;
    }
}

class PlayableCharacterVanishParticle extends CharacterVanishParticle {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1], this.lifespan));
        this.drawable.setStrokeStyle(new ColorTransition([0, 0, 223, 1], [0, 223, 223, 1], this.lifespan));
    }
}
