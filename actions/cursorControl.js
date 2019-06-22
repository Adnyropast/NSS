
const AS_FOCUS = gather("");

class FocusAction extends Action {
    constructor() {
        super();
        this.setAbilityId("cursorControl");
    }
}

class HoldFocus extends FocusAction {
    constructor() {
        super();
        this.id = "holdFocus";
        this.order = -1;
    }
    
    use() {
        // console.log("holdfocus #" + this.phase);
        
        if(this.phase == 0) {
            this.user.cursor.setNextTarget();
        }
        
        this.user.cursor.centerTarget();
        
        return this;
    }
    
    onend() {
        console.log("holdfocus ended");
    }
}

class PressFocus extends FocusAction {
    constructor() {
        super();
        this.id = "pressFocus";
        this.order = -1;
    }
    
    use() {
        if(this.phase == 0) {
            this.user.cursor.setNextTarget();
        }
        
        if(this.phase > 0 && keyList.value(K_PRESSFOCUS) == 1) {
            this.user.cursor.setPositionM(this.user.getPositionM());
            this.end();
        } else {
            this.user.cursor.centerTarget();
        }
        
        return this;
    }
    
    onend() {
        console.log("press focus ended");
    }
}

class MouseFocus extends FocusAction {
    constructor() {
        super();
        this.id = "mouseFocus";
        this.order = -1;
    }
    
    use() {
        if(mouse.moveValue == 1) {
            this.user.cursor.setPositionM(getMousePosition());
        }
        
        this.end();
        
        return this;
    }
}

class MoveFocus extends FocusAction {
    constructor() {
        super();
        this.id = "moveFocus";
        this.order = -1;
    }
    
    use() {
        // console.log("movefocus #" + this.phase);
        
        if(this.phase == 0) {
            this.user.cursor.setPositionM(Vector.addition(this.user.getPositionM(), this.user.speed));
        }
        
        // this.user.cursor.setPositionM(this.user.route.minus(this.user.getPositionM()).multiply(this.user.cursorDistance).add(this.user.getPositionM()));
        this.user.cursor.setPositionM(this.user.route.minus(this.user.getPositionM()).normalize(this.user.cursorDistance).add(this.user.getPositionM()));
        // this.user.cursor.route = getKDirection().add(this.user.getPositionM());
        // this.user.cursor.speed = this.user.speed;
        
        // if(this.phase > 0 && this.user.speed.isZero()) {
            // this.end();
        // }
        
        return this;
    }
    
    allowsReplacement(action) {
        return false && action.id == "cursorControl" && !(action instanceof MoveFocus);
    }
    
    onadd() {
        // console.log("babababa");
    }
    
    onend() {
        console.error("movefocus ended");
    }
}

class FreeKeyFocus extends FocusAction {
    constructor() {
        super();
        this.id = "freeKeyFocus";
        this.order = -1;
    }
    
    use() {
        this.user.cursor.drag(getKDirection(CLEFT, CUP, CRIGHT, CDOWN));
        this.end();
        
        return this;
    }
}
