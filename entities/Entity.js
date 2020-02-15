
var entityId = -1;

const EC = {};

function entity_getClassId(entity) {
    for(let i in EC) {
        if(entity.constructor === EC[i]) {
            return i;
        }
    }
    
    console.warn(entity.constructor.name, "not found in EC.");
    
    return "nf";
}

let ACTIONADDED = false;

class Entity extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        // this.id = ++entityId;
        
        Object.defineProperty(this, "speed", {"configurable" : true, "enumerable" : true, "value" : Vector.filled(this.getDimension(), 0), "writable" : true});
        this.selfBrake = 1;
        // this.thrust = 0;
        this.selfThrust = 0;
        
        // 
        
        this.drawable = RectangleDrawable.shared(this).setCameraMode("basic").setStyle(INVISIBLE);
        
        // 
        
        this.collidable = true;
        this.collide_priority = 0;
        
        // this.solid = false;
        // this.crusher = false;
        this.whitelist = null;
        this.blacklist = new SetArray(this);
        
        this.collidedWith = new SetArray();
        
        // this.replaceId = 0;
        // this.bounce = 0;
        // this.replaceable = false;
        
        // this.otherBrake = 1;
        // this.brakeExponent = 1;
        
        // this.blockable = false;
        // this.force = Vector.filled(this.getDimension(), 0);
        // this.forceFactor = 1;
        // this.vacuum = 0;
        
        // this.otherThrust = 0;
        // this.thrustFactor = 1;
        
        
        this.interactors = [];
        this.interrecipients = [];
        
        
        
        this.direction = Vector.filled(this.getDimension(), 0);
        
        // this.focus;
        this.target = null;// Entity
        this.targets = new SetArray();
        // this.destination = Vector.from(this.getPosition());
        this.route = null;// Vector
        this.cursor = null;// Entity
        
        this.energy = 1;
        // this.effects = [];
        
        this.actions = [];
        this.actset = [];
        
        this.state = {};
        
        // this.gravityDirection = Vector.filled(this.getDimension(), 0);
        // this.ground = false;
        
        // 
        
        this.battler = null;
        
        this.added = false;
        
        this.allies = new SetArray(this);
        this.opponents = new SetArray();
        
        this.controller = noController;
        
        this.controllers = new SetArray();
        
        this.drawableOffset = Vector.filled(this.getDimension(), 0);
        
        this.collidesWith = new SetArray();
        
        this.lifeCounter = 0;
        this.lifespan = -1;
        
        this.preposition = Vector.from(this.position);
        this.presize = Vector.from(this.size);
        
        this.stats = {
            "energy": {
                "effective": 1,
                "real": 1,
                "effectiveLock": false
            },
            
            "regeneration": 0,
            
            "action-costFactor": 1,
            
            "count-hurt": 0,
            "tiredRatio": 0.125,
            
            "stun-timeoutFactor": 1
        };
        
        this.eventListeners = {};
        
        this.drawables = new SetArray();
        
        this.resistances = {};
        this.offenses = {};
        
        this.items = new SetArray();
        
        this.freeze = 0;
        
        this.gameLoop = null;
        
        this.order = 0;
        
        this.alwaysLoad = false;
        
        this.cursorDistance = 256;
        
        this.stateimg = {};
        
        this.accelerators = new SetArray();
    }
    
    static fromData(data) {
        let entity = super.fromData(data);
        
        if(data.stats) {entity.setStats(data.stats);}
        if(data.energy) {entity.setEnergy(data.energy);}
        
        return entity;
    }
    
    setSpeed(speed) {
        if(Array.isArray(speed)) {
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this.speed.set(dim, speed[dim]);
            }
        } else if(arguments.length == 2) {
            var dim = arguments[0], value = arguments[1];
            
            this.speed.set(dim, value);
        }
        
        return this;
    }
    
    getZIndex() {return this.drawable.zIndex;}
    setZIndex(zIndex) {this.drawable.zIndex = zIndex; return this;}
    
    setStyle(style) {
        this.drawable.setStyle(style);
        
        return this;
    }
    
    updateDrawable() {
        return this;
    }
    
    setCollidable(collidable) {this.collidable = collidable; return this;}
    isCollidable() {return this.collidable;}
    
    setDrawable(drawable) {this.drawable = drawable; return this;}
    getDrawable() {return this.drawable;}
    
    isBlockable() {return this.blockable;}
    setBlockable(blockable) {this.blockable = blockable;return this;}
    
    isReplaceable() {return this.replaceable;}
    setReplaceable(replaceable) {this.replaceable = replaceable; return this;}
    
    getWhitelist() {return this.whitelist;}
    getBlacklist() {return this.blacklist;}
    setWhitelist(whitelist) {this.whitelist = whitelist; return this;}
    shareBlacklist(blacklist) {this.blacklist = blacklist; this.addBlacklist(this); return this;}
    
    addBlacklist(entity) {
        if(arguments.length > 1) {
            for(let i = 0; i < arguments.length; ++i) {
                this.addBlacklist(arguments[i]);
            }
        } else if(arguments.length == 1) {
            if(entity instanceof Entity) {
                this.blacklist.add(entity);
            }
            
            else if(Array.isArray(entity)) {
                for(var i = 0; i < entity.length; ++i) {
                    this.addBlacklist(entity[i]);
                }
            }
        }
        
        return this;
    }
    
    removeBlacklist(entity) {
        if(entity instanceof Entity) {
            this.blacklist.remove(entity);
        }
        
        else if(Array.isArray(entity)) {
            for(var i = entity.length - 1; i >= 0; --i) {
                this.removeBlacklist(entity[i]);
            }
        }
        
        return this;
    }
    
    findWhitelist(entity) {return this.whitelist.includes(entity);}
    
    findBlacklist(entity) {return this.blacklist.includes(entity);}
    
    // 
    
    getSelfBrake() {return this.selfBrake;}
    setSelfBrake(selfBrake) {this.selfBrake = selfBrake; return this;}
    
    // getOtherBrake() {return this.otherBrake;}
    // setOtherBrake(otherBrake) {this.otherBrake = otherBrake; return this;}
    
    // getBrakeExponent() {return this.brakeExponent;}
    // setBrakeExponent(brakeExponent) {this.brakeExponent = brakeExponent; return this;}
    
    // getForce() {return this.force;}
    // setForce(force) {
        // for(var dim = 0; dim < this.getDimension(); ++dim) {
            // this.force.set(dim, force[dim]);
        // }
        
        // return this;
    // }
    
    // getForceFactor() {return this.forceFactor();}
    // setForceFactor(forceFactor) {this.forceFactor = forceFactor; return this;}
    
    // getReplaceId() {return this.replaceId;}
    // setReplaceId(replaceId) {this.replaceId = replaceId; return this;}
    
    // getVacuum() {return this.vacuum;}
    // setVacuum(vacuum) {this.vacuum = vacuum; return this;}
    
    // getOtherThrust() {return this.otherThrust;}
    // setOtherThrust(otherThrust) {this.otherThrust = otherThrust; return this;}
    
    // getThrustFactor() {return this.thrustFactor;}
    // setThrustFactor(thrustFactor) {this.thrustFactor = thrustFactor; return this;}
    
    getSelfThrust() {return this.selfThrust;}
    setSelfThrust(selfThrust) {this.selfThrust = selfThrust; return this;}
    
    // 
    
    getTarget() {
        return this.target;
    }
    
    setTarget(target) {
        this.target = target;
        
        return this;
    }
    
    getCursor() {
        return this.cursor;
    }
    
    setCursor(cursor) {
        this.cursor = cursor;
        
        return this;
    }
    
    // 
    
    getMaxEnergy() {
        return this.stats["energy"].effective;
    }
    
    getEnergyRatio() {
        return this.getEnergy() / this.getMaxEnergy();
    }
    
    getEnergy() {
        return this.energy;
    }
    
    setEnergy(energy) {
        this.energy = energy;
        
        if(this.energy > this.getMaxEnergy()) {
            this.energy = this.getMaxEnergy();
        }
        
        return this;
    }
    
    resetEnergy() {
        this.setEnergy(this.getMaxEnergy());
        
        return this;
    }
    
    regenerate(value = this.stats["regeneration"]) {
        return this.heal(value);
    }
    
    setRegeneration(regeneration) {
        this.setStats({"regeneration": regeneration});
        
        return this;
    }
    
    setLifespan(lifespan) {
        this.lifeCounter = 0;
        this.lifespan = lifespan;
        
        return this;
    }
    
    getLifespan() {
        return this.lifespan;
    }
    
    setTypeResistance(type, factor) {
        this.resistances[type] = factor;
        
        /**
        for(var i = 0; i < this.effects.length; ++i) {
            var eff = this.effects[i];
            
            if(eff.type == type) {
                eff.factor = factor;
                
                return this;
            }
        }
        
        this.effects.push({"type" : type, "factor" : factor});
        /**/
        return this;
    }
    
    setTypeOffense(type, offense) {
        this.offenses[type] = offense;
        
        const typeImpact = typeImpacts[type];
        
        if(typeImpact) {
            this.setEventListener("hit", "auto-" + type, function(event) {
                typeImpact(event.actor, event.recipient);
                
                return this;
            });
        }
        
        /**
        for(var i = 0; i < this.effects.length; ++i) {
            var eff = this.effects[i];
            
            if(eff.type == type) {
                eff.offense = offense;
                
                return this;
            }
        }
        
        this.effects.push({"type" : type, "offense" : offense});
        /**/
        return this;
    }
    
    // getEffect(type) {
        // var def = {"type" : "default", "factor" : 0, "offense" : 0};
        
        // for(var i = 0; i < this.effects.length; ++i) {
            // var eff = this.effects[i];
            
            // if(eff.type == "default") {
                // def = eff;
            // } if(eff.type == type) {
                // return eff;
            // }
        // }
        
        // return def;
    // }
    
    // 
    
    addState(statename, value = true) {
        return this.addStateObject({"name" : statename, "countdown" : 1, "value" : value});;
    }
    
    addStateObject(object) {
        if(!this.hasState()) {
            this.state[object.name] = object;
        }
        
        return this;
    }
    
    removeState(statename) {
        delete this.state[statename];
        
        return this;
    }
    
    findState(statename) {
        return this.state[statename];
    }
    
    hasState(statename) {
        return this.state.hasOwnProperty(statename);
    }
    
    updateState() {
        for(let name in this.state) {
            const state = this.state[name];
            
            if(state.countdown > 0) {
                --state.countdown;
            } if(state.countdown === 0) {
                delete this.state[name];
            }
        }
        
        return this;
    }
    
    // 
    
    drag(force) {
        if(arguments.length == 2) {
            this.speed[arguments[0]] += arguments[1];
        } else if(Array.isArray(force)) {
            let minDim = Math.min(this.getDimension(), force.length);
            
            for(let dim = 0; dim < minDim; ++dim) {
                this.speed[dim] += force[dim];
            }
        }
        
        return this;
    }
    
    advance() {
        let minDim = Math.min(this.getDimension(), this.speed.getDimension());
        
        for(var dim = 0; dim < minDim; ++dim) {
            this.position[dim] += this.speed[dim];
            this.brake(dim, this.selfBrake);
        }
        
        return this;
    }
    
    brake() {
        if(arguments.length == 2) {
            var dimension = arguments[0], value = arguments[1];
            
            this.speed[dimension] /= value;
            
            if(isAlmostZero(this.speed[dimension])) {
                this.speed[dimension] = 0;
            }
        } else if(arguments.length == 1 && typeof arguments[0] == "number") {
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this.brake(dim, arguments[0]);
            }
        }
        
        return this;
    }
    
    hurt() {
        if(arguments.length == 2) {
            var type = arguments[0], offense = arguments[1];
            
            var factor = this.getEffect(type).factor;
            
            this.energy -= factor * offense;
        }
        
        else if(arguments.length == 1 && Array.isArray(arguments[0])) {
            var offenses = arguments[0];
            
            for(var i = 0; i < offenses.length; ++i) {
                var offense = offenses[i];
                
                if(typeof offense.offense != "undefined") {
                    this.hurt(offense);
                }
            }
        }
        
        else if(arguments.length == 1 && typeof arguments[0] == "object") {
            var offense = arguments[0];
            
            if(typeof offense.offense != "undefined") {
                this.hurt(offense.type, offense.offense);
            }
        }
        
        else if(arguments.length == 1) {
            var offense = arguments[0];
            
            this.energy -= offense;
        }
        
        return this;
    }
    
    heal(value = 1) {
        this.energy += value;
        
        if(this.energy > this.getMaxEnergy()) {
            this.energy = this.getMaxEnergy();
        }
        
        return this;
    }
    
    oncollision(other) {
        if(/*this.findWhitelist(other) && */!this.findBlacklist(other)) {
            // other.hurt(this.effects);
            
            this.collidedWith.add(other);
            
            for(var i = 0; i < this.interactors.length; ++i) {
                var interactor = this.interactors[i];
                
                for(var j = 0; j < other.interrecipients.length; ++j) {
                    var interrecipient = other.interrecipients[j];
                    
                    if(interrecipient.matchId(interactor.getId()) && interactor.confirmInteraction(interrecipient)) {
                        interrecipient.beforeInteraction(interactor);
                        interactor.interact(interrecipient);
                        interrecipient.oninteraction(interactor);
                        break;
                    }
                }
            }
        }
        
        return this;
    }
    
    replace(other, type, bounce = 0) {
        if(type == -1) {
            /**/
            
            let preposition = other.preposition;
            let presize = other.presize;
            
            if(preposition[0] < this.preposition[0] + this.presize[0] && preposition[0] + presize[0] > this.preposition[0]) {
                if(preposition[1] + presize[1]/2 < this.preposition[1] + this.presize[1]/2) {
                    // console.log("up");
                    other.replaceStateObject({name:"lastReplaced", value:4, countdown:2});
                    // return this.replace(other, 4, bounce);
                    return this.replace(other, this.locate(other), bounce);
                } else {
                    // console.log("down");
                    other.replaceStateObject({name:"lastReplaced", value:8, countdown:2});
                    // return this.replace(other, 8, bounce);
                    return this.replace(other, this.locate(other), bounce);
                }
            }
            
            if(preposition[1] < this.preposition[1] + this.presize[1] && preposition[1] + presize[1] > this.preposition[1]) {
                if(preposition[0] + presize[0]/2 < this.preposition[0] + this.presize[0]/2) {
                    // console.log("left");
                    other.replaceStateObject({name:"lastReplaced", value:1, countdown:2});
                    // return this.replace(other, 1, bounce);
                    return this.replace(other, this.locate(other), bounce);
                } else {
                    // console.log("right");
                    other.replaceStateObject({name:"lastReplaced", value:2, countdown:2});
                    // return this.replace(other, 2, bounce);
                    return this.replace(other, this.locate(other), bounce);
                }
            }
            
            /**
            
            if(other.speed[0] > other.speed[1]) {
                if(other.getXM() < this.getXM()) {
                    console.log("left");
                    other.replaceStateObject({name:"lastReplaced", value:1, countdown:2});
                    
                    return this.replace(other, 1, bounce);
                } else {
                    console.log("right");
                    other.replaceStateObject({name:"lastReplaced", value:2, countdown:2});
                    
                    return this.replace(other, 2, bounce);
                }
            } if(other.speed[1] > other.speed[0]) {
                if(other.getYM() < this.getYM()) {
                    console.log("up");
                    other.replaceStateObject({name:"lastReplaced", value:4, countdown:2});
                    
                    return this.replace(other, 4, bounce);
                } else {
                    console.log("down");
                    other.replaceStateObject({name:"lastReplaced", value:8, countdown:2});
                    
                    return this.replace(other, 8, bounce);
                }
            }
            
            /**/
            
            let lastReplaced = other.findState("lastReplaced");
            
            if(lastReplaced) {
                return this.replace(other, lastReplaced.value, bounce);
            }
            
            /**/
            
            return this.replace(other, this.locate(other), bounce);
        }
        
        var minDimension = Math.min(this.getDimension(), other.getDimension());
        var negative = true;
        var dimension = 0;
        
        while(type > 0 && dimension < minDimension) {
            if((type & 1) == 1) {
                if(negative && other.speed[dimension] >= 0) {
                    other.setPosition2(dimension, this.getPosition1(dimension));
                    other.speed[dimension] = -bounce * other.speed[dimension];
                } else if(!negative && other.speed[dimension] <= 0) {
                    other.setPosition1(dimension, this.getPosition2(dimension));
                    other.speed[dimension] = -bounce * other.speed[dimension];
                }
            }
            
            
            
            negative = !negative;
            
            if(negative) {
                ++dimension;
            }
            
            type >>= 1;
        }
        
        Vector.add(other.position, Vector.subtraction(this.position, this.preposition));
        
        return this;
    }
    
    update() {
        this.preposition = Vector.from(this.position);
        this.presize = Vector.from(this.size);
        
        // for(let i = 0; i < this.controllers.length; ++i) {
        for(let i in this.controllers) {
            this.controllers[i].bind(this)();
        }
        
        // this.heal();
        this.updateActions();
        this.updateDrawable();
        this.accelerate();
        this.advance();
        // this.thrust += this.selfThrust;
        
        // this.updateReset();
        
        if(this.energy <= 0) {
            this.triggerEvent("defeat", new EntityEvent());
            removeEntity(this);
        }
        
        ++this.lifeCounter;
        
        if(this.lifeCounter == this.lifespan) {
            // this.triggerEvent("defeat", new EntityEvent());
            removeEntity(this);
        }
        
        return this;
    }
    
    updateReset() {
        this.updateState();
        // this.gravityDirection.fill(0);
        this.collidedWith.clear();
        // this.thrust = 0;
        this.route = null;
        this.collidesWith.clear();
        
        return this;
    }
    
    addAction(action) {
        // action.endid = "this message should be overwritten";
        
        if(!this.canUseAction(action)) {
            if(action instanceof Action) action.end("User can't use the action.");
            
            ACTIONADDED = false;
            
            return null;
        }
        
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i].allowsReplacement(action)) {
                this.removeActionAt(i, "Replaced from user with another action.");
                
                action.setUser(this);
                this.actions.push(action);
                action.onadd();
                
                ACTIONADDED = true;
                
                return this;
            }
            
            if(this.actions[i].preventsAddition(action)) {
                action.setEndid("Blocked from user by action.");
                
                ACTIONADDED = false;
                
                return null;
            }
        }
        
        action.setUser(this);
        this.actions.push(action);
        action.onadd();
        
        ACTIONADDED = true;
        
        return this;
    }
    
    removeActionAt(index, endid = "Removed from user.") {
        if(this.actions[index] instanceof Action && this.actions[index].isRemovable()) {
            var action = this.actions[index];
            
            this.actions.splice(index, 1);
            action.end(endid);
        }
        
        return this;
    }
    
    removeAction(action) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] == action) {
                this.removeActionAt(i, "Removed specifically from user (removeAction).");
            }
        }
        
        return this;
    }
    
    removeActionsWithConstructor(constructor) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof Action && this.actions[i].constructor == constructor) {
                this.removeActionAt(i, "Removed from user with a constructor match (removeActionsWithConstructor).");
            }
        }
        
        return this;
    }
    
    removeActionsInstanceof(constructor) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof constructor) {
                this.removeActionAt(i, "Removed from user as instanceof (removeActionsInstanceof).");
            }
        }
        
        return this;
    }
    
    removeActionsWithId(id) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof Action)/**/
            if(this.actions[i].getId() == id) {
                this.removeActionAt(i, "Removed from user with id (removeActionsWithId).");
            }
        }
        
        return this;
    }
    
    updateActions() {
        this.actions.sort(function(action1, action2) {
            if(action1.order > action2.order) return -1;
            if(action1.order < action2.order) return +1;
            return 0;
        });
        
        let actions = Array.from(this.actions);
        
        for(var i = this.actions.length - 1; i >= 0; --i) {
            var action = this.actions[i];
            
            if(action instanceof Action) {
                if(action.user != this) {
                    console.error("??? action.user is not entity that updates action ???");
                    console.log(this, action);
                }
                
                action.use();
                action.incPhase();
            }
        }
        
        return this;
    }
    
    hasActionWithConstructor(constructor) {
        for(var i = 0; i < this.actions.length; ++i) {
            if(this.actions[i].constructor == constructor) {
                return true;
            }
        }
        
        return false;
    }
    
    hasActionWithId(id) {
        for(let i = 0; i < this.actions.length; ++i) {
            if(this.actions[i].getId() == id) {
                return true;
            }
        }
        
        return false;
    }
    
    findActionWithId(id) {
        for(let i = 0; i < this.actions.length; ++i) {
            if(this.actions[i].getId() == id) {
                return this.actions[i];
            }
        }
        
        return null;
    }
    
    canUseAction(action) {
        return action instanceof Action && this.containsActset(action.getId());
    }
    
    addActset() {
        if(arguments.length > 1) {
            for(var i = 0; i < arguments.length; ++i) {
                this.addActset(arguments[i]);
            }
        } else if(arguments.length == 1) {
            if(Array.isArray(arguments[0])) {
                for(var i = 0; i < arguments[0].length; ++i) {
                    this.addActset(arguments[0][i]);
                }
            } else {
                var index = this.actset.indexOf(arguments[0]);
                
                if(index == -1) {
                    this.actset.push(arguments[0]);
                }
            }
        } 
        
        return this;
    }
    
    clearActset() {
        this.actset.splice(0, this.actset.length);
        
        return this;
    }
    
    removeActset() {
        if(arguments.length > 1) {
            for(var i = 0; i < arguments.length; ++i) {
                this.removeActset(arguments[i]);
            }
        } else if(arguments.length == 1) {
            if(Array.isArray(arguments[0])) {
                for(var i = 0; i < arguments[0].length; ++i) {
                    this.removeActset(arguments[0][i]);
                }
            } else {
                var index = this.actset.indexOf(arguments[0]);
                
                if(index != -1) {
                    this.actset.splice(index, 1);
                }
            }
        } 
        
        return this;
    }
    
    containsActset(id) {
        for(var i = 0; i < this.actset.length; ++i) {
            if(this.actset[i] == id) {
                return true;
            }
        }
        
        return false;
    }
    
    // 
    
    isBattler() {
        return this.battler != null;
    }
    
    setBattler(battler) {
        this.battler = battler;
        
        return this;
    }
    
    getBattler() {
        return this.battler;
    }
    
    // 
    
    onadd() {
        addDrawable(this.drawable);
        for(let i = 0; i < this.drawables.length; ++i) {
            addDrawable(this.drawables[i]);
        }
        
        this.added = true;
        
        /*  *
        
        for(var i = 0; i < this.interactors.length; ++i) {
            addInteractor(this.interactors[i]);
        }
        
        for(var i = 0; i < this.interrecipients.length; ++i) {
            addInterrecipient(this.interrecipients[i]);
        }
        
        /*  */
        
        return this;
    }
    
    onremove() {
        this.removeBlacklist(this);
        removeDrawable(this.drawable);
        for(let i = 0; i < this.drawables.length; ++i) {
            removeDrawable(this.drawables[i]);
        }
        
        this.added = false;
        
        for(var i = 0; i < this.interactors.length; ++i) {
            removeInteractor(this.interactors[i]);
        }
        
        for(var i = 0; i < this.interrecipients.length; ++i) {
            removeInterrecipient(this.interrecipients[i]);
        }
        
        for(let i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof Action) this.actions[i].setRemovable(true);
            this.removeActionAt(i);
        }
        
        return this;
    }
    
    // 
    
    addInteraction(interaction) {
        if(interaction instanceof Interactor) {
            interaction.setActor(this);
            // if(this.added) addInteractor(interaction);
            
            for(var i = 0; i < this.interactors.length; ++i) {
                var interactor = this.interactors[i];
                
                if(interactor.matchId(interaction.getId())) {
                    interactor.setActor(null);
                    this.interactors[i] = interaction;
                    
                    return this;
                }
            }
            
            this.interactors.push(interaction);
        } else if(interaction instanceof Interrecipient) {
            interaction.setRecipient(this);
            // if(this.added) addInterrecipient(interaction);
            
            for(var i = 0; i < this.interrecipients.length; ++i) {
                var interrecipient = this.interrecipients[i];
                
                if(interrecipient.matchId(interaction.getId())) {
                    interrecipient.setRecipient(null);
                    this.interrecipients[i] = interaction;
                    
                    return this;
                }
            }
            
            this.interrecipients.push(interaction);
        }
        
        return this;
    }
    
    findInteractorWithId(id) {
        for(var i = 0; i < this.interactors.length; ++i) {
            if(this.interactors[i].matchId(id)) {
                return this.interactors[i];
            }
        }
        
        return null;
    }
    
    findInterrecipientWithId(id) {
        for(var i = 0; i < this.interrecipients.length; ++i) {
            if(this.interrecipients[i].matchId(id)) {
                return this.interrecipients[i];
            }
        }
        
        return null;
    }
    
    collides(other) {
        if(this.collidesWith.includes(other)) {
            return true;
        }
        
        let minDim = Math.min(this.getDimension(), other.getDimension());
        
        for(let dim = 0; dim < minDim; ++dim) {
            if(this.getPosition1(dim) >= other.getPosition2(dim) || this.getPosition2(dim) <= other.getPosition1(dim)) {
                return false;
            }
        }
        
        this.collidesWith.push(other);
        
        return true;
    }
    
    removeInteractorWithId(id) {
        for(let i = this.interactors.length - 1; i >= 0; --i) {
            if(this.interactors[i].matchId(id)) {
                this.interactors.splice(i, 1);
            }
        }
        
        return this;
    }
    
    removeInterrecipientWithId(id) {
        for(let i = this.interrecipients.length - 1; i >= 0; --i) {
            if(this.interrecipients[i].matchId(id)) {
                this.interrecipients.splice(i, 1);
            }
        }
        
        return this;
    }
    
    ondefeat() {
        return this;
    }
    
    getCursorDirection() {
        if(this.cursor != null) {
            let cursorDirection = Vector.subtraction(this.cursor.getPositionM(), this.getPositionM());
            
            for(let dim = 0; dim < cursorDirection.length; ++dim) {
                if(isAlmostZero(cursorDirection[dim])) {
                    cursorDirection[dim] = 0;
                }
            }
            
            return cursorDirection;
        }
        
        return null;
    }
    
    onland(event) {
        const obstacle = event.obstacle;
        
        return this;
    }
    
    replaceStateObject(object) {
        this.state[object.name] = object;
        
        return this;
    }
    
    setStats(stats) {
        for(let i in stats) {
            const propnames = i.split(".");
            let property = this.stats;
            
            for(let j = 0; j < propnames.length; ++j) {
                if(j === propnames.length - 1) {
                    property[propnames[j]] = stats[i];
                } else if(!property.hasOwnProperty(propnames[j])) {
                    property[propnames[j]] = {};
                }
                
                property = property[propnames[j]];
            }
            
            // this.stats[i] = stats[i];
        }
        
        return this;
    }
    
    triggerEvent(eventName, entityEvent) {
        if(typeof this["on" + eventName] === "function") {
            this["on" + eventName](entityEvent);
        }
        
        if(typeof this.eventListeners[eventName] === "object") {
            for(let i in this.eventListeners[eventName]) if(typeof this.eventListeners[eventName][i] === "function") {
                const eventFunction = this.eventListeners[eventName][i].bind(this);
                eventFunction(entityEvent);
            }
        } else if(typeof this.eventListeners[eventName] === "function") {
            const eventFunction = this.eventListeners[eventName].bind(this);
            eventFunction(entityEvent);
        }
        
        return this;
    }
    
    getData() {
        return {classId: entity_getClassId(this), position : this.position, size : this.size};
    }
    
    onhit(event) {
        const recipient = event.recipient;
        
        return this;
    }
    
    onhurt(event) {
        const actor = event.actor;
        
        ++this.stats["count-hurt"];
        
        return this;
    }
    
    setSizeTransition(sizeTransition) {
        if(!this.sizeTransition) {
            this.controllers.add(function() {
                this.setSizeM(this.sizeTransition.getNext());
            });
        }
        
        this.sizeTransition = sizeTransition;
        
        return this;
    }
    
    getGravityDirection() {
        let gravity = this.findState("gravity");
        
        if(gravity !== undefined) {
            return gravity.direction;
        }
        
        return new Vector(0, 0);
    }
    
    getThrust() {
        const energyRatio = this.getEnergyRatio();
        const tiredRatio = this.stats["tiredRatio"];
        
        if(this.hasState("actuallyGrounded")) {
            if(energyRatio < tiredRatio && this.stats["walk-speed-tired"] != undefined) {
                return this.stats["walk-speed-tired"].effective;
            }
            
            return this.stats["walk-speed"].effective || 0;
        } if(this.hasState("ladder")) {
            if(energyRatio < tiredRatio && this.stats["climb-speed-tired"] != undefined) {
                return this.stats["climb-speed-tired"].effective;
            }
            
            return this.stats["climb-speed"].effective || 0;
        } if(this.hasState("water")) {
            if(energyRatio < tiredRatio && this.stats["swim-speed-tired"] != undefined) {
                return this.stats["swim-speed-tired"].effective;
            }
            
            return this.stats["swim-speed"].effective || 0;
        } else {
            if(energyRatio < tiredRatio && this.stats["air-speed-tired"] != undefined) {
                return this.stats["air-speed-tired"].effective;
            }
            
            return this.stats["air-speed"].effective || 0;
        }
        
        return 0;
    }
    
    setFreeze(freeze) {
        if(this.freeze < freeze) {
            this.freeze = freeze;
        }
        
        return this;
    }
    
    isFrozen() {
        return this.freeze > 0;
    }
    
    thaw() {
        if(this.freeze > 0) {
            --this.freeze;
        }
        
        return this;
    }
    
    addEntity(entity) {
        if(this.gameLoop != null) {
            this.gameLoop.addEntity(entity);
        }
        
        return this;
    }
    
    getGameEntities() {
        if(this.gameLoop != null) {
            return this.gameLoop.getEntities();
        }
        
        return new SetArray();
    }
    
    getCollidable() {
        return this;
    }
    
    addEventListener(eventName, listener) {
        if(!this.eventListeners.hasOwnProperty(eventName)) {
            this.eventListeners[eventName] = [];
        }
        
        this.eventListeners[eventName].push(listener);
        
        return this;
    }
    
    setEventListener(eventName, listenerName, listener) {
        if(!this.eventListeners.hasOwnProperty(eventName)) {
            this.eventListeners[eventName] = [];
        }
        
        this.eventListeners[eventName][listenerName] = listener;
        
        return this;
    }
    
    setGameLoop(gameLoop) {
        this.gameLoop = gameLoop;
        
        if(this.whitelist === null) {
            this.whitelist = gameLoop.getCollidables();
        }
        
        return this;
    }
    
    negotiateActionCost(cost, action) {
        return cost * this.stats["action-costFactor"];
    }
    
    accelerate() {
        for(let i = 0; i < this.accelerators.length; ++i) {
            this.speed.add(this.accelerators[i]);
        }
        
        return this;
    }
    
    negotiateStunTimeout(timeout, actor) {
        return timeout * this.stats["stun-timeoutFactor"];
    }
    
    removeEventListener(eventName, listener) {
        const eventListeners = this.eventListeners[eventName];
        
        let matchFn = function() {return false;};
        
        if(typeof listener === "function") {
            matchFn = function(eventListener, eventName) {
                return eventListener === listener;
            };
        } else if(typeof listener === "string") {
            matchFn = function(eventListener, eventName) {
                return eventName === listener;
            };
        } else if(listener instanceof RegExp) {
            matchFn = function(eventListener, eventName) {
                return eventName.match(listener);
            };
        }
        
        for(let i in eventListeners) {
            if(matchFn(eventListeners[i], i)) {
                delete eventListeners[i];
            }
        }
        
        return this;
    }
    
    removeAutoHitListeners() {
        return this.removeEventListener("hit", /^auto/);
    }
    
    removeTypeOffense(type) {
        delete this.offenses[type];
        this.removeEventListener("hit", "auto-" + type);
        
        return this;
    }
    
    clearTypeOffenses() {
        for(let type in this.offenses) {
            this.removeTypeOffense(type);
        }
        
        return this;
    }
}

