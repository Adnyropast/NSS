
/**
 * Interactions define behaviors upon a collision between two entities.
 * They work in pairs : interactors and interrecipients (respectively objects associated to actors and recipients of an interaction).
 * The interactors and interrecipients of the same interaction share the same id.
 * Interactors decide what happens during a collision (the recipient gets dragged, braked, ...), but interrecipients can have some power over the interaction (how much relative to the original values the recipient gets dragged, braked, ...).
 */

/**

class Interaction {
    constructor() {
        
    }
}

class CollisionInteraction {
    
}

/**/

let interactionPriorities = {
    "ground" : -1,
    "replace" : 1000
};

/**
 *
 */

class Interactor {
    constructor() {
        this.id = -1;
        this.actor = null;
    }
    
    matchId(id) {return this.id == id;}
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
    
    getActor() {return this.actor;}
    setActor(actor) {this.actor = actor; return this;}
    
    interact(interrecipient) {
        return this;
    }
    
    interactDimension(interrecipient, dimension) {
        return this;
    }
    
    collides(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        for(var i = 0; i < actor.collidedWith.length; ++i) {
            if(actor.collidedWith[i] == recipient) {
                return true;
            }
        }
        
        var collision = this.getActor() != interrecipient.getRecipient() && this.getActor().collides(interrecipient.getRecipient()) && !this.getActor().findBlacklist(interrecipient.getRecipient());
        
        if(collision) {
            actor.collidedWith.add(recipient);
            recipient.collidedWith.add(actor);
        }
        
        return collision;
    }
}

class Interrecipient {
    constructor() {
        this.id = -1;
        this.recipient = null;
    }
    
    matchId(id) {return this.id == id;}
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
    
    getRecipient() {return this.recipient;}
    setRecipient(recipient) {this.recipient = recipient; return this;}
    
    oninteraction(interactor) {
        return this;
    }
    
    negotiate(interactor) {
        return {};
    }
    
    beforeInteraction(interactor) {return this;}
}

/**
 *
 */

class ReplaceActor extends Interactor {
    constructor(replaceId = -1, bounce = 0) {
        super();
        this.setId("replace");
        
        this.replaceId = replaceId;
        this.bounce = bounce;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        /**
        
        if(recipient instanceof Character && recipient.speed.getNorm() > 4) {
            let averagesize = (recipient.getWidth() + recipient.getHeight()) / 2;
            let c = Math.min(16, Math.floor(recipient.speed.getNorm()));
            
            // for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3) {
            for(let i = 0; i < c; ++i) {
                let angle = -Math.PI/8 + i * 2*Math.PI/c;
                
                var cos = Math.cos(angle), sin = Math.sin(angle);
                
                let directions = getDD(recipient.locate(actor));
                let vect = Vector.filled(recipient.getDimension(), 0);
                
                for(let i = 0; i < directions.length; ++i) {
                    vect[directions[i].dimension] = directions[i].sign * averagesize/2;
                }
                
                let size = [averagesize, averagesize];
                
                var particle = SmokeParticle.fromMiddle(vect.plus(recipient.getPositionM()), size);
                particle.setSpeed((new Vector(2*cos*Math.random(), 2*sin*Math.random())).normalize(Math.random()));
                addEntity(particle);
            }
        }
        
        /**/
        
        actor.replace(recipient, this.replaceId, this.bounce);
        
        for(var dim = 0; dim < Math.min(actor.getDimension(), recipient.getDimension()); ++dim) {
            recipient.position[dim] += actor.speed[dim];
        }
        
        return this;
    }
}

class ReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("replace");
    }
    
    beforeInteraction(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        let groundSave = recipient.findState("groundSave");
        
        if(typeof groundSave == "undefined") {
            if(recipient.lifeCounter > 2) {
                recipient.addState("land");
                recipient.onland(actor);
            }
            recipient.addStateObject({name:"groundSave", countdown:2});
        } else {
            groundSave.countdown = 2;
        }
        
        return this;
    }
}

/**
 *
 */

class BrakeActor extends Interactor {
    constructor(brakeValue = 1) {
        super();
        this.setId("brake");
        
        this.brakeValue = brakeValue;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        var minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        for(var dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] /= interrecipient.negotiateBrake(this.brakeValue);
            
            if(isAlmostZero(recipient.speed[dim])) {
                recipient.speed[dim] = 0;
            }
        }
        
