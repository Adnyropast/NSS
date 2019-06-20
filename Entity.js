
var entityID = -1;

class Entity extends Rectangle {
    constructor(x, y, width, height) {
        super([x, y], [width, height]);
        
        // Graphic
        this.zIndex = 0;
        this.style = "#000000";
        
        // frame in game ?
        this.icpf = 16;
        this.icount = 0;
        this.iindex = 0;
        
        // Speed 
        this.speed = Vector.filled(this.getDimension(), 0);
        
        // Collision
        this.removable = false;
        this.collidable = true;
        this.drawable = true;
        
        this.blockable = false;
        this.replaceable = false;
        
        this.whitelist = COLLIDABLE;
        this.blacklist = [this];
        
        // Physics
        // Movements : Brake
        this.selfBrake = 1;
        this.otherBrake = 1;
        this.brakeExponent = 1;
        this.force = new Vector(0, 0);
        this.forceFactor = 1;
        this.replaceID = 0;
        this.vacuum = 0;
        // Direction
        this.direction = Vector.filled(this.getDimension(), 0);
        this.thrust = 0;
        this.otherThrust = 0;
        this.thrustFactor = 1;
        this.selfThrust = 0;

        // type Entity => pass to Action ? 
        this.target = null;
        
        this.route = null;// Vector
        this.cursor = null;// Entity
        
        this.effectiveEnergy = this.realEnergy = this.energy = 1;
        this.regeneration = 0;
        
        this.effects = [];
        this.actions = [];
        this.state = [];
        
        
    }
    
    static fromData(data) {
        var entity = new this();
        
        if(typeof data.x != "undefined") {
            entity.setX(data.x);
        } if(typeof data.y != "undefined") {
            entity.setY(data.y);
        } if(typeof data.xM != "undefined") {
            entity.setPositionM(0, data.xM);
        } if(typeof data.yM != "undefined") {
            entity.setPositionM(1, data.yM);
        } if(typeof data.x2 != "undefined") {
            entity.setPositionM(0, data.x2);
        } if(typeof data.y2 != "undefined") {
            entity.setPositionM(1, data.x2);
        }
        
        if(Array.isArray(data.position)) {
            entity.setPosition(data.position);
        } if(Array.isArray(data.positionM)) {
            entity.setPositionM(data.positionM);
        } if(Array.isArray(data.size)) {
            entity.setSize(data.size);
        }
        
        if(typeof data.id != "undefined") {
            entity.setID(data.id);
        }
        
        Object.assign(entity, data);
        
        return entity;
    }
    
    static fromMiddle(xm, ym, width, height) {
        return new this(xm - width / 2, ym - height / 2, width, height);
    }
    
    getZIndex() {
        return this.zIndex;
    }
    
    setZIndex(zIndex) {
        this.zIndex = zIndex;
        
        return this;
    }
    
    getStyle() {
        if(Array.isArray(this.style) && this.style.length > 0) {
            ++this.icount;
            
            if(this.icount >= this.icpf) {
                this.icount = 0;
                ++this.iindex; this.iindex %= this.style.length;
            }
            
            return this.style[this.iindex];
        }
        
        return this.style;
    }
    
    setStyle(style) {
        if(this.style != style) {
            this.style = style;
            this.icount = 0;
        }
        
        return this;
    }
    
    setICPF(icpf) {
        this.icpf = icpf;
        
        return this;
    }
    
    isRemovable() {
        return this.removable || this.energy <= 0;
    }
    
    setRemovable(removable) {
        this.removable = removable;
        
        return this;
    }
    
    setCollidable(collidable) {
        this.collidable = collidable;
        
        return this;
    }
    
    isCollidable() {
        return this.collidable;
    }
    
    setDrawable(drawable) {
        this.drawable = drawable;
        
        return this;
    }
    
    isDrawable() {
        return this.drawable;
    }
    
    isBlockable() {
        return this.blockable;
    }
    
    setBlockable(blockable) {
        this.blockable = blockable;
        
        return this;
    }
    
    isReplaceable() {
        return this.replaceable;
    }
    
    setReplaceable(replaceable) {
        this.replaceable = replaceable;
        
        return this;
    }
    
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
    
    getSelfBrake() {
        return this.selfBrake;
    }
    
    setSelfBrake(selfBrake) {
        this.selfBrake = selfBrake;
        
        return this;
    }
    
    getOtherBrake() {
        return this.otherBrake;
    }
    
    setOtherBrake(otherBrake) {
        this.otherBrake = otherBrake;
        
        return this;
    }
    
    getBrakeExponent() {
        return this.brakeExponent;
    }
    
    setBrakeExponent(brakeExponent) {
        this.brakeExponent = brakeExponent;
        
        return this;
    }
    
    getForce() {
        return this.force;
    }
    
