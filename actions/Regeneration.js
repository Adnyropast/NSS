
class Regeneration extends Action {
    constructor(value = 0) {
        super();
        
        this.value = value;
    }
    
    use() {
        this.user.heal(this.value);
        
        return this;
    }
    
    allowsReplacement(action) {
        return false;
    }
    
    preventsAddition(action) {return false;}
}