        return this;
    }
}

class BrakeRecipient extends Interrecipient {
    constructor(brakeExponent = 1) {
        super();
        this.setId("brake");
        
        this.brakeExponent = brakeExponent;
    }
    
    negotiateBrake(brakeValue) {
        return Math.pow(brakeValue, this.brakeExponent)
    }
}

/**
 *
 */

class DragActor extends Interactor {
    constructor(force = new Vector(0, 0)) {
        super();
        this.setId("drag");
        
        this.force = force;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        var minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        var negotiatedForce = interrecipient.negotiateForce(this.force);
        
        for(var dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] += negotiatedForce[dim];
        }
        
        return this;
    }
}

class VacuumDragActor extends Interactor {
    constructor(vacuum = 0) {
        super();
        this.setId("drag");
        
        this.vacuum = vacuum;
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        let minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        for(let dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] += interrecipient.negotiateDimension(dim, this.vacuum * Math.sign(actor.getPositionM(dim) - recipient.getPositionM(dim)));
        }
        
        return this;
    }
}

class DragRecipient extends Interrecipient {
    constructor(forceFactor = 1) {
        super();
        this.setId("drag");
        
        this.forceFactor = forceFactor;
    }
    
    negotiateForce(force) {
        var negotiated = [];
        
        for(var dim = 0; dim < force.length; ++dim) {
            negotiated[dim] = this.negotiateDimension(dim, force[dim]);
        }
        
        return negotiated;
    }
    
    negotiateDimension(dimension, value) {
        if(this.recipient.hasState("ladder")) {return 0;}
        
        return value * this.forceFactor;
    }
}

/**
 *
 */

class ThrustActor extends Interactor {
    constructor(thrustValue = 0) {
        super();
        this.setId("thrust");
        
        this.thrustValue = thrustValue;
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        let value = interrecipient.negotiateThrust(this.thrustValue);
        let negotiated = interrecipient.negotiate(this);
        
        value = negotiated.thrustValue;
        
        if(value > actor.thrust) {
            // actor.thrust = value;
        }
        
        // 
        
        let thrustState = actor.findState("thrust");
        
        if(typeof thrustState == "undefined") {
            actor.addStateObject({name:"thrust", value:value, countdown:1});
        } else if(value > thrustState.value) {
            thrustState.value = value;
        }
        
        // 
        
        let thrustFactor = actor.findState("thrustFactor");
        
        if(typeof thrustFactor == "undefined") {
            actor.addStateObject({name:"thrustFactor", value:interrecipient.thrustFactor, countdown:1});
        } else if(interrecipient.thrustFactor > thrustFactor.value) {
            thrustFactor.value = interrecipient.thrustFactor;
        }
        
        return this;
    }
    
    getThrustValue() {return this.thrustValue;}
}

class ThrustRecipient extends Interrecipient {
    constructor(thrustFactor = 1) {
        super();
        this.setId("thrust");
        
        this.thrustFactor = thrustFactor;
    }
    
    negotiateThrust(thrustValue) {
        return thrustValue * this.thrustFactor;
    }
    
    negotiate(interactor) {
        return {"thrustValue" : interactor.getThrustValue() * this.thrustFactor};
    }
}

/**
 *
 */

