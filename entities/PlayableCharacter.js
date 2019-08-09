
const PIDC = ["adnyropast", "haple", "ten"];

class PlayableCharacter extends Character {
    constructor(position, size = [16, 16]) {
        super(position, size);
        this.resetEnergy(50);
        // this.setEffectFactor("default", 1);
        
        this.cursor.setSizeM([256, 256]);
        this.cursor.setStyle("#00FFFF5F");
        
        this.energyBar.setSize([12, 4]).setBorderWidth(1);
        
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
    
    onremove() {
        for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3) {
            var cos = Math.cos(angle), sin = Math.sin(angle);
            var particle = FireSmokeParticle.fromMiddle(this.getPositionM(), this.size);
            particle.setSpeed([4*cos, 4*sin]);
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
            return this.anim[id].copy();
        }
        
        return this.defaultAnimStyle;
    }
    
    updateDrawable() {
        super.updateDrawable();
        
        if(this.anim != null) {
            var faceDirection = this.cursor.getXM() - this.getXM(0);
            
            let face = this.faceSave;
            
            // if(faceDirection > 0) {face = "right";}
            // else if(faceDirection < 0) {face = "left"}
            
            if(this.hasState("hurt")) {
                if(face == "right") {
                    this.setAnimStyle("hurt-right");
                } else {
                    this.setAnimStyle("hurt-left");
                }
            } else if(this.hasState("water")) {
                if(this.hasState("moving")) {
                    if(this.route[0] > this.getPositionM(0)) {
                        face = this.faceSave = "right";
                    } else if(this.route[0] < this.getPositionM(0)) {
                        face = this.faceSave = "left";
                    }
                    
                    if(face == "right") {
                        this.setAnimStyle("swim-right");
                    } else {
                        this.setAnimStyle("swim-left");
                    }
                } else {
                    if(face == "right") {
                        this.setAnimStyle("water-right");
                    } else {
                        this.setAnimStyle("water-left");
                    }
                }
            } else if(!this.hasState("actuallyGrounded")) {
                let wallState = this.findState("wall");
                
                if(typeof wallState != "undefined") {
                    if(wallState.side < 0) {
                        this.setAnimStyle("cling-right");
                    } else if(wallState.side > 0) {
                        this.setAnimStyle("cling-left");
                    }
                } else if(this.speed[1] < 0) {
                    /**
                    if(this.route[0] > this.getPositionM(0)) {
                        this.faceSave = "right";
                    } else if(this.route[0] < this.getPositionM(0)) {
                        this.faceSave = "left";
                    }
                    /**/
                    if(face == "right") {
                        this.setAnimStyle("jump-right");
                    } else {
                        this.setAnimStyle("jump-left");
                    }
                } else {
                    /**
                    if(this.route[0] > this.getPositionM(0)) {
                        this.faceSave = "right";
                    } else if(this.route[0] < this.getPositionM(0)) {
                        this.faceSave = "left";
                    }
                    /**/
                    if(face == "right") {
                        this.setAnimStyle("fall-right");
                    } else {
                        this.setAnimStyle("fall-left");
                    }
                }
            } else if(this.hasState("moving")) {
                // if(this.route[0] > this.getPositionM(0)) {
                if(this.speed[0] > 0) {
                    face = this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(this.speed[0] < 0) {
                    face = this.faceSave = "left";
                }
                
                if(this.faceSave == "right") {
                    this.setAnimStyle("run-right");
                } else {
                    this.setAnimStyle("run-left");
                }
                
                if((this.drawable.style.iindex % 2) == 1 && this.drawable.style.icount == 0) {
                    for(let i = -1; i < +1; i += 0.125) {
                        let particle = SmokeParticle.fromMiddle([this.getXM(), this.getY2()]);
                        
                        particle.setSpeed(this.speed.normalized(Math.random()).rotated(Math.PI + i));
                        
                        addEntity(particle);
                    }
                    
                    /**
                    
                    var particle = SmokeParticle.fromMiddle(this.getPositionM(), [16, 16]);
                    particle.setSpeed(this.speed.normalized(1).rotated(Math.PI));
                    addEntity(particle);
                    var particle = SmokeParticle.fromMiddle(this.getPositionM());
                    particle.setSpeed(this.speed.normalized(0.75).rotated(Math.PI - 0.5));
                    addEntity(particle);
                    var particle = SmokeParticle.fromMiddle(this.getPositionM());
                    particle.setSpeed(this.speed.normalized(0.75).rotated(Math.PI + 0.5));
                    addEntity(particle);
                    var particle = SmokeParticle.fromMiddle(this.getPositionM());
                    particle.setSpeed(this.speed.normalized(1).rotated(Math.PI - 0.75));
                    addEntity(particle);
                    var particle = SmokeParticle.fromMiddle(this.getPositionM());
                    particle.setSpeed(this.speed.normalized(1).rotated(Math.PI + 0.75));
                    addEntity(particle);
                    
                    /**/
                }
            } else if(this.hasState("crouch")) {
                if(face == "right") {
                    this.setAnimStyle("crouch-right");
                } else {
                    this.setAnimStyle("crouch-left");
                }
            } else {
                if(face == "right") {
                    this.setAnimStyle("std-right");
                } else {
                    this.setAnimStyle("std-left");
                }
            }
        }
        
        return this;
    }
    
    update() {
        // console.log(this.actions);
        // console.log(this.hasState("ladder-maintain"));
        
        return super.update();
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

class MovementLeft extends Action {
    constructor() {
        super();
        this.setId("movementLeft");
    }
    
    use() {
        this.user.addAction(new TmprRoute([-BIG, 0]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(0.125));
        
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
        this.user.addAction(new Movement().setUseCost(0.125));
        
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
        this.user.addAction(new Movement().setUseCost(0.125));
        
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
        this.user.addAction(new Movement().setUseCost(0.125));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}
