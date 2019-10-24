
var actionid = -1;
const ACT_JUMP = ++actionid;
const ACT_TELEPORT = ++actionid;
const ACT_PROJECTILE = ++actionid;
const ACT_TARGETATTACK = ++actionid;
const ACT_MOVEMENT = ++actionid;

const AC = {};

function getActionClass(actionId) {
    if(AC.hasOwnProperty(actionId)) {
        return AC[actionId];
    }
    
    console.warn(actionId + " not registered in AC.");
    
    return Action;
}

/**
 * The Action class represents any action that can be performed by a character.
 * Do not start anyhting that would change the game in the constructor, do it during the phase 0 in the use method instead.
 * user equals null in the constructor, it is defined starting from phase 0.
 */

class Action {
    static getCursorRange() {
        return 0;
    }
    
    static getCursorStyle() {
        return "#0000007F";
    }
    
    constructor() {
        this.user = null;
        this.phase = 0;
        this.id = -1;
        this.useCost = 0;
        this.order = 0;
        
        this.endid = -1;
        this.phaseLimit = 255;
        
        this.removable = true;
    }
    
    getUser() {
        return this.user;
    }
    
    setUser(user) {
        this.user = user;
        
        return this;
    }
    
    getPhase() {
        return this.phase;
    }
    
    incPhase() {
        ++this.phase;
        
        if(this.phase > this.phaseLimit) {
            this.phase = this.phaseLimit;
        }
        
        return this;
    }
    
    getId() {
        return this.id;
    }
    
    setId(id) {
        this.id = id;
        
        return this;
    }
    
    getUseCost() {
        if(this.user != null) {
            return this.useCost * this.user.stats["action-costFactor"];
        }
        
        return this.useCost;
    }
    
    setUseCost(useCost) {
        this.useCost = useCost;
        
        return this;
    }
    
    getOrder() {
        return this.order;
    }
    
    setOrder(order) {
        this.order = order;
        
        return this;
    }
    
    use() {
        return this.end();
    }
    
    setEndid(endid) {this.endid = endid; return this;}
    
    end(endid = 0) {
        if(this.user != null && this.isRemovable()) {
            this.endid = endid;
            this.onend();
            
            var user = this.user;
            this.user = null;
            
            if(user != null) {
                user.removeAction(this);
            }
        }
        
        return this;
    }
    
    onadd() {
        return this;
    }
    
    onend() {
        return this;
    }
    
    allowsReplacement(action) {
        return false;
    }
    
    preventsAddition(action) {
        return this.id === action.id;
    }
    
    isRemovable() {return this.removable;}
    setRemovable(removable) {this.removable = removable; return this;}
    
    matchId(id) {
        return this.id === id;
    }
    
    sharesId(action) {
        return action instanceof Action && this.id === action.id;
    }
}

class BusyAction extends Action {
    onadd() {
        this.user.removeActionsWithId(ACT_MOVEMENT);
        
        return this;
    }
    
    allowsReplacement(action) {
        if(action instanceof StunState) {
            this.setRemovable(true);
            
            return true;
        }
        
        return false;
    }
    
    preventsAddition(action) {
        return !(action instanceof StunState) && (action instanceof BusyAction || super.preventsAddition(action) || action.id === ACT_JUMP || action.id === ACT_MOVEMENT);
    }
}