function stunOnhit(event) {
    const {actor, recipient} = event;
    
    const negotiatedTimeout = recipient.negotiateStunTimeout(actor.stats["stun-timeout"]);
    
    if(negotiatedTimeout > 0) {
        recipient.addAction(new StunState(negotiatedTimeout));
    }
}

class Hitbox extends Entity {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new TypeDamager());
        this.launchDirection = [0, 0, 0];
        
        this.addEventListener("hit", function(event) {
            const recipient = event.recipient;
            
            if(Array.isArray(this.launchDirection)) {
                let dragInterrecipient = recipient.findInterrecipientWithId("drag");
                
                let dragFactor = 0;
                if(dragInterrecipient != undefined) {dragFactor = dragInterrecipient.forceFactor;}
                
                recipient.drag(Vector.multiplication(this.launchDirection, dragFactor));
            }
        });
        
        this.setStats({"stun-timeout": 16});
        this.addEventListener("hit", stunOnhit);
    }
}

class EntityAround extends Entity {
    constructor() {
        super(...arguments);
        this.collidable = false;
        
        this.entityClass = Entity;
    }
    
    onadd() {
        let entities = this.getSurrounding();
        
        for(let i = 0; i < entities.length; ++i) {
            addEntity(entities[i]);
        }
        
        return this;
    }
    
