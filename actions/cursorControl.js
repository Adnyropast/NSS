
const AS_FOCUS = gather("holdFocus", "pressFocus", "mouseFocus", "moveFocus", "freeKeyFocus");

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
        
        if(this.user.cursor.target == null) {
            this.end();
        }
        
        return this;
    }
    
    onend() {
        this.user.cursor.target = null;
        // console.log("holdfocus ended");
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
        
        this.user.cursor.centerTarget();
        
        return this;
    }
    
    preventsAddition(action) {
        if(action instanceof PressFocus) {
            this.user.cursor.setPositionM(this.user.getPositionM());
            this.end();
        }
        
        return action.getAbilityId() == "cursorControl" || super.preventsAddition(action);
    }
}

class MouseFocus extends FocusAction {
    constructor() {
        super();
        this.id = "mouseFocus";
        this.order = -1;
        this.allowMoveFocus = false;
    }
    
    use() {
        if(mouse.moveValue == 1 || mouse.value(1) == 1) {
            this.user.cursor.setPositionM(getMousePosition());
            this.allowMoveFocus = false;
        } else {
            // console.log(this.user.actions);
            this.allowMoveFocus = true;
        }
        
        this.end();
        
        return this;
    }
    
    preventsAddition(action) {
        return action.getId() == "moveFocus" || super.preventsAddition(action);
    }
}

class KeySteer extends Action {
    constructor() {
        super();
        this.setId("keySteer");
    }
    
    use() {
        var direction = getKDirection();
        
        if(!direction.isZero()) {
            this.user.direction.set(direction);
        }
        
        return this;
    }
}

class MoveFocus extends FocusAction {
    constructor() {
        super();
        this.id = "moveFocus";
        this.order = -1;
        
        this.keySteer = new KeySteer();
    }
    
    use() {
        /**
        
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
        
        /**/
        
        if(this.phase == 0) {
            this.user.addAction(this.keySteer);
        }
        
        this.user.cursor.setPositionM(this.user.direction.plus(this.user.getPositionM()));
        
        return this;
    }
    
    allowsReplacement(action) {
        return AS_FOCUS.includes(action.getId()) && !(action instanceof MoveFocus);
    }
    
    onend() {
        this.user.removeAction(this.keySteer);
        
        return super.onend();
    }
}

class FreeKeyFocus extends FocusAction {
    constructor() {
        super();
        this.id = "freeKeyFocus";
        this.order = -1;
    }
    
    use() {
        this.user.cursor.drag(getKDirection(K_CLEFT, K_CUP, K_CRIGHT, K_CDOWN));
        this.end();
        
        return this;
    }
}
