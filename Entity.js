
var entityId = -1;

class Entity extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        // this.id = ++entityId;
        
        Object.defineProperty(this, "speed", {"configurable" : true, "enumerable" : true, "value" : Vector.filled(this.getDimension(), 0), "writable" : true});
        this.selfBrake = 1;
        
        this.removable = false;
        
        // 
        
        this.drawable = new RectangleDrawable(position, size);
        
        // 
        
        this.collidable = true;
        this.collide_priority = 0;
        
        this.blockable = false;
        // this.solid = false;
        // this.crusher = false;
        this.whitelist = COLLIDABLE;
        this.blacklist = [this];
        
        this.collidedWith = [];
        
        this.replaceId = 0;
        this.bounce = 0;
        this.replaceable = false;
        
        this.otherBrake = 1;
        this.brakeExponent = 1;
        
        this.force = Vector.filled(this.getDimension(), 0);
        this.forceFactor = 1;
        this.vacuum = 0;
        
        this.thrust = 0;
        this.otherThrust = 0;
        this.thrustFactor = 1;
        this.selfThrust = 0;
        
        this.interactors = [];
        this.interrecipients = [];
        
        
        
        this.direction = Vector.filled(this.getDimension(), 0);
        
        // this.focus;
        this.target = null;// Entity
        this.targets = [];// Entity[]
        // this.destination = Vector.from(this.getPosition());
        this.route = null;// Vector
        this.cursor = null;// Entity
        
        this.effectiveEnergy = this.realEnergy = this.energy = 1;
        this.regeneration = 0;
        this.effects = [];
        
        this.actions = [];
        this.possibleActions = [];
        this.impossibleActions = [];
        this.abilities = [];
        this.actset = [];
        this.stale = [];
        
        this.state = [];
        
        this.gravityDirection = Vector.filled(this.getDimension(), 0);
        this.ground = false;
        
        // 
        
        this.battler = false;
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
        this.drawable.setSize(this.getSize());
        this.drawable.setPosition(this.getPosition());
        
        return this;
    }
    
    isRemovable() {
        return this.removable || this.energy <= 0;
    }
    
    setRemovable(removable) {
        this.removable = removable;
        
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
    setBlacklist(blacklist) {this.blacklist = blacklist; this.addBlacklist(this); return this;}
    
    addBlacklist(entity) {
        if(entity instanceof Entity) {
            if(!this.findBlacklist(entity)) {
                this.blacklist.push(entity);
            }
        }
        
        else if(Array.isArray(entity)) {
            for(var i = 0; i < entity.length; ++i) {
                this.addBlacklist(entity[i]);
            }
        }
        
        return this;
    }
    
    removeBlacklist(entity) {
        if(entity instanceof Entity) {
            var index = this.blacklist.indexOf(entity);
            
            if(index > -1) {
                this.blacklist.splice(index, 1);
            }
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
    
    getOtherBrake() {return this.otherBrake;}
    setOtherBrake(otherBrake) {this.otherBrake = otherBrake; return this;}
    
    getBrakeExponent() {return this.brakeExponent;}
    setBrakeExponent(brakeExponent) {this.brakeExponent = brakeExponent; return this;}
    
    getForce() {return this.force;}
    setForce(force) {
        for(var dim = 0; dim < this.getDimension(); ++dim) {
            this.force.set(dim, force[dim]);
        }
        
        return this;
    }
    
    getForceFactor() {return this.forceFactor();}
    setForceFactor(forceFactor) {this.forceFactor = forceFactor; return this;}
    
    getReplaceId() {return this.replaceId;}
    setReplaceId(replaceId) {this.replaceId = replaceId; return this;}
    
    getVacuum() {return this.vacuum;}
    setVacuum(vacuum) {this.vacuum = vacuum; return this;}
    
    getOtherThrust() {return this.otherThrust;}
    setOtherThrust(otherThrust) {this.otherThrust = otherThrust; return this;}
    
    getThrustFactor() {return this.thrustFactor;}
    setThrustFactor(thrustFactor) {this.thrustFactor = thrustFactor; return this;}
    
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
    
    regenerate(value = this.regeneration) {
        return this.heal(value);
    }
    
    setRegeneration(regeneration) {
        this.regeneration = regeneration;
        
        return this;
    }
    
    setLifespan(lifespan) {
        this.resetEnergy(lifespan);
        this.regeneration = -1;
        
        return this;
    }
    
    setEffectFactor(type, factor) {
        for(var i = 0; i < this.effects.length; ++i) {
            var eff = this.effects[i];
            
            if(eff.type == type) {
                eff.factor = factor;
                
                return this;
            }
        }
        
        this.effects.push({"type" : type, "factor" : factor});
        
        return this;
    }
    
    setOffense(type, offense) {
        for(var i = 0; i < this.effects.length; ++i) {
            var eff = this.effects[i];
            
            if(eff.type == type) {
                eff.offense = offense;
                
                return this;
            }
        }
        
        this.effects.push({"type" : type, "offense" : offense});
        
        return this;
    }
    
    getEffect(type) {
        var def = {"type" : "default", "factor" : 0, "offense" : 0};
        
        for(var i = 0; i < this.effects.length; ++i) {
            var eff = this.effects[i];
            
            if(eff.type == "default") {
                def = eff;
            } if(eff.type == type) {
                return eff;
            }
        }
        
        return def;
    }
    
    // 
    
    addState(statename, value = true) {
        for(var i = 0; i < this.state.length; ++i) {
            if(this.state[i].name == statename) {
                return this;
            }
        }
        
        this.state.push({"name" : statename, "countdown" : 1, "value" : value});
        
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
    
    hasState(statename) {
        return this.state.find(function(state) {
            return state.name == statename;
        }) != undefined;
    }
    
    getStateValue(statename) {
        for(var i = 0; i < this.state.length; ++i) {
            if(this.state[i].name == statename) {
                return this.state[i].value;
            }
        }
        
        return undefined;
    }
    
    resetState(newState = []) {
        this.state = newState;
        
        return this;
    }
    
    countdownStates() {
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
            for(var i = 0; i < Math.min(this.getDimension(), force.length); ++i) {
                this.speed[i] += force[i];
            }
        }
        
        return this;
    }
    
    advance() {
        for(var dim = 0; dim < this.getDimension(); ++dim) {
            this.position[dim] += this.speed[dim];
            this.drawable.position[dim] += this.speed[dim];
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
    
    heal(value = this.regeneration) {
        this.energy += value;
        
        if(this.energy > this.realEnergy) {
            this.energy = this.realEnergy;
        }
        
        return this;
    }
    
    dragOther(other, vector) {
        
    }
    
    dragOtherIO(other, norm) {
        
    }
    
    oncollision(other) {
        if(this.findWhitelist(other) && !this.findBlacklist(other)) {
            if(other.blockable) {
                for(var dim = 0; dim < Math.min(this.getDimension(), other.getDimension()); ++dim) {
                    other.speed[dim] += this.force[dim] * other.forceFactor;
                    
                    if(this.vacuum != 0) {
                        other.speed[dim] += this.vacuum * (this.getPositionM(dim) - other.getPositionM(dim));
                    }
                    
                    other.speed[dim] /= Math.pow(this.otherBrake, other.brakeExponent);
                    
                    if(isAlmostZero(other.speed[dim])) {
                        other.speed[dim] = 0;
                    }
                }
            }
            
            if(other.replaceable && this.replaceId != 0) {
                this.replace(other, this.replaceId);
                for(var dim = 0; dim < Math.min(this.getDimension(), other.getDimension()); ++dim) {
                    other.position[dim] += this.speed[dim];
                    other.drawable.position[dim] += this.speed[dim];
                }
            }
            
            other.hurt(this.effects);
            
            if(this.otherThrust != 0) {
                other.thrust = this.otherThrust * other.thrustFactor + other.selfThrust;
            }
            
            if(other.ground) {
                this.addState("grounded");
            }
            
            this.gravityDirection.add(other.force);
            
            this.collidedWith.push(other);
            
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
    
    replace(other, type) {
        if(type == -1) {
            return this.replace(other, this.locate(other));
        }
        
        var minDimension = Math.min(this.getDimension(), other.getDimension());
        var negative = true;
        var dimension = 0;
        
        while(type > 0 && dimension < minDimension) {
            if((type & 1) == 1) {
                if(negative && other.speed[dimension] >= 0) {
                    other.setPosition2(dimension, this.getPosition1(dimension));
                    other.drawable.setPosition2(dimension, this.getPosition1(dimension));
                } else if(!negative && other.speed[dimension] <= 0) {
                    other.setPosition1(dimension, this.getPosition2(dimension));
                    other.drawable.setPosition1(dimension, this.getPosition2(dimension));
                }
                
                other.speed[dimension] = -this.bounce * other.speed[dimension];
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
        this.heal();
        this.updateStale();
        this.updateActions();
        this.updateDrawable();
        this.advance();
        
        // this.updateReset();
        
        return this;
    }
    
    updateReset() {
        this.resetState();
        this.gravityDirection.fill(0);
        this.collidedWith.splice(0, this.collidedWith.length);
        
        return this;
    }
    
    addAction(action) {
        action.endid = "this message should be overwritten";
        
        if(!this.canUseAction(action) && !this.hasAbility(action.getAbilityId()) && !this.containsActset(action.getId())) {
            action.end("User can't use the action.");
            
            return this;
        }
        
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i].allowsReplacement(action)) {
                var replaced = this.actions[i];
                
                this.removeActionAt(i);
                replaced.setEndid("Replaced from user with another action.");
                
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
    
    removeActionAt(index) {
        if(index != -1 && this.actions[index].isRemovable()) {
            var action = this.actions[index];
            
            this.actions.splice(index, 1);
            action.end("Removed from user.");
        }
        
        return this;
    }
    
    removeAction(action) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] == action) {
                // this.actions[i].end("Removed specifically from user (removeAction).");
                this.removeActionAt(i);
            }
        }
        
        return this;
    }
    
    removeActionsWithConstructor(constructor) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(/*this.actions[i] instanceof Action && */this.actions[i].constructor == constructor) {
                // this.actions[i].end("Removed from user with a constructor match (removeActionsWithConstructor).");
                this.removeActionAt(i);
            }
        }
        
        return this;
    }
    
    removeActionsInstanceof(constructor) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof constructor) {
                // this.actions[i].end("Removed from user as instanceof (removeActionsInstanceof).");
                this.removeActionAt(i);
            }
        }
        
        return this;
    }
    
    removeActionsWithId(id) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i] instanceof Action)/**/
            if(this.actions[i].getId() == id) {
                // this.actions[i].end("Removed from user with id (removeActionsWithId).");
                this.removeActionAt(i);
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
    
    canUseAction(action) {
        for(var i = 0; i < this.possibleActions.length; ++i) {
            if(action instanceof this.possibleActions[i]) {
                var impossible = false;
                var j = 0;
                
                while(!impossible && j < this.impossibleActions.length) {
                    if(action instanceof this.impossibleActions[j]) {
                        impossible = true;
                    }
                    
                    ++j;
                }
                
                if(!impossible) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    addPossibleAction(action) {
        if(Array.isArray(action)) {
            for(var i = 0; i < action.length; ++i) {
                this.addPossibleAction(action[i]);
            }
        } else if(this.possibleActions.indexOf(action) == -1) {
            this.possibleActions.push(action);
        }
        
        return this;
    }
    
    addImpossibleAction(action) {
        if(Array.isArray(action)) {
            for(var i = 0; i < action.length; ++i) {
                this.addImpossibleAction(action[i]);
            }
        } else if(this.impossibleActions.indexOf(action) == -1) {
            this.impossibleActions.push(action);
        }
        
        return this;
    }
    
    addAbility(ability) {
        var index = this.abilities.indexOf(ability);
        
        if(index == -1) {
            this.abilities.push(ability);
        }
        
        return this;
    }
    
    addAbilities(abilities) {
        for(var i = 0; i < abilities.length; ++i) {
            this.addAbility(abilities[i]);
        }
        
        return this;
    }
    
    removeAbility(ability) {
        for(var i = this.abilities.length - 1; i >= 0; --i) {
            if(this.abilities[i] == ability) {
                this.abilities.splice(i, 1);
            }
        }
        
        return this;
    }
    
    hasAbility(ability) {
        for(var i = 0; i < this.abilities.length; ++i) {
            if(this.abilities[i] == ability) {
                return true;
            }
        }
        
        return false;
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
    
    makeStale(id, value) {
        for(var i = 0; i < this.stale.length; ++i) {
            if(this.stale[i].id == id) {
                this.stale[i].value += value;
                // this.stale[i].value = Math.max(this.stale[i].value, value);
                
                return this;
            }
        }
        
        this.stale.push({"id" : id, "value" : value});
        
        return this;
    }
    
    getStale(id) {
        for(var i = 0; i < this.stale.length; ++i) {
            if(this.stale[i].id == id) {
                return this.stale[i].value;
            }
        }
        
        return 0;
    }
    
    updateStale() {
        for(var i = this.stale.length - 1; i >= 0; --i) {
            if(--this.stale[i].value <= 0) {
                this.stale.splice(i, 1);
            }
        }
        
        return this;
    }
    
    // 
    
    isBattler() {
        return this.battler;
    }
    
    setBattler(battler) {
        this.battler = battler;
        
        return this;
    }
    
    // 
    
    onadd() {
        addDrawable(this.drawable);
        
        return this;
    }
    
    onremove() {
        this.removeBlacklist(this);
        removeDrawable(this.drawable);
        
        return this;
    }
    
    // 
    
    addInteraction(interaction) {
        if(interaction instanceof Interactor) {
            interaction.setActor(this);
            
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
            
            for(var i = 0; i < this.interrecipients.length; ++i) {
                var interrecipient = this.interrecipients[i];
                
                if(interrecipient.matchId(interaction.getId())) {
                    interrecipient.setActor(null);
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
}
