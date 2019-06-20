
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
        
        return this;
    }
    
    getID() {
        return this.id;
    }
    
    setID(id) {
        this.id = id;
        
        return this;
    }
    
    getUseCost() {
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
    
    use() { return this.end(); }
    
    end() {
        if(this.user != null) {
            this.onend();
            
            var user = this.user;
            this.user = null;
            user.removeAction(this);
        }
        
        return this;
    }
    
    onend() {
        return this;
    }
    
    allowsReplacement(action) {
        return false;
    }
}
