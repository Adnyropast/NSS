
const AS_CUTTER = gather("cutterBoomerang", "cutterDash", "finalCutter");

class CutterAbility extends Action {
    constructor() {
        super();
        this.abilityId = "cutter";
    }
}

class CutterBoomerang extends CutterAbility {
    constructor() {
        super();
        this.setId("cutterBoomerang");
    }
    
    use() {
        if(this.phase < 10) {
            this.user.style = "#FFFFFF";
        }
        if(this.phase == 10) {
            var boomerang = Entity.fromMiddle(this.user.getXM(), this.user.getYM(), 16, 16);
            boomerang.setSpeed(Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(16));
            boomerang.route = this.user.getPositionM();
            boomerang.addAction(new Movement(0.75));
            boomerang.setBlacklist(this.user.getBlacklist());
            boomerang.setLifespan(60);
            addEntity(boomerang);
            
            this.end();
        }
        
        return this;
    }
}

class CutterDash extends CutterAbility {
    constructor() {
        super();
        this.setId("cutterDash");
        
        this.direction = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.direction = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(this.user.thrust * 2);
        }
        if(this.phase < 16) {
            this.user.drag(this.direction);
        }
        
        if(this.phase == 24) {
            this.end();
        }
        
        return this;
    }
    
    onend() {
        console.log("cutterdash end");
    }
}

class FinalCutter extends CutterAbility {
    constructor() {
        super();
        this.setId("finalCutter");
    }
    
    use() {
        return this;
    }
}