class TypeDamager extends Interactor {
    constructor(offenses = [{"type" : "example", "value" : 0}]) {
        super();
        this.setId("damage");
        
        this.offenses = set_gather(Array.from(arguments));
        this.hit = new SetArray();
        this.hitActions = [];
        this.rehit = -1;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        if(!this.hit.includes(interrecipient)) {
            let averagesize = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
            let totalDamage = 0;
            
            for(var i = 0; i < this.offenses.length; ++i) {
                var type = this.offenses[i].type;
                
                let negotiatedDamage = interrecipient.negotiateDamage(type, this.offenses[i].value);
                
                recipient.hurt(negotiatedDamage);
                
                if(type === FX_SHARP) {
                    addDrawable(new CutDrawable(Vector.addition(actor.getPositionM(), recipient.getPositionM()).divide(2), [Math.random() * 2- 1, Math.random() * 2 - 1]).multiplySize(averagesize/16));
                    
                    let c = 3 + Math.round(Math.random());
                    
                    for(let i = 0; i < c; ++i) {
                        let angle = i * 2*Math.PI/c;
                        
                        let particle = DiamondParticle.fromMiddle(Vector.addition(actor.getPositionM(), recipient.getPositionM()).divide(2), [0, 0]);
                        
                        particle.setSpeed((new Vector(2 * Math.random() + 1, 0)).rotate(angle + Math.random()));
                        particle.getDrawable().rotate(particle.speed.getAngle()).multiplySize(averagesize/16);
                        
                        addEntity(particle);
                    }
                } else if(type === FX_GOLD_) {
                    let count = irandom(4, 8);
                    
                    for(let i = 0; i < count; ++i) {
                        let angle = i * 2*Math.PI/count;
                        
                        var particle = GoldSmokeParticle.fromMiddle(Vector.addition(actor.getPositionM(), recipient.getPositionM()).divide(2), [averagesize, averagesize]);
                        
                        let direction = getDD(actor.locate(recipient))[0];
                        let vector = actor.speed.normalized();
                        vector[direction.dimension] += direction.sign;
                        particle.setSpeed(vector.rotate(Math.random() * 2 - 1).normalize(Math.random() * (averagesize / 8)));
                        
                        addEntity(particle);
                    }
                } else if(type === FX_FIRE) {
                    let particle = FireParticle.fromMiddle(recipient.getPositionM(), recipient.getSize());
                    particle.drawable.multiplySize((recipient.getWidth() + recipient.getHeight())/2/16);
                    particle.drawable.setZIndex(Math.random() - 0.25);
                    particle.setSpeed([Math.random(), Math.random()]);
                    
                    addEntity(particle);
                } else if(type === FX_ELECTRIC) {
                    let count = 3;
                    
                    for(let i = 0; i < count; ++i) {
                        let angle = i/count * 2*Math.PI + Math.random() - 0.5;
                        
                        let lightning = new LightningDrawable(recipient.getPositionM(), Vector.addition(recipient.getPositionM(), [averagesize * Math.cos(angle), averagesize * Math.sin(angle)]));
                        
                        addDrawable(lightning);
                    }
                }
                
                totalDamage += negotiatedDamage;
            }
            
            for(let i = 0; i < this.hitActions.length; ++i) {
                recipient.addAction(object_clone(this.hitActions[i]));
            }
            
            this.hit.add(interrecipient);
            
            let hit = this.hit;
            
            if(this.rehit > 0) {
                setGameTimeout(function() {
                    hit.splice(0, hit.length);
                }, this.rehit);
            }
            
            /**
            worldFreeze = 3;
            setGameTimeout(function() {
                worldFreeze = 2;
            }, 1);/**/
            
            let ts;
            
            if(ts = CAMERA.findActionWithId("transitionSize")) {
                CAMERA.setSizeM(ts.sizeTransition.endColor);
            }
            
            CAMERA.removeActionsWithId("transitionSize");
            
            CAMERA.addAction(new TransitionSize(new ColorTransition(Vector.subtraction(CAMERA.getSize(), [2 * totalDamage, 2 * totalDamage, 0]), CAMERA.getSize(), 12, function timing(t) {
                let sign = (t * 5) % 2 == 0 ? -1 : 1;
                let val = 1 - t;
                
                return 1 + sign * val;
            })));
        } else {/**
            ++interrecipient.rehitTimer;
            
            if(interrecipient.rehitTimer == this.rehit) {
                interrecipient.rehitTimer = 0;
                this.hit.remove(interrecipient);
            }**/
        }
        
        return this;
    }
    
    setRehit(rehit) {this.rehit = rehit; return this;}
}

class TypeDamageable extends Interrecipient {
    constructor(factors = [{"type" : "example", "factor" : 1}]) {
        super();
        this.setId("damage");
        
        this.factors = set_gather(Array.from(arguments));
        this.rehitTimer = 0;
    }
    
    negotiateDamage(type, damage) {
        for(var i = 0; i < this.factors.length; ++i) {
            if(this.factors[i].type == type) {
                return this.factors[i].factor * damage;
            }
        }
        
        return damage;
    }
    
