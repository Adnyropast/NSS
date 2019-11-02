
class PlayableCharacter extends Character {
    constructor(position, size = [16, 16]) {
        super(position, size);
        this.resetEnergy(50);
        // this.setEffectFactor("default", 1);
        
        this.cursor.setSizeM([16, 16]);
        this.cursor.setStyle("#00FFFF5F");
        this.cursor.setStyle("rgba(255, 0, 0, 0.5)").setZIndex(-1000);
        
        this.anim = null;
        this.lastAnim = "";
        
        this.defaultAnimStyle = "cyan";
    }
    
    onadd() {
        ALLIES_.add(this);
        this.allies = ALLIES_;
        this.opponents = OPPONENTS_;
        
        return super.onadd();
    }
    
    ondefeat() {
        let spd = rectangle_averageSize(this) / 16;
        
        for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 4) {
            var cos = Math.cos(angle), sin = Math.sin(angle);
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), this.size);
            particle.setSpeed([spd*cos, spd*sin]);
            particle.drag(this.speed);
            particle.setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1], 32));
            particle.setSizeTransition(new ColorTransition(this.size, [0, 0], 32));
            addEntity(particle);
        }
        
        var particle = SmokeParticle.fromMiddle(this.getPositionM(), this.size);
        particle.drag(this.speed);
        particle.setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1], 32));
        particle.setSizeTransition(new ColorTransition(this.size, [0, 0], 32));
        addEntity(particle);
        
        return super.ondefeat();
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
            
            if(this.hasState("hurt")) {
                this.onstatehurt();
            } else if(this.actions.find(function(a) {return a instanceof BusyAction})) {
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
    
    update() {
        // console.log(this.actions);
        // console.log(this.hasState("ladder-maintain"));
        
        return super.update();
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
            
            let avgsz = rectangle_averageSize(this);
            
            /**
            
            for(let i = -1; i < +1; i += 0.125) {
                let particle = SmokeParticle.fromMiddle([this.getXM() + offsetX, this.getY2()]);
                
                particle.setSpeed(this.speed.normalized(Math.random()).rotated(Math.PI + i));
                
                addEntity(particle);
            }
            
            /**/
            
            let avgsz2 = avgsz/2;
            let smokeSize = [avgsz2, avgsz2];
            
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), smokeSize);
            particle.setSpeed(this.speed.normalized(1.5).rotated(Math.PI));
            addEntity(particle);
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), smokeSize);
            particle.setSpeed(this.speed.normalized(1.25).rotated(Math.PI - 0.5));
            addEntity(particle);
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), smokeSize);
            particle.setSpeed(this.speed.normalized(1.25).rotated(Math.PI + 0.5));
            addEntity(particle);
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), smokeSize);
            particle.setSpeed(this.speed.normalized(1.375).rotated(Math.PI - 0.625));
            addEntity(particle);
            var particle = SmokeParticle.fromMiddle(this.getPositionM(), smokeSize);
            particle.setSpeed(this.speed.normalized(1.375).rotated(Math.PI + 0.625));
            addEntity(particle);
            
            /**/
            
            var particle = SpikeSmokeParticle.fromMiddle([this.getXM() + offsetX, this.getY2()], [avgsz, avgsz]);
            
            particle.setSpeed(this.speed.rotated(Math.PI).normalize(2));
            
            addEntity(particle);
            
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

let movementCost = 0.09375;

class MovementLeft extends Action {
    constructor() {
        super();
        this.setId("movementLeft");
    }
    
    use() {
        this.user.addAction(new TmprRoute([-BIG, 0]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementUp extends Action {
    constructor() {
        super();
        this.setId("movementUp");
    }
    
    use() {
        this.user.addAction(new TmprRoute([0, -BIG]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementRight extends Action {
    constructor() {
        super();
        this.setId("movementRight");
    }
    
    use() {
        this.user.addAction(new TmprRoute([+BIG, 0]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementDown extends Action {
    constructor() {
        super();
        this.setId("movementDown");
    }
    
    use() {
        this.user.addAction(new TmprRoute([0, +BIG]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

AC["movementLeft"] = MovementLeft;
AC["movementUp"] = MovementUp;
AC["movementRight"] = MovementRight;
AC["movementDown"] = MovementDown;