    update() {
        // removeEntity(this);
        
        return this;
    }
    
    getSurrounding() {
        let entities = new SetArray();
        
        for(let dim = 0; dim < this.getDimension(); ++dim) {
            var entity = this.entityClass.from(this);
            var vector = Vector.filled(this.getDimension(), 0);
            vector[dim] = -this.getSize(dim);
            entity.translate(vector);
            
            entities.add(entity);
            
            var entity = this.entityClass.from(this);
            var vector = Vector.filled(this.getDimension(), 0);
            vector[dim] = +this.getSize(dim);
            entity.translate(vector);
            
            entities.add(entity);
        }
        
        return entities;
    }
}

function optimizeEntities(entities) {
    let optimized = entities; SetArray.from(entities);
    let changed = true;
    
    while(changed) {
        changed = false;
        let i = 0;
        
        while(!changed && i < optimized.length) {
            let entity0 = optimized[i];
            
            let j = i + 1;
            
            while(!changed && j < optimized.length) {
                let entity1 = optimized[j];
                
                if(entity0.constructor === entity1.constructor && entity0.getDimension() === entity1.getDimension()) {
                    if(
                    entity0.getX1() === entity1.getX1() && entity0.getX2() === entity1.getX2() && entity0.getY1() <= entity1.getY2() && entity1.getY1() <= entity0.getY2()
                    || entity0.getY1() === entity1.getY1() && entity0.getY2() === entity1.getY2() && entity0.getX1() <= entity1.getX2() && entity1.getX1() <= entity0.getX2()
                    ) {
                        let dimension = entity0.getDimension();
                        
                        let position = new Vector(dimension);
                        let size = new Vector(dimension);
                        
                        for(let dim = 0; dim < dimension; ++dim) {
                            position[dim] = Math.min(entity0.getPosition1(dim), entity1.getPosition1(dim));
                            size[dim] = Math.max(entity0.getPosition2(dim), entity1.getPosition2(dim)) - position[dim];
                        }
                        
                        let newEntity = new (entity0.constructor)(position, size);
                        
                        /**
                        optimized.push(newEntity);
                        optimized.splice(i, 2);
                        // optimized.add(newEntity);
                        // optimized.remove(entity0);
                        // optimized.remove(entity1);
                        /**/
                        addEntity(newEntity);
                        removeEntity(entity0);
                        removeEntity(entity1);
                        /**/
                        changed = true;
                    }
                }
                
                ++j;
            }
            
            ++i;
        }
    }
    
    return optimized;
}