    oninteraction(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        if(recipient == PLAYER) {++hitsCount;}
        
        return this;
    }
}

/**
 *
 */

class GroundActor extends Interactor {
    constructor() {
        super();
        this.setId("ground");
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        recipient.addState("grounded");
        
        if(recipient.locate(this.getActor()) & 8) {
            recipient.addState("actuallyGrounded");
        }
        
        return this;
    }
}

class GroundAreaActor extends Interactor {
    constructor() {
        super();
        this.setId("ground");
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        recipient.addState("grounded").addState("actuallyGrounded");
        
        return this;
    }
}

class GroundRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("ground");
    }
}

/**
 *
 */

class ItemPicker extends Interactor {
    constructor() {
        super();
        this.setId("itemPick");
        
        this.items = [];
    }
    
    interact(interrecipient) {
        this.items.push(interrecipient.item);
        interrecipient.item = null;
        
        return this;
    }
}

class ItemPickable extends Interrecipient {
    constructor(item) {
        super();
        this.setId("itemPick");
        
        this.item;
    }
    
    oninteraction(interactor) {
        removeEntity(this.getRecipient());
        
        return this;
    }
}

/**
 *
 */

let maptransitioning = false;

class MapWarper extends Interactor {
    constructor(mapname, warpPositionM = [0, 0]) {
        super();
        this.setId("mapwarp");
        
        this.mapname = mapname;
        this.warpPositionM = warpPositionM;
    }
    
    interact(interrecipient) {
        if(!maptransitioning) {
            // loadMap(this.mapname);
            maptransitioning = true;
            playerPositionM.set(this.warpPositionM);
            addEntity(new TransitionCover(this.mapname));
        }
        
        return this;
    }
}

class LookupMapWarper extends MapWarper {
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        if(recipient.hasState("lookup")) {
            let minDim = Math.min(actor.getDimension(), recipient.getDimension());
            
            for(let dim = 0; dim < minDim; ++dim) {
                if(recipient.getPosition1(dim) + recipient.getSize(dim)/4 >= actor.getPosition2(dim) || recipient.getPosition2(dim) - recipient.getSize(dim)/4 <= actor.getPosition1(dim)) {
                    return this;
                }
            }
            
            super.interact(...arguments);
        }
        
        return this;
    }
}

class MapWarpable extends Interrecipient {
    constructor() {
        super();
        this.setId("mapwarp");
    }
}

/**
 *
 */

class RouteActor extends Interactor {
    constructor() {
        super();
        this.setId("route");
    }
}

class RouteRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("route");
    }
}

/**
 *
 */

class DirectActor extends Interactor {
    constructor(direction) {
        super();
        this.setId("direct");
        
        this.direction = direction;
    }
    
    interact(interrecipient) {
        interrecipient.getRecipient().setSpeed();
        
        return this;
    }
}

class DirectRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("direct");
    }
}

/**
 *
 */

class CameraReplaceActor extends Interactor {
    constructor() {
        super();
        this.setId("cameraReplace");
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        
        let loc = actor.locate(recipient);
        actor.replace(recipient, loc);
        
        /**
        
        let dimension = 0, sign = -1;
        
        while(loc > 0) {
            if(loc & 1) {
                let position = Vector.from(actor.getPositionM()).add(dimension, sign * actor.getSize(dimension)/2);
                
                interrecipient.replaced.push({"dimension" : dimension, "sign" : sign, "position" : position});
                
                let replaced = interrecipient.replaced.find(function(replaced) {
                    return replaced.dimension == dimension && replaced.sign == -sign;
                });
                
                if(typeof replaced != "undefined") {
                    recipient.setSizeM(dimension, Math.abs(replaced.position[dimension] - position[dimension]));
                }
            }
            
            sign *= -1;
            
            if(sign < 0) {++dimension;}
            
            loc >>= 1;
        }
        
        /**/
        
        return this;
    }
}

class CameraReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("cameraReplace");
        
        this.replaced = [];
    }
}

/**
 *
 */

