
class Battler {
    constructor() {
        this.speedPriority = 0;
        this.pick = null;
        this.ready = false;
        
        this.statuses = [];
        this.entity = null;
    }
    
    static fromEntity(entity) {
        var battler = new this();
        
        battler.setEntity(entity);
        
        return battler;
    }
    
    getPriority() {
        return this.speedPriority;
    }
    
    setReady(ready) {this.ready = ready; return this;}
    isReady() {return this.ready;}
    
    updateStatuses() {
        for(var i = this.statuses.length; i >= 0; --i) {
            --this.statuses[i].turns;
            
            if(this.statuses[i].turns <= 0) {
                this.statuses.splice(i, 1);
            }
        }
        
        return this;
    }
    
    setEntity(entity) {this.entity = entity; return this;}
    getEntity() {return this.entity;}
}

class Skill {
    constructor() {
        this.user = null;
        
        this.priority = 0;
    }
    
    getPriority() {return this.priority;}
    setPriority(priority) {this.priority = priority; return this;}
    
    use() {
        return this;
    }
}