    setForce(force) {
        this.force = force;
        
        return this;
    }
    
    getForceFactor() {
        return this.forceFactor();
    }
    
    setForceFactor(forceFactor) {
        this.forceFactor = forceFactor;
        
        return this;
    }
    
    getReplaceID() {
        return this.replaceID;
    }
    
    setReplaceID(replaceID) {
        this.replaceID = replaceID;
        
        return this;
    }
    
    getVacuum() {
        return this.vacuum;
    }
    
    setVacuum(vacuum) {
        this.vacuum = vacuum;
        
        return this;
    }
    
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
    
    getrealEnergy() {
        return this.realEnergy;
    }
    
    setrealEnergy(realEnergy) {
        this.realEnergy = realEnergy;
        
        return this;
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
            this.setrealEnergy(realEnergy);
            this.setEnergy(this.realEnergy);
        }
        
        return this;
    }
    
    regenerate() {
        this.heal(this.regeneration);
        
        return this;
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
    
    addState(statename) {
        for(var i = 0; i < this.state.length; ++i) {
            if(this.state[i].name == statename) {
                return this;
            }
        }
        
        this.state.push({"name" : statename, "countdown" : -1});
        
        return this;
    }
    
    hasState(statename) {
        return this.state.find(function(state) {
            return state.name == statename;
        }) != undefined;
    }
    
    resetState(newState = []) {
        this.state = newState;
        
        return this;
    }
    
    // 
    
    drag(force) {
        if(arguments.length == 2) {
            this.speed[arguments[0]] += arguments[1];
        } else if(Array.isArray(force)) {
            for(var i = 0; i < Math.min(force.length); ++i) {
                this.speed[i] += force[i];
            }
        }
        
        return this;
    }
    
    advance() {
        for(var i = 0; i < this.getDimension(); ++i) {
            this.position[i] += this.speed[i];
            this.speed[i] /= this.selfBrake;
        }
        
        return this;
    }
    
    brake() {
        if(arguments.length == 2) {
            var dimension = arguments[0], value = arguments[1];
            
            this.speed[dimension] /= value;
            
            if(Math.abs(this.speed[dimension]) < ALMOST_ZERO) {
                this.speed[dimension] = 0;
            }
        } else if(arguments.length == 1 && typeof arguments[0] == "number") {
            var value = arguments[0];
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this.speed[dim] /= value;
                
                if(Math.abs(this.speed[dim]) < ALMOST_ZERO) {
                    this.speed[dimension] = 0;
                }
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
    
    heal(value) {
        this.energy += value;
        
        if(this.energy > this.realEnergy) {
            this.energy = this.realEnergy;
        }
        
        return this;
    }
    
    oncollision(other) {
        if(this.findWhitelist(other) && !this.findBlacklist(other)) {
            if(other.blockable) {
                for(var i = 0; i < Math.min(this.getDimension(), other.getDimension()); ++i) {
                    other.speed[i] += this.force[i] * other.forceFactor;
                    
                    if(this.vacuum != 0) {
                        other.speed[i] += this.vacuum * (this.getPositionM(i) - other.getPositionM(i));
                    }
                    
                    other.speed[i] /= Math.pow(this.otherBrake, other.brakeExponent);
                    
                    if(this.speed[i] != 0) {
                        other.position[i] += this.speed[i];
                    }
                    
                    if(Math.abs(other.speed[i]) < ALMOST_ZERO) {
                        other.speed[i] = 0;
                    }
                }
            }
            
            if(other.replaceable) {
                this.replace(other, this.replaceID);
            }
            
            other.hurt(this.effects);
            
            if(this.otherThrust != 0) {
                other.thrust = this.otherThrust * other.thrustFactor + other.selfThrust;
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
                } else if(!negative && other.speed[dimension] <= 0) {
                    other.setPosition1(dimension, this.getPosition2(dimension));
                }
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
        this.regenerate()
        this.updateActions();
        this.advance()
        
        return this;
    }
    
    addAction(action) {
        if(action.getUseCost() >= this.getEnergy()) {
            return this;
        }
        
        for(var i = 0; i < this.actions.length; ++i) {
            if(this.actions[i].allowsReplacement(action)) {
                this.actions[i] = action;
                this.hurt(action.getUseCost());
                return this;
            }
            
            if(this.actions[i].getID() == action.getID()) {
                return this;
            }
        }
        
        action.setUser(this);
        this.actions.push(action);
        this.hurt(action.getUseCost());
        
        return this;
    }
    
    removeAction(action) {
        for(var i = this.actions.length - 1; i >= 0; --i) {
            if(this.actions[i].getID() == action.getID()) {
                this.actions[i].end();
                this.actions.splice(i, 1);
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
            
            action.use();
            action.incPhase();
        }
        
        return this;
    }
}
