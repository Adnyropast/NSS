
var entityId = -1;

const EC = {};

class Entity extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        // this.id = ++entityId;
        
        Object.defineProperty(this, "speed", {"configurable" : true, "enumerable" : true, "value" : Vector.filled(this.getDimension(), 0), "writable" : true});
        this.selfBrake = 1;
        this.thrust = 0;
        this.selfThrust = 0;
        
        // 
        
        this.drawable = RectangleDrawable.shared(this).setCameraMode("basic").setStyle(INVISIBLE);
        
        // 
        
        this.collidable = true;
        this.collide_priority = 0;
        
        // this.solid = false;
        // this.crusher = false;
        this.whitelist = COLLIDABLES;
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
        
        this.effectiveEnergy = this.realEnergy = this.energy = 1;
        // this.regeneration = 0;
        // this.effects = [];
        
        this.actions = [];
        this.actset = [];
        
        this.state = [];
        
        this.gravityDirection = Vector.filled(this.getDimension(), 0);
        // this.ground = false;
        
        // 
        
        this.battler = null;
        
        this.added = false;
        
        this.addActset("regeneration");
        
        this.allies = new SetArray(this);
        this.opponents = new SetArray();
        
        this.controller = noController;
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
        // if(this.drawable != null) {
            // this.drawable.setSize(this.getSize());
            // this.drawable.setPosition(this.getPosition());
        // }
        
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
    
    getRealEnergy() {
        return this.realEnergy;
    }
    
    setRealEnergy(realEnergy) {
        this.realEnergy = realEnergy;
        
        return this;
    }
    
    getEnergyRatio() {
        return this.energy / this.realEnergy;
    }
    
    getEnergy() {
        return this.energy;
    }
    
    setEnergy(energy) {
        this.energy = energy;
        
        if(this.energy > this.realEnergy) {
            this.energy = this.realEnergy;
        }
        
        return this;
    }
    
    resetEnergy(realEnergy) {
        if(arguments.length == 0) {
            this.setEnergy(this.realEnergy);
        } else {
            this.setRealEnergy(realEnergy);
            this.setEnergy(this.realEnergy);
        }
        
        return this;
    }
    
    regenerate(value = 1) {
        return this.heal(value);
    }
    
    setRegeneration(regeneration) {
        this.addAction(new Regeneration(regeneration));
        
        return this;
    }
    
    setLifespan(lifespan) {
        this.resetEnergy(lifespan);
        
        this.removeActionsWithConstructor(Regeneration);
        this.addAction(new Regeneration(-1));
        
        return this;
    }
    
    // setEffectFactor(type, factor) {
        // for(var i = 0; i < this.effects.length; ++i) {
            // var eff = this.effects[i];
            
            // if(eff.type == type) {
                // eff.factor = factor;
                
                // return this;
            // }
        // }
        
        // this.effects.push({"type" : type, "factor" : factor});
        
        // return this;
    // }
    
    // setOffense(type, offense) {
        // for(var i = 0; i < this.effects.length; ++i) {
            // var eff = this.effects[i];
            
            // if(eff.type == type) {
                // eff.offense = offense;
                
                // return this;
            // }
        // }
        
        // this.effects.push({"type" : type, "offense" : offense});
        
        // return this;
    // }
    
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
        for(let i = 0; i < this.state.length; ++i) {
            if(this.state[i].name == object.name) {
                return this;
            }
        }
        
        this.state.push(object);
        
        return this;
    }
    
    removeState(statename) {
        for(var i = this.state.length - 1; i >= 0; --i) {
            if(this.state[i].name == statename) {
                this.state.splice(i, 1);
            }
        }
        
        return this;
    }
    
    findState(statename) {
        return this.state.find(function(state) {
            return state.name == statename;
        });
    }
    
    hasState(statename) {
        return this.findState(statename) != undefined;
    }
    
    updateState() {
        for(var i = this.state.length - 1; i >= 0; --i) {
            if(this.state[i].countdown > 0) {
                --this.state[i].countdown;
            } if(this.state[i].countdown == 0) {
                this.state.splice(i, 1);
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
        
        if(this.energy > this.realEnergy) {
            this.energy = this.realEnergy;
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
                    
                    if(interrecipient.matchId(interactor.getId())) {
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
            return this.replace(other, this.locate(other), bounce);
        }
        
        var minDimension = Math.min(this.getDimension(), other.getDimension());
        var negative = true;
        var dimension = 0;
        
        while(type > 0 && dimension < minDimension) {
            if((type & 1) == 1) {
                if(negative && other.speed[dimension] >= 0) {
                    other.setPosition2(dimension, this.getPosition1(dimension));
                } else if(!negative && other.speed[dimension] <= 0) {
                    other.setPosition1(dimension, this.getPosition2(dimension));
                }
                
                other.speed[dimension] = -bounce * other.speed[dimension];
            }
            
            
            
            negative = !negative;
            
            if(negative) {
                ++dimension;
            }
            
            type >>= 1;
        }
        
        return this;
    }
    
    update() {
        // this.heal();
        this.updateActions();
        this.updateDrawable();
        this.advance();
        this.thrust += this.selfThrust;
        
        // this.updateReset();
        
        if(this.energy <= 0) {
            removeEntity(this);
        }
        
        return this;
    }
    
    updateReset() {
        this.updateState();
        this.gravityDirection.fill(0);
        this.collidedWith.splice(0, this.collidedWith.length);
        this.thrust = 0;
        this.route = null;
        
        return this;
    }
    
    addAction(action) {
        action.endid = "this message should be overwritten";
        
        if(!this.canUseAction(action)) {
            action.end("User can't use the action.");
            
            return this;
        }
        
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i].allowsReplacement(action)) {
                this.removeActionAt(i, "Replaced from user with another action.");
                
                action.setUser(this);
                this.actions.push(action);
                action.onadd();
                
                return this;
            }
            
            if(this.actions[i].preventsAddition(action)) {
                action.setEndid("Blocked from user by action.");
                
                return this;
            }
        }
        
        action.setUser(this);
        this.actions.push(action);
        action.onadd();
        
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
            if(/*this.actions[i] instanceof Action && */this.actions[i].constructor == constructor) {
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
        return this.containsActset(action.getId());
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
        
        this.added = true;
        
        for(var i = 0; i < this.interactors.length; ++i) {
            addInteractor(this.interactors[i]);
        }
        
        for(var i = 0; i < this.interrecipients.length; ++i) {
            addInterrecipient(this.interrecipients[i]);
        }
        
        return this;
    }
    
    onremove() {
        this.removeBlacklist(this);
        removeDrawable(this.drawable);
        
        this.added = false;
        
        for(var i = 0; i < this.interactors.length; ++i) {
            removeInteractor(this.interactors[i]);
        }
        
        for(var i = 0; i < this.interrecipients.length; ++i) {
            removeInterrecipient(this.interrecipients[i]);
        }
        
        for(let i = this.actions.length - 1; i >= 0; --i) {
            this.removeActionAt(i);
        }
        
        return this;
    }
    
    // 
    
    addInteraction(interaction) {
        if(interaction instanceof Interactor) {
            interaction.setActor(this);
            if(this.added) addInteractor(interaction);
            
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
            if(this.added) addInterrecipient(interaction);
            
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
        let minDim = Math.min(this.getDimension(), other.getDimension());
        
        for(let dim = 0; dim < minDim; ++dim) {
            if(this.getPosition1(dim) >= other.getPosition2(dim) || this.getPosition2(dim) <= other.getPosition1(dim)) {
                return false;
            }
        }
        
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
}