class GravityActor extends Interactor {
    constructor(force = [0, 0]) {
        super();
        this.setId("gravity");
        
        this.force = force;
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        // recipient.gravityDirection.add(this.force);
        
        let gravityState = recipient.findState("gravity")
        
        if(typeof gravityState == "undefined") {
            recipient.addStateObject({name:"gravity", direction:Vector.filled(recipient.getDimension(), 0).add(this.force), countdown:1});
        } else {
            gravityState.direction.add(this.force);
        }
        
        return this;
    }
}

class GravityRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("gravity");
    }
}

class WaterActor extends Interactor {
    constructor() {
        super();
        this.setId("water");
    }
    
    interact(interrecipient) {
        interrecipient.getRecipient().addState("water");
        
        return this;
    }
}

class WaterRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("water");
    }
}

class ContactVanishActor extends Interactor {
    constructor(flags) {
        super();
        this.setId("contactVanish");
        
        this.flags = flags;
    }
    
    interact(interrecipient) {
        if(interrecipient.flags & this.flags) {
            let recipient = interrecipient.getRecipient();
            
            recipient.setEnergy(0);
        }
        
        return this;
    }
}

class ContactVanishRecipient extends Interrecipient {
    constructor(flags) {
        super();
        this.setId("contactVanish");
        
        this.flags = flags;
    }
    
    oninteraction(interactor) {
        if(this.flags & interactor.flags) {
            let recipient = this.getRecipient();
            
            /**
            
            for(let i = 0; i < 8; ++i) {
                let angle = i * 2*Math.PI/8;
                
                var particle = SmokeParticle.fromMiddle(recipient.getPositionM(), [8, 8]);
                particle.setSpeed((new Vector(1, 0)).rotated(angle).normalize(Math.random()));
                
                addEntity(particle);
            }
            
            /**/
            
            let averagesize = rectangle_averagesize(recipient);
            let particle = SpikeSmokeParticle.fromMiddle(recipient.getPositionM(), [averagesize, averagesize]);
            particle.setSpeed(recipient.speed.normalized(-0.5));
            
            addEntity(particle);
            
            /**/
        }
        
        return this;
    }
}

class AirThrustActor extends Interactor {
    constructor() {
        super();
        this.setId("airThrust");
    }
}

class AirThrustRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("airThrust");
    }
}

class WaterThrustActor extends Interactor {
    constructor() {
        super();
        this.setId("waterThrust");
    }
}

class WaterThrustRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("waterThrust");
    }
}

class SoftReplaceActor extends Interactor {
    constructor() {
        super();
        this.setId("softReplace");
        
        this.brakeValue = BRK_OBST;
        this.thrustValue = THRUSTFACTOR_OBSTACLE;
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        if(!recipient.hasState("crouch") && recipient.speed[1] > 0 && (actor.locate(recipient) & 4)) {
            recipient.brake(this.brakeValue);
            actor.replace(recipient, 4);
            recipient.speed[1] = 0;
        }
        
        return this;
    }
}

class SoftReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("softReplace");
    }
}

class SoftThrustRecipient extends ThrustRecipient {
    negotiate(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        if(!actor.hasState("crouch") && actor.speed[1] > 0 && (recipient.locate(actor) & 4)) {
            return {"thrustValue" : interactor.getThrustValue() * this.thrustFactor};
        }
        
        return {"thrustValue" : 0};
    }
}

class WallActor extends Interactor {
    constructor() {
        super();
        this.setId("wall");
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        let locate = recipient.locate(actor);
        
        if(locate & 1 || locate & 2) {
            recipient.addStateObject({"name" : "wall", "countdown" : 1, "locate" : locate, "side" : !!(locate & 1) - !!(locate & 2)});
        }
        
        return this;
    }
}

class WallRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("wall");
    }
}

class LadderActor extends Interactor {
    constructor() {
        super();
        this.setId("ladder");
    }
    
    interact(interrecipient) {
        let recipient = interrecipient.getRecipient();
        
        let maintainState = recipient.findState("ladder-maintain");
        
        if(typeof maintainState != "undefined") {
            recipient.addState("ladder");
            maintainState.countdown = 2;
        } else if(recipient.hasState("lookup")) {
            recipient.addState("ladder");
            recipient.addStateObject({"name" : "ladder-maintain", "countdown" : 2});
            recipient.brake(Infinity);
        }
        
        return this;
    }
}

class LadderRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("ladder");
    }
}
