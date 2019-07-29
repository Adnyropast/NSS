
class Regeneration extends Action {
    constructor(value = 0) {
        super();
        this.setId("regeneration");
        
        this.value = value;
    }
    
    use() {
        this.user.heal(this.value);
        
        return this;
    }
    
    allowsReplacement(action) {
        return false;
        return action.getId() == "regeneration";
    }
    
    preventsAddition(action) {return false;}
}
