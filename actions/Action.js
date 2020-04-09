
function actionClass_forName(className) {
    const actionClass = class_forName(className);
    
    return class_extends(actionClass, Action) ? actionClass : Action;
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
        this.useCost = 0;
        this.order = 0;
        
        this.endId = undefined;
        this.phaseLimit = 255;
        
        this.removable = true;
        
        this.className = this.constructor.name;
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
    
    getUseCost() {
        if(this.user != null) {
            return this.user.negotiateActionCost(this.useCost);
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
    
    setEndId(endId) {
        this.endId = endId;
        
        return this;
    }
    
    end(endId = 0) {
        if(this.endId === undefined && this.isRemovable()) {
            const user = this.user;
        
            this.endId = endId;
            
            if(user != null) {
                this.onend();
            }
            
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
        return this.getClassName() === action.getClassName();
    }
    
    isRemovable() {return this.removable;}
    setRemovable(removable) {this.removable = removable; return this;}
    
    hasEnded() {
        return this.endId !== undefined;
    }
    
    getClassName() {
        return this.className;
    }
}

const busyBannedActions = new SetArray();

class BusyAction extends Action {
    onadd() {
        this.user.removeActions(function(action) {
            return busyBannedActions.includes(action.constructor);
        });
        
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
        for(let i = 0; i < busyBannedActions.length; ++i) {
            if(action instanceof busyBannedActions[i]) {
                return true;
            }
        }
        
        return !(action instanceof StunState) && super.preventsAddition(action);
    }
}

busyBannedActions.add(BusyAction);
